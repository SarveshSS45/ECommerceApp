using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IConfiguration _config;

        private readonly IOrderService _orderService;


        public OrdersController(IOrderService orderService, IConfiguration config)
        {
            _orderService = orderService;
            _config = config;
        }


        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDTO dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                dto.UserId = userId;

                // VALIDATE INPUT
                if (string.IsNullOrEmpty(dto.RazorpayPaymentId) ||
                    string.IsNullOrEmpty(dto.RazorpayOrderId) ||
                    string.IsNullOrEmpty(dto.RazorpaySignature))
                {
                    return BadRequest("Invalid payment data");
                }

                // GET SECRET
                string secret = _config["Razorpay:Secret"];

                if (string.IsNullOrEmpty(secret))
                {
                    return StatusCode(500, "Payment configuration error");
                }

                // CREATE SIGNATURE
                string payload = dto.RazorpayOrderId + "|" + dto.RazorpayPaymentId;

                var hash = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
                var generatedSignature = BitConverter
                    .ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(payload)))
                    .Replace("-", "")
                    .ToLower();

                //  VERIFY SIGNATURE
                if (!generatedSignature.Equals(dto.RazorpaySignature, StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest("Payment verification failed");
                }

                //  CREATE ORDER
                var order = await _orderService.CreateOrderAsync(dto);

                return Ok(new { message = "Order created", orderId = order.Id });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] string status)
        {
            try
            {
                var validStatuses = new[]
                {
            "Pending",
            "Paid",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

                if (!validStatuses.Contains(status))
                {
                    return BadRequest("Invalid order status");
                }

                var order = await _orderService.GetOrderByIdAsync(id);

                if (order == null)
                {
                    return NotFound();
                }

                await _orderService.UpdateOrderStatusAsync(id, status);

                return Ok(new
                {
                    message = "Order status updated"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //[HttpPost]
        //public async Task<IActionResult> CreateOrder(CreateOrderDTO dto)
        //{
        //    try
        //    {
        //        string secret = _config["Razorpay:Secret"];

        //        string payload = dto.RazorpayOrderId + "|" + dto.RazorpayPaymentId;

        //        var hash = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
        //        var generatedSignature = BitConverter
        //            .ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(payload)))
        //            .Replace("-", "")
        //            .ToLower();

        //        // ADD THIS LOGGING
        //        Console.WriteLine("----- DEBUG -----");
        //        Console.WriteLine("OrderId: " + dto.RazorpayOrderId);
        //        Console.WriteLine("PaymentId: " + dto.RazorpayPaymentId);
        //        Console.WriteLine("Frontend Signature: " + dto.RazorpaySignature);
        //        Console.WriteLine("Generated Signature: " + generatedSignature);
        //        Console.WriteLine("------------------");

        //        //if (generatedSignature != dto.RazorpaySignature)
        //        //{
        //        //    return BadRequest("❌ Payment verification failed");
        //        //}

        //        var order = await _orderService.CreateOrderAsync(dto);

        //        return Ok(new { message = "Order created", orderId = order.Id });
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [Authorize]
        [HttpGet("user")]
        public async Task<IActionResult> GetOrdersByUser()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var orders = await _orderService.GetOrdersByUserIdAsync(userId);

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);

            if (order == null)
                return NotFound();

            return Ok(order);
        }
    }
}