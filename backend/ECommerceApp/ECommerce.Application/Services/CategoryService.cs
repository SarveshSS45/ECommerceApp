using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(
            ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        // GET ALL CATEGORIES
        public async Task<IEnumerable<CategoryDTO>>
            GetAllCategoriesAsync()
        {
            var categories =
                await _categoryRepository
                    .GetAllCategoriesAsync();

            return categories.Select(category =>
                new CategoryDTO
                {
                    Id = category.Id,
                    Name = category.Name
                });
        }

        // GET CATEGORY BY ID
        public async Task<CategoryDTO?>
            GetCategoryByIdAsync(int id)
        {
            var category =
                await _categoryRepository
                    .GetCategoryByIdAsync(id);

            if (category == null)
                return null;

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        // CREATE CATEGORY
        public async Task<CategoryDTO>
            CreateCategoryAsync(
                CategoryCreateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception(
                    "Category name is required");

            var category = new Category
            {
                Name = dto.Name.Trim()
            };

            var createdCategory =
                await _categoryRepository
                    .AddCategoryAsync(category);

            return new CategoryDTO
            {
                Id = createdCategory.Id,
                Name = createdCategory.Name
            };
        }

        // UPDATE CATEGORY
        public async Task<CategoryDTO?>
            UpdateCategoryAsync(
                int id,
                CategoryUpdateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new Exception(
                    "Category name is required");

            var existingCategory =
                await _categoryRepository
                    .GetCategoryByIdAsync(id);

            if (existingCategory == null)
                return null;

            existingCategory.Name =
                dto.Name.Trim();

            var updatedCategory =
                await _categoryRepository
                    .UpdateCategoryAsync(
                        existingCategory);

            if (updatedCategory == null)
                return null;

            return new CategoryDTO
            {
                Id = updatedCategory.Id,
                Name = updatedCategory.Name
            };
        }

        // DELETE CATEGORY
        public async Task<bool>
            DeleteCategoryAsync(int id)
        {
            return await _categoryRepository
                .DeleteCategoryAsync(id);
        }
    }
}