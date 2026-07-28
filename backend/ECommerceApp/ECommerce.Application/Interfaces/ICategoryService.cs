using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();

        Task<CategoryDTO?> GetCategoryByIdAsync(int id);

        Task<CategoryDTO> CreateCategoryAsync(CategoryCreateDTO dto);

        Task<CategoryDTO?> UpdateCategoryAsync(int id,CategoryUpdateDTO dto);

        Task<bool> DeleteCategoryAsync(int id);
    }
}