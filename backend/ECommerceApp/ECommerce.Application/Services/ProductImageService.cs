using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Infrastructure.Services
{
    public class ProductImageService : IProductImageService
    {
        private readonly IProductImageRepository _productImageRepository;
        private readonly IProductRepository _productRepository;

        public ProductImageService(
            IProductImageRepository productImageRepository,
            IProductRepository productRepository)
        {
            _productImageRepository = productImageRepository;
            _productRepository = productRepository;
        }


        public async Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(int productId)
        {
            var images = await _productImageRepository
                .GetByProductIdAsync(productId);

            return images.Select(image => new ProductImageDTO
            {
                Id = image.Id,
                ProductId = image.ProductId,
                ImageUrl = image.ImageUrl,
                IsPrimary = image.IsPrimary,
                DisplayOrder = image.DisplayOrder
            });
        }

        public async Task AddImagesAsync(int productId, List<string> imageUrls)
        {

            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            var primaryImage = await _productImageRepository.GetPrimaryImageAsync(productId);

            // Get existing images of the product
            var existingImages = (await _productImageRepository
                .GetByProductIdAsync(productId))
                .ToList();

            var productImages = new List<ProductImage>();

            // Continue after the highest DisplayOrder
            int displayOrder = existingImages.Any() ? existingImages.Max(x => x.DisplayOrder) + 1 : 1;

            foreach (var imageUrl in imageUrls)
            {
                productImages.Add(new ProductImage
                {
                    ProductId = productId,
                    ImageUrl = imageUrl,
                    IsPrimary = false,
                    DisplayOrder = displayOrder++
                });
            }

            if (primaryImage == null && productImages.Any())
            {
                productImages.First().IsPrimary = true;
            }

            await _productImageRepository.AddRangeAsync(productImages);

            await _productImageRepository.SaveChangesAsync();

            if (primaryImage == null && productImages.Any())
            {
                await _productRepository.UpdateProductImageAsync(
                    productId,
                    productImages.First().ImageUrl);
            }

        }

        public async Task<bool> DeleteImageAsync(int imageId)
        {

            var image = await _productImageRepository.GetByIdAsync(imageId);

            if (image == null)
                return false;

            bool isPrimary = image.IsPrimary;

            int productId = image.ProductId;

            await _productImageRepository.DeleteAsync(image);

            await _productImageRepository.SaveChangesAsync();

            if (!isPrimary)
                return true;

            var remainingImages =
    (await _productImageRepository.GetByProductIdAsync(productId))
    .OrderBy(x => x.DisplayOrder)
    .ToList();

            if (!remainingImages.Any())
            {
                await _productRepository.UpdateProductImageAsync(productId, "");

                return true;
            }

            var newPrimary = remainingImages.First();

            newPrimary.IsPrimary = true;

            await _productImageRepository.SaveChangesAsync();

            await _productRepository.UpdateProductImageAsync(productId, newPrimary.ImageUrl);

            return true;

        }

        public async Task<bool> SetPrimaryImageAsync(int imageId)
        {

            var image = await _productImageRepository.GetByIdAsync(imageId);

            if (image == null)
                return false;

            var currentPrimary = await _productImageRepository.GetPrimaryImageAsync(image.ProductId);

            if (currentPrimary != null)
            {
                currentPrimary.IsPrimary = false;
            }

            image.IsPrimary = true;
            await _productImageRepository.SaveChangesAsync();
            await _productRepository.UpdateProductImageAsync(
    image.ProductId,
    image.ImageUrl);

            return true;


        }

        public async Task<ProductImageDTO?> GetImageByIdAsync(int imageId)
        {
            var image = await _productImageRepository.GetByIdAsync(imageId);

            if (image == null)
                return null;

            return new ProductImageDTO
            {
                Id = image.Id,
                ProductId = image.ProductId,
                ImageUrl = image.ImageUrl,
                IsPrimary = image.IsPrimary,
                DisplayOrder = image.DisplayOrder
            };
        }
    }
}