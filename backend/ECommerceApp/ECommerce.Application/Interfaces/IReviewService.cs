using ECommerce.Application.DTOs;

namespace ECommerce.Application.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDTO>> GetReviewsByProductIdAsync(int productId);

        Task<ApiResponse<string>> CreateReviewAsync(
            int userId,
            CreateReviewDTO reviewDto);

        Task<ReviewSummaryDTO> GetReviewSummaryAsync(int productId);

        Task<ApiResponse<string>> UpdateReviewAsync(
            int reviewId,
            int userId,
            CreateReviewDTO reviewDto);

        Task<ApiResponse<string>> DeleteReviewAsync(
            int reviewId,
            int userId);
    }
}