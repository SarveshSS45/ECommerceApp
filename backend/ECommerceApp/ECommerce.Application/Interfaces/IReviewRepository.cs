using ECommerce.Domain.Entities;

namespace ECommerce.Application.Interfaces
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetReviewsByProductIdAsync(int productId);

        Task AddReviewAsync(Review review);

        Task<bool> UserAlreadyReviewedAsync(int userId, int productId);

        Task<(double AverageRating, int ReviewCount)> GetReviewSummaryAsync(int productId);

        Task<Review?> GetReviewByIdAsync(int reviewId);

        Task UpdateReviewAsync(Review review);

        Task DeleteReviewAsync(Review review);
    }
}