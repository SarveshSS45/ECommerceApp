using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();

        Task<Product?> GetProductByIdAsync(int id);

        Task<Product> AddProductAsync(Product product);

        Task<Product?> UpdateProductAsync(Product product);

        Task<bool> DeleteProductAsync(int id);

        Task<(IEnumerable<Product> Products, int TotalCount)>
            SearchProductsAsync(ProductSearchDTO searchDto);


        Task UpdateProductImageAsync(int productId, string imageUrl);
    }
}