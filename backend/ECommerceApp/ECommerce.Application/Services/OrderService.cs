using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;
    private readonly ICouponService _couponService;

    public OrderService(IOrderRepository repository, ICouponService couponService)
    {
        _repository = repository;
        _couponService = couponService;

    }

    public async Task<Order> CreateOrderAsync(CreateOrderDTO dto)
    {
        Order createdOrder = null;

        await _repository.ExecuteInTransactionAsync(async () =>
        {
            var existingOrder = await _repository.GetOrderByPaymentIdAsync(dto.RazorpayPaymentId);

            if (existingOrder != null)
                throw new Exception("Order already processed for this payment");

            decimal total = 0;
            var items = new List<OrderItem>();

            foreach (var item in dto.Items)
            {
                var product = await _repository.GetProductByIdAsync(item.ProductId);

                if (product == null)
                    throw new Exception($"Product with ID {item.ProductId} not found");

                if (item.Quantity <= 0)
                    throw new Exception("Invalid quantity");

                if (product.Stock < item.Quantity)
                    throw new Exception(
                        $"Insufficient stock for {product.Name}. Available: {product.Stock}"
                    );
            }

            foreach (var item in dto.Items)
            {
                var product = await _repository.GetProductByIdAsync(item.ProductId);

                total += product.Price * item.Quantity;

                product.Stock -= item.Quantity;
                await _repository.UpdateProductAsync(product);

                items.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price
                });
            }

            createdOrder = new Order
            {
                UserId = dto.UserId,

                AddressId = dto.AddressId,

                TotalAmount = total,

                Status = "Paid",

                CreatedAt = DateTime.UtcNow,

                RazorpayPaymentId = dto.RazorpayPaymentId,

                Items = items
            };

            await _repository.CreateOrderAsync(createdOrder);

            if (!string.IsNullOrWhiteSpace(dto.CouponCode))
            {
                await _couponService
                    .IncrementCouponUsageAsync(dto.CouponCode);
            }
        });

        return createdOrder;
    }

    public async Task<List<OrderResponseDTO>> GetOrdersByUserIdAsync(int userId)
    {
        var orders = await _repository.GetOrdersByUserIdAsync(userId);

        return orders.Select(o => new OrderResponseDTO
        {
            Id = o.Id,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            CreatedAt = o.CreatedAt,

            RazorpayPaymentId = o.RazorpayPaymentId,

            AddressId = o.AddressId,

            Address = new AddressDTO
            {
                Id = o.Address.Id,
                FullName = o.Address.FullName,
                MobileNumber = o.Address.MobileNumber,
                AddressLine1 = o.Address.AddressLine1,
                AddressLine2 = o.Address.AddressLine2,
                City = o.Address.City,
                State = o.Address.State,
                PostalCode = o.Address.PostalCode,
                Country = o.Address.Country,
                AddressType = o.Address.AddressType,
                IsDefault = o.Address.IsDefault
            },

            Items = o.Items.Select(i => new OrderItemResponseDTO
            {
                Id = i.Id,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                ProductImage = i.Product.ImageUrl,
                Price = i.Price
            }).ToList()
        }).ToList();
    }

    public async Task<OrderResponseDTO> GetOrderByIdAsync(int orderId)
    {
        var order = await _repository.GetOrderByIdAsync(orderId);

        if (order == null)
            return null;

        return new OrderResponseDTO
        {
            Id = order.Id,
            Status = order.Status,
            TotalAmount = order.TotalAmount,
            CreatedAt = order.CreatedAt,

            RazorpayPaymentId = order.RazorpayPaymentId,

            AddressId = order.AddressId,

            Address = new AddressDTO
            {
                Id = order.Address.Id,
                FullName = order.Address.FullName,
                MobileNumber = order.Address.MobileNumber,
                AddressLine1 = order.Address.AddressLine1,
                AddressLine2 = order.Address.AddressLine2,
                City = order.Address.City,
                State = order.Address.State,
                PostalCode = order.Address.PostalCode,
                Country = order.Address.Country,
                AddressType = order.Address.AddressType,
                IsDefault = order.Address.IsDefault
            },

            Items = order.Items.Select(i => new OrderItemResponseDTO
            {
                Id = i.Id,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                ProductImage = i.Product.ImageUrl,
                Price = i.Price
            }).ToList()
        };
    }

    public async Task UpdateOrderStatusAsync(int orderId, string status)
    {
        await _repository.UpdateOrderStatusAsync(orderId, status);
    }

    public async Task<List<OrderResponseDTO>> GetAllOrdersAsync()
    {
        var orders = await _repository.GetAllOrdersAsync();

        return orders.Select(o => new OrderResponseDTO
        {
            Id = o.Id,
            Status = o.Status,
            TotalAmount = o.TotalAmount,
            CreatedAt = o.CreatedAt,

            UserName = o.User.Name,
            UserEmail = o.User.Email,

            RazorpayPaymentId = o.RazorpayPaymentId,

            AddressId = o.AddressId,

            Address = new AddressDTO
            {
                Id = o.Address.Id,
                FullName = o.Address.FullName,
                MobileNumber = o.Address.MobileNumber,
                AddressLine1 = o.Address.AddressLine1,
                AddressLine2 = o.Address.AddressLine2,
                City = o.Address.City,
                State = o.Address.State,
                PostalCode = o.Address.PostalCode,
                Country = o.Address.Country,
                AddressType = o.Address.AddressType,
                IsDefault = o.Address.IsDefault
            },

            Items = o.Items.Select(i => new OrderItemResponseDTO
            {
                Id = i.Id,
                ProductName = i.Product.Name,
                Quantity = i.Quantity,
                Price = i.Price
            }).ToList()
        }).ToList();
    }
}