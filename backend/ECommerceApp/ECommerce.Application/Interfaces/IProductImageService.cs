using ECommerce.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Interfaces
{
    public interface IProductImageService
    {
        Task<IEnumerable<ProductImageDTO>> GetProductImagesAsync(int productId);

        Task AddImagesAsync(
            int productId,
            List<string> imageUrls);

        Task<bool> DeleteImageAsync(int imageId);

        Task<bool> SetPrimaryImageAsync(int imageId);

        Task<ProductImageDTO?> GetImageByIdAsync(int imageId);
    }
}
