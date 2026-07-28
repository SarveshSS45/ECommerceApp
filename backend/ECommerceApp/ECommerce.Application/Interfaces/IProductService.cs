using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDTO>> GetAllProductsAsync();

        Task<ProductDTO?> GetProductByIdAsync(int id);

        Task<ProductDTO> CreateProductAsync(ProductCreateDTO dto);

        Task<ProductDTO?> UpdateProductAsync(int id, ProductUpdateDTO dto);

        Task<bool> DeleteProductAsync(int id);

        Task<PagedResultDTO<ProductDTO>> SearchProductsAsync(ProductSearchDTO searchDto);
    }
}