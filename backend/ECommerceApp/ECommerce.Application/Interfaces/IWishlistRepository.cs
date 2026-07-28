using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IWishlistRepository
    {
        Task<IEnumerable<Wishlist>>
            GetWishlistByUserIdAsync(int userId);

        Task<bool>
            IsProductInWishlistAsync(
                int userId,
                int productId);

        Task AddWishlistAsync(
            Wishlist wishlist);

        Task<Wishlist?>
            GetWishlistItemAsync(
                int userId,
                int productId);

        Task DeleteWishlistAsync(
            Wishlist wishlist);
    }
}