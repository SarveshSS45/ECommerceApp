using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace ECommerceApp.Controllers
{
    [Authorize(Roles = "Admin")]
    [ApiController]
    [Route("api/admin/products")]
    public class AdminProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly IWebHostEnvironment _environment;

        public AdminProductsController(
            IProductService productService,
            IWebHostEnvironment environment)
        {
            _productService = productService;
            _environment = environment;
        }

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok(new
            {
                success = true,
                message = "Admin Access Granted"
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products =
                await _productService.GetAllProductsAsync();

            return Ok(new ApiResponse<object>(
                true,
                "Products fetched successfully",
                products
            ));
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDTO dto, IFormFile? image)
        {
            var imageUrl =
                await SaveImageAsync(image);

            dto.ImageUrl = imageUrl ?? "";

            var createdProduct =
                await _productService.CreateProductAsync(dto);

            return Ok(new ApiResponse<object>(
                true,
                "Product created successfully",
                createdProduct
            ));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] ProductUpdateDTO dto, IFormFile? image)
        {
            var existingProduct =
                await _productService.GetProductByIdAsync(id);

            if (existingProduct == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Product not found"
                });
            }

            if (image != null)
            {
                // Delete old image
                DeleteImage(existingProduct.ImageUrl);

                // Save new image
                var imageUrl = await SaveImageAsync(image);

                dto.ImageUrl = imageUrl ?? "";
            }
            else
            {
                // Keep existing image
                dto.ImageUrl = existingProduct.ImageUrl;
            }

            var updatedProduct =
                await _productService.UpdateProductAsync(
                    id,
                    dto);

            return Ok(new ApiResponse<object>(
                true,
                "Product updated successfully",
                updatedProduct
            ));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var existingProduct =
                await _productService.GetProductByIdAsync(id);

            if (existingProduct == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Product not found"
                });
            }

            // Delete image from folder
            DeleteImage(existingProduct.ImageUrl);

            var deleted =
                await _productService.DeleteProductAsync(id);

            if (!deleted)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Product not found"
                });
            }

            return Ok(new
            {
                success = true,
                message = "Product deleted successfully"
            });
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


        private void DeleteImage(string? imageUrl)
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
                Console.WriteLine(
                    $"Image deletion failed: {ex.Message}");
            }
        }
    }
}