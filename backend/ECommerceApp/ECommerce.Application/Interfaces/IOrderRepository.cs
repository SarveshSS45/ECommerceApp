using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);

        Task<Product?> GetProductByIdAsync(int productId);

        Task<List<Order>> GetOrdersByUserIdAsync(int userId);

        Task<List<Order>> GetAllOrdersAsync();

        Task<Order?> GetOrderByIdAsync(int orderId);

        Task UpdateProductAsync(Product product);

        Task<Order?> GetOrderByPaymentIdAsync(string paymentId);

        Task ExecuteInTransactionAsync(Func<Task> action);

        Task UpdateOrderStatusAsync(int orderId, string status);

        Task SaveChangesAsync();
    }
}