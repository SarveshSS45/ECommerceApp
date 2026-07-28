using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // GET ALL PRODUCTS
        public async Task<IEnumerable<ProductDTO>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllProductsAsync();

            return products.Select(product => new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,

                CategoryName = product.Category?.Name,
            });
        }

        // GET PRODUCT BY ID
        public async Task<ProductDTO?> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetProductByIdAsync(id);

            if (product == null)
                return null;

            return new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                ImageUrl = product.ImageUrl,
                CategoryId = product.CategoryId,

                CategoryName = product.Category?.Name,
            };
        }

        // CREATE PRODUCT
        public async Task<ProductDTO> CreateProductAsync(ProductCreateDTO dto)
        {
            if (dto.Price < 0)
                throw new Exception("Price cannot be negative");

            if (dto.Stock < 0)
                throw new Exception("Stock cannot be negative");

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                Stock = dto.Stock,
                ImageUrl = dto.ImageUrl,
                CategoryId = dto.CategoryId
            };

            var createdProduct =
                await _productRepository.AddProductAsync(product);

            return new ProductDTO
            {
                Id = createdProduct.Id,
                Name = createdProduct.Name,
                Description = createdProduct.Description,
                Price = createdProduct.Price,
                Stock = createdProduct.Stock,
                ImageUrl = createdProduct.ImageUrl,
                CategoryId = createdProduct.CategoryId,

                CategoryName = createdProduct.Category?.Name ?? ""
            };
        }

        // UPDATE PRODUCT
        public async Task<ProductDTO?> UpdateProductAsync(
            int id,
            ProductUpdateDTO dto)
        {
            var existingProduct =
                await _productRepository.GetProductByIdAsync(id);

            if (existingProduct == null)
                return null;

            if (dto.Price < 0)
                throw new Exception("Price cannot be negative");

            if (dto.Stock < 0)
                throw new Exception("Stock cannot be negative");

            existingProduct.Name = dto.Name;
            existingProduct.Description = dto.Description;
            existingProduct.Price = dto.Price;
            existingProduct.Stock = dto.Stock;
            existingProduct.ImageUrl = dto.ImageUrl;
            existingProduct.CategoryId = dto.CategoryId;

            var updatedProduct =
                await _productRepository.UpdateProductAsync(existingProduct);

            if (updatedProduct == null)
                return null;

            return new ProductDTO
            {
                Id = updatedProduct.Id,
                Name = updatedProduct.Name,
                Description = updatedProduct.Description,
                Price = updatedProduct.Price,
                Stock = updatedProduct.Stock,
                ImageUrl = updatedProduct.ImageUrl,
                CategoryId = updatedProduct.CategoryId,
                CategoryName = updatedProduct.Category?.Name ?? ""
            };
        }

        // DELETE PRODUCT
        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteProductAsync(id);
        }

        public async Task<PagedResultDTO<ProductDTO>> SearchProductsAsync(ProductSearchDTO searchDto)
        {
            if (searchDto.PageNumber <= 0)
                searchDto.PageNumber = 1;

            if (searchDto.PageSize <= 0)
                searchDto.PageSize = 10;

            if (searchDto.PageSize > 50)
                searchDto.PageSize = 50;

            var (products, totalCount) =
                await _productRepository.SearchProductsAsync(searchDto);

            var productDtos = products.Select(product =>
                new ProductDTO
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    Price = product.Price,
                    Stock = product.Stock,
                    ImageUrl = product.ImageUrl,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category?.Name
                });

            return new PagedResultDTO<ProductDTO>
            {
                Items = productDtos,

                CurrentPage = searchDto.PageNumber,

                PageSize = searchDto.PageSize,

                TotalCount = totalCount,

                TotalPages = (int)Math.Ceiling(
                    totalCount / (double)searchDto.PageSize)
            };
        }
    }
}