using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IWishlistService
    {
        Task<IEnumerable<WishlistDTO>> GetWishlistAsync(int userId);

        Task<ApiResponse<string>> AddToWishlistAsync(int userId, CreateWishlistDTO dto);

        Task<ApiResponse<string>> RemoveFromWishlistAsync(int userId, int productId);

        Task<bool> IsProductInWishlistAsync(int userId, int productId);
    }
}