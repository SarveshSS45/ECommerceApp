using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL CATEGORIES
        public async Task<IEnumerable<Category>>
            GetAllCategoriesAsync()
        {
            return await _context.Categories
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        // GET CATEGORY BY ID
        public async Task<Category?>
            GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        // CREATE CATEGORY
        public async Task<Category>
            AddCategoryAsync(Category category)
        {
            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return category;
        }

        // UPDATE CATEGORY
        public async Task<Category?>
            UpdateCategoryAsync(Category category)
        {
            var existingCategory =
                await _context.Categories
                    .FindAsync(category.Id);

            if (existingCategory == null)
                return null;

            existingCategory.Name = category.Name;

            await _context.SaveChangesAsync();

            return existingCategory;
        }

        // DELETE CATEGORY
        public async Task<bool>
            DeleteCategoryAsync(int id)
        {
            var category =
                await _context.Categories
                    .FindAsync(id);

            if (category == null)
                return false;

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}