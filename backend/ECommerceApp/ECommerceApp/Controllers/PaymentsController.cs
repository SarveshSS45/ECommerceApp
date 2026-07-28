using ECommerce.Application.DTOs;
using ECommerce.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentsController(
            PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        public class CreatePaymentDTO
        {
            public decimal Amount { get; set; }
        }

        [HttpPost("create-order")]
        public IActionResult CreateOrder([FromBody] CreatePaymentDTO dto)
        {
            Console.WriteLine($"Amount Received = {dto.Amount}");

            var order = _paymentService.CreateOrder(dto.Amount);

            return Ok(new ApiResponse<object>(true, "Payment order created successfully", order));
        }
    }
}