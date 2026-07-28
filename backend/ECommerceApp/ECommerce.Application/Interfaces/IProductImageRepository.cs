using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IProductImageRepository
    {
        Task<IEnumerable<ProductImage>> GetByProductIdAsync(int productId);

        Task<ProductImage?> GetByIdAsync(int id);

        Task AddRangeAsync(IEnumerable<ProductImage> productImages);

        Task DeleteAsync(ProductImage productImage);

        Task<ProductImage?> GetPrimaryImageAsync(int productId);

        Task SaveChangesAsync();
    }
}