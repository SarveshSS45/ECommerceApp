using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponsController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        // ===============================
        // GET ALL COUPONS (ADMIN)
        // ===============================

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllCoupons()
        {
            var coupons = await _couponService.GetAllCouponsAsync();

            return Ok(coupons);
        }

        // ===============================
        // GET COUPON BY ID (ADMIN)
        // ===============================

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCouponById(int id)
        {
            var coupon = await _couponService.GetCouponByIdAsync(id);

            if (coupon == null)
            {
                return NotFound(
                    new ApiResponse<string>(
                        false,
                        "Coupon not found.",
                        null));
            }

            return Ok(coupon);
        }

        // ===============================
        // CREATE COUPON (ADMIN)
        // ===============================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateCoupon(
            [FromBody] CreateCouponDTO dto)
        {
            var result =
                await _couponService.CreateCouponAsync(dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // ===============================
        // UPDATE COUPON (ADMIN)
        // ===============================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoupon(
            int id,
            [FromBody] CreateCouponDTO dto)
        {
            var result =
                await _couponService.UpdateCouponAsync(id, dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // ===============================
        // DELETE COUPON (ADMIN)
        // ===============================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var result =
                await _couponService.DeleteCouponAsync(id);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // ===============================
        // APPLY COUPON (USER)
        // ===============================

        [Authorize]
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyCoupon(
            [FromBody] ApplyCouponDTO dto)
        {
            var result =
                await _couponService.ApplyCouponAsync(dto);

            if (!result.IsValid)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}