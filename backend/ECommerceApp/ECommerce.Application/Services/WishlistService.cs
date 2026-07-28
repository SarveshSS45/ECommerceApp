using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IWishlistRepository _wishlistRepository;

        public WishlistService(
            IWishlistRepository wishlistRepository)
        {
            _wishlistRepository = wishlistRepository;
        }

        public async Task<IEnumerable<WishlistDTO>>
            GetWishlistAsync(int userId)
        {
            var wishlistItems =
                await _wishlistRepository
                    .GetWishlistByUserIdAsync(userId);

            return wishlistItems.Select(w => new WishlistDTO
            {
                Id = w.Id,

                ProductId = w.ProductId,

                ProductName = w.Product.Name,

                Price = w.Product.Price,

                ImageUrl = w.Product.ImageUrl
            });
        }

        public async Task<ApiResponse<string>>
            AddToWishlistAsync(
                int userId,
                CreateWishlistDTO dto)
        {
            var exists =
                await _wishlistRepository
                    .IsProductInWishlistAsync(
                        userId,
                        dto.ProductId);

            if (exists)
            {
                return new ApiResponse<string>(
                    false,
                    "Product already in wishlist");
            }

            var wishlist = new Wishlist
            {
                UserId = userId,
                ProductId = dto.ProductId,
                CreatedAt = DateTime.UtcNow
            };

            await _wishlistRepository
                .AddWishlistAsync(wishlist);

            return new ApiResponse<string>(
                true,
                "Product added to wishlist");
        }

        public async Task<ApiResponse<string>>
            RemoveFromWishlistAsync(
                int userId,
                int productId)
        {
            var wishlistItem =
                await _wishlistRepository
                    .GetWishlistItemAsync(
                        userId,
                        productId);

            if (wishlistItem == null)
            {
                return new ApiResponse<string>(
                    false,
                    "Wishlist item not found");
            }

            await _wishlistRepository
                .DeleteWishlistAsync(wishlistItem);

            return new ApiResponse<string>(
                true,
                "Product removed from wishlist");
        }

        public async Task<bool>
    IsProductInWishlistAsync(
        int userId,
        int productId)
        {
            return await _wishlistRepository
                .IsProductInWishlistAsync(
                    userId,
                    productId);
        }
    }
}