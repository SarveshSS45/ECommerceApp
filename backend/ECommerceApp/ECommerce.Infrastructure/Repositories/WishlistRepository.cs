using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly AppDbContext _context;

        public WishlistRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Wishlist>>
            GetWishlistByUserIdAsync(int userId)
        {
            return await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool>
            IsProductInWishlistAsync(
                int userId,
                int productId)
        {
            return await _context.Wishlists
                .AnyAsync(w =>
                    w.UserId == userId &&
                    w.ProductId == productId);
        }

        public async Task AddWishlistAsync(
            Wishlist wishlist)
        {
            await _context.Wishlists
                .AddAsync(wishlist);

            await _context.SaveChangesAsync();
        }

        public async Task<Wishlist?>
            GetWishlistItemAsync(
                int userId,
                int productId)
        {
            return await _context.Wishlists
                .FirstOrDefaultAsync(w =>
                    w.UserId == userId &&
                    w.ProductId == productId);
        }

        public async Task DeleteWishlistAsync(
            Wishlist wishlist)
        {
            _context.Wishlists.Remove(wishlist);

            await _context.SaveChangesAsync();
        }
    }
}