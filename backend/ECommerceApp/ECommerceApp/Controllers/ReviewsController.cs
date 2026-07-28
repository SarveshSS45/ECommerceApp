using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetReviewsByProduct(int productId)
        {
            var reviews = await _reviewService
                .GetReviewsByProductIdAsync(productId);

            return Ok(reviews);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview(
            [FromBody] CreateReviewDTO reviewDto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new ApiResponse<string>(false, "User not authenticated", null));
            }

            int userId = int.Parse(userIdClaim.Value);

            var result = await _reviewService.CreateReviewAsync(userId, reviewDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("product/{productId}/summary")]
        public async Task<IActionResult> GetReviewSummary(int productId)
        {
            var summary = await _reviewService.GetReviewSummaryAsync(productId);

            return Ok(summary);
        }

        [Authorize]
        [HttpPut("{reviewId}")]
        public async Task<IActionResult> UpdateReview(int reviewId, [FromBody] CreateReviewDTO reviewDto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new ApiResponse<string>(
                        false,
                        "User not authenticated"));
            }

            int userId = int.Parse(userIdClaim.Value);

            var result = await _reviewService
                .UpdateReviewAsync(
                    reviewId,
                    userId,
                    reviewDto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{reviewId}")]
        public async Task<IActionResult> DeleteReview(
            int reviewId)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new ApiResponse<string>(
                        false,
                        "User not authenticated"));
            }

            int userId = int.Parse(userIdClaim.Value);

            var result = await _reviewService
                .DeleteReviewAsync(
                    reviewId,
                    userId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }
    }
}