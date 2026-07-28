using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories
{
    public class ProductImageRepository : IProductImageRepository
    {
        private readonly AppDbContext _context;

        public ProductImageRepository(AppDbContext context)
        {
            _context = context;
        }

        // Methods will be added here

        public async Task<IEnumerable<ProductImage>> GetByProductIdAsync(int productId)
        {
            return await _context.ProductImages
                .Where(pi => pi.ProductId == productId)
                .OrderBy(pi => pi.DisplayOrder)
                .ToListAsync();
        }

        public async Task<ProductImage?> GetByIdAsync(int id)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(pi => pi.Id == id);
        }

        public async Task<ProductImage?> GetPrimaryImageAsync(int productId)
        {
            return await _context.ProductImages
                .FirstOrDefaultAsync(pi =>
                    pi.ProductId == productId &&
                    pi.IsPrimary);
        }

        public async Task AddRangeAsync(IEnumerable<ProductImage> productImages)
        {
            await _context.ProductImages.AddRangeAsync(productImages);
        }
        public Task DeleteAsync(ProductImage productImage)
        {
            _context.ProductImages.Remove(productImage);

            return Task.CompletedTask;
        }
        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}