using Microsoft.AspNetCore.Mvc;
using ECommerce.Application.Interfaces;
using ECommerce.Application.DTOs;

namespace ECommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(
            IProductService productService)
        {
            _productService = productService;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product =
                await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Product not found"
                });
            }

            return Ok(new ApiResponse<object>(
                true,
                "Product fetched successfully",
                product
            ));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(
    [FromQuery] ProductSearchDTO searchDto)
        {
            var result =
                await _productService.SearchProductsAsync(searchDto);

            return Ok(new ApiResponse<object>(
                true,
                "Products fetched successfully",
                result
            ));
        }
    }
}