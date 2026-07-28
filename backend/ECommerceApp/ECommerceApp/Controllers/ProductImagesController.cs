using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/product-images")]
    public class ProductImagesController : ControllerBase
    {
        private readonly IProductImageService _productImageService;
        private readonly IWebHostEnvironment _environment;

        public ProductImagesController(
            IProductImageService productImageService,
            IWebHostEnvironment environment)
        {
            _productImageService = productImageService;
            _environment = environment;
        }

        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductImages(int productId)
        {
            var images =
                await _productImageService.GetProductImagesAsync(productId);

            return Ok(new ApiResponse<object>(
                true,
                "Images fetched successfully",
                images));
        }

        [HttpPost]
        public async Task<IActionResult> UploadImages(
    [FromForm] int productId,
    [FromForm] List<IFormFile> images)
        {
            if (images == null || !images.Any())
            {
                return BadRequest(new ApiResponse<object>(
                    false,
                    "Please select at least one image."
                ));
            }

            var imageUrls = await SaveImagesAsync(images);

            await _productImageService.AddImagesAsync(
                productId,
                imageUrls);

            return Ok(new ApiResponse<object>(
                true,
                "Images uploaded successfully."
            ));
        }

        private async Task<List<string>> SaveImagesAsync(
    List<IFormFile> images)
        {
            var imageUrls = new List<string>();

            foreach (var image in images)
            {
                var imageUrl = await SaveImageAsync(image);

                if (!string.IsNullOrWhiteSpace(imageUrl))
                {
                    imageUrls.Add(imageUrl);
                }
            }

            return imageUrls;
        }

        private async Task<string?> SaveImageAsync(IFormFile? image)
        {
            if (image == null || image.Length == 0)
                return null;

            var uploadsFolder = Path.Combine(
                _environment.WebRootPath,
                "images",
                "products");

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var fileName =
                $"{Guid.NewGuid()}_{image.FileName}";

            var filePath =
                Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(
                filePath,
                FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            return $"/images/products/{fileName}";
        }

        [HttpDelete("{imageId}")]
        public async Task<IActionResult> DeleteImage(int imageId)
        {
            var image = await _productImageService.GetImageByIdAsync(imageId);

            if (image == null)
            {
                return NotFound(new ApiResponse<object>(
                    false,
                    "Image not found."
                ));
            }

            DeleteImageFile(image.ImageUrl);

            var deleted = await _productImageService.DeleteImageAsync(imageId);

            if (!deleted)
            {
                return NotFound(new ApiResponse<object>(
                    false,
                    "Image not found."
                ));
            }

            return Ok(new ApiResponse<object>(
                true,
                "Image deleted successfully."
            ));
        }

        private void DeleteImageFile(string? imageUrl)
        {
            if (string.IsNullOrWhiteSpace(imageUrl))
                return;

            try
            {
                var imagePath = Path.Combine(
                    _environment.WebRootPath,
                    imageUrl
                        .TrimStart('/')
                        .Replace('/', Path.DirectorySeparatorChar));

                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Image deletion failed: {ex.Message}");
            }
        }

        [HttpPut("{imageId}/primary")]
        public async Task<IActionResult> SetPrimaryImage(int imageId)
        {
            var updated =
                await _productImageService.SetPrimaryImageAsync(imageId);

            if (!updated)
            {
                return NotFound(new ApiResponse<object>(
                    false,
                    "Image not found."
                ));
            }

            return Ok(new ApiResponse<object>(
                true,
                "Primary image updated successfully."
            ));
        }

        
    }
}