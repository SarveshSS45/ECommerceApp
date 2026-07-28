using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(CreateOrderDTO dto);


        Task<List<OrderResponseDTO>> GetOrdersByUserIdAsync(int userId);


        Task<OrderResponseDTO> GetOrderByIdAsync(int orderId);

        Task<List<OrderResponseDTO>> GetAllOrdersAsync();

        Task UpdateOrderStatusAsync(int orderId, string status);
    }
}