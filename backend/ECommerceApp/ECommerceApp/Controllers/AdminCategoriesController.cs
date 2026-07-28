using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceApp.Controllers
{
    [ApiController]
    [Route("api/admin/categories")]
    public class AdminCategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public AdminCategoriesController(
            ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories =
                await _categoryService.GetAllCategoriesAsync();

            return Ok(new ApiResponse<object>(
                true,
                "Categories fetched successfully",
                categories
            ));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory(
            CategoryCreateDTO dto)
        {
            var category =
                await _categoryService.CreateCategoryAsync(dto);

            return Ok(new ApiResponse<object>(
                true,
                "Category created successfully",
                category
            ));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id,CategoryUpdateDTO dto)
        {
            var category =
                await _categoryService.UpdateCategoryAsync(id, dto);

            if (category == null)
            {
                return NotFound(
                    new ApiResponse<object>(
                        false,
                        "Category not found",
                        null
                    ));
            }

            return Ok(new ApiResponse<object>(
                true,
                "Category updated successfully",
                category
            ));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result =
                await _categoryService.DeleteCategoryAsync(id);

            if (!result)
            {
                return NotFound(
                    new ApiResponse<object>(
                        false,
                        "Category not found",
                        null
                    ));
            }

            return Ok(new ApiResponse<object>(
                true,
                "Category deleted successfully",
                null
            ));
        }
    }
}