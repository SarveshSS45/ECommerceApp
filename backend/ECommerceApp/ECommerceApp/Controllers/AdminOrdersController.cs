using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/orders")]
    public class AdminOrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public AdminOrdersController(
            IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders =
                await _orderService.GetAllOrdersAsync();

            return Ok(new ApiResponse<object>(
                true,
                "Orders fetched successfully",
                orders
            ));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order =
                await _orderService.GetOrderByIdAsync(id);

            if (order == null)
                return NotFound(new
                {
                    success = false,
                    message = "Order not found"
                });

            return Ok(new ApiResponse<object>(
                true,
                "Order fetched successfully",
                order
            ));
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(
            int id,
            UpdateOrderStatusDTO dto)
        {
            var allowedStatuses = new[]
{
    "Pending",
    "Paid",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
    "Cancelled"
};

            if (!allowedStatuses.Contains(dto.Status))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid order status"
                });
            }

            await _orderService.UpdateOrderStatusAsync(
                id,
                dto.Status
            );

            return Ok(new
            {
                success = true,
                message = "Order status updated successfully"
            });
        }
    }
}