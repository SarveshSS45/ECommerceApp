using System.Security.Claims;
using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistService _wishlistService;

        public WishlistController(
            IWishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new ApiResponse<string>(
                        false,
                        "User not authenticated",
                        null));
            }

            int userId =
                int.Parse(userIdClaim.Value);

            var wishlist =
                await _wishlistService
                    .GetWishlistAsync(userId);

            return Ok(wishlist);
        }

        [HttpPost]
        public async Task<IActionResult> AddToWishlist(
            [FromBody] CreateWishlistDTO dto)
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(
                    new ApiResponse<string>(
                        false,
                        "User not authenticated",
                        null));
            }

            int userId =
                int.Parse(userIdClaim.Value);

            var result =
                await _wishlistService
                    .AddToWishlistAsync(
                        userId,
                        dto);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new ApiResponse<string>(false, "User not authenticated", null));
            }

            int userId =
                int.Parse(userIdClaim.Value);

            var result = await _wishlistService.RemoveFromWishlistAsync(userId, productId);

            if (!result.Success)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpGet("check/{productId}")]
        public async Task<IActionResult> CheckWishlist(int productId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            int userId = int.Parse(userIdClaim.Value);

            var exists = await _wishlistService.IsProductInWishlistAsync(userId, productId);

            return Ok(new
            {
                isInWishlist = exists
            });
        }
    }
}