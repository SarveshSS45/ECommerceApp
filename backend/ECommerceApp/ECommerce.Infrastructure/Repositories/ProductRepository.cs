using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using ECommerce.Application.DTOs;

namespace ECommerce.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _context;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL PRODUCTS
        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        // GET PRODUCT BY ID
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
        }

        // ADD PRODUCT
        public async Task<Product> AddProductAsync(Product product)
        {
            _context.Products.Add(product);

            await _context.SaveChangesAsync();

            return product;
        }

        // UPDATE PRODUCT
        public async Task<Product?> UpdateProductAsync(Product product)
        {
            var existingProduct =
                await _context.Products.FindAsync(product.Id);

            if (existingProduct == null)
                return null;

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Price = product.Price;
            existingProduct.Stock = product.Stock;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.CategoryId = product.CategoryId;

            await _context.SaveChangesAsync();

            return existingProduct;
        }

        // DELETE PRODUCT
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product =
                await _context.Products.FindAsync(id);

            if (product == null)
                return false;

            _context.Products.Remove(product);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<(IEnumerable<Product> Products, int TotalCount)> SearchProductsAsync(ProductSearchDTO searchDto)
        {
            var query = _context.Products.Include(p => p.Category).AsQueryable();

            // SEARCH
            if (!string.IsNullOrWhiteSpace(searchDto.SearchTerm))
            {
                query = query.Where(p =>
                    p.Name.Contains(searchDto.SearchTerm));
            }

            // CATEGORY FILTER
            if (searchDto.CategoryId.HasValue)
            {
                query = query.Where(
                    p => p.CategoryId == searchDto.CategoryId.Value);
            }

            //Min 
            if (searchDto.MinPrice.HasValue)
                query = query.Where(p => p.Price >= searchDto.MinPrice.Value);
            //Max
            if (searchDto.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= searchDto.MaxPrice.Value);

            // SORTING
            query = searchDto.SortBy?.ToLower() switch
            {
                "oldest" => query.OrderBy(p => p.Id),

                "priceasc" => query.OrderBy(p => p.Price),

                "pricedesc" => query.OrderByDescending(p => p.Price),

                "nameasc" => query.OrderBy(p => p.Name),

                "namedesc" => query.OrderByDescending(p => p.Name),

                _ => query.OrderByDescending(p => p.Id) // Newest
            };

            // TOTAL COUNT
            var totalCount = await query.CountAsync();

            // In Stock Filter
            if (searchDto.InStock == true)
            {
                query = query.Where(p => p.Stock > 0);
            }

            // PAGINATION
            var products = await query
                .Skip((searchDto.PageNumber - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            Console.WriteLine($"Products Count: {products.Count}");

            foreach (var p in products)
            {
                Console.WriteLine(
                    $"{p.Id} - {p.Name} - CategoryId: {p.CategoryId}");
            }

            return (products, totalCount);
        }

        public async Task UpdateProductImageAsync(int productId, string imageUrl)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
                return;

            product.ImageUrl = imageUrl;

            await _context.SaveChangesAsync();
        }
    }
}