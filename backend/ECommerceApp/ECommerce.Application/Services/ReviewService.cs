using ECommerce.Application.DTOs;
using ECommerce.Application.Interfaces;
using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;

        public ReviewService(IReviewRepository reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<IEnumerable<ReviewDTO>> GetReviewsByProductIdAsync(int productId)
        {
            var reviews = await _reviewRepository
                .GetReviewsByProductIdAsync(productId);

            return reviews.Select(r => new ReviewDTO
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.User.Name,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            });
        }

        public async Task<ApiResponse<string>> CreateReviewAsync(
            int userId,
            CreateReviewDTO reviewDto)
        {
            if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return new ApiResponse<string>(false, "Rating must be between 1 and 5");
            }

            var alreadyReviewed =
                await _reviewRepository.UserAlreadyReviewedAsync(
                    userId,
                    reviewDto.ProductId);

            if (alreadyReviewed)
            {
                return new ApiResponse<string>(false, "You have already reviewed this product.");
            }

            var review = new Review
            {
                ProductId = reviewDto.ProductId,
                UserId = userId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _reviewRepository.AddReviewAsync(review);

            return new ApiResponse<string>(true, "Review added successfully");
        }

        public async Task<ReviewSummaryDTO> GetReviewSummaryAsync(int productId)
        {
            var summary = await _reviewRepository.GetReviewSummaryAsync(productId);

            return new ReviewSummaryDTO
            {
                AverageRating = summary.AverageRating,
                ReviewCount = summary.ReviewCount
            };
        }

        public async Task<ApiResponse<string>> UpdateReviewAsync(
    int reviewId,
    int userId,
    CreateReviewDTO reviewDto)
        {
            var review = await _reviewRepository
                .GetReviewByIdAsync(reviewId);

            if (review == null)
            {
                return new ApiResponse<string>(
                    false,
                    "Review not found");
            }

            if (review.UserId != userId)
            {
                return new ApiResponse<string>(
                    false,
                    "You can only edit your own review");
            }

            if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return new ApiResponse<string>(
                    false,
                    "Rating must be between 1 and 5");
            }

            review.Rating = reviewDto.Rating;
            review.Comment = reviewDto.Comment;

            await _reviewRepository.UpdateReviewAsync(review);

            return new ApiResponse<string>(
                true,
                "Review updated successfully");
        }

        public async Task<ApiResponse<string>> DeleteReviewAsync(
            int reviewId,
            int userId)
        {
            var review = await _reviewRepository
                .GetReviewByIdAsync(reviewId);

            if (review == null)
            {
                return new ApiResponse<string>(
                    false,
                    "Review not found");
            }

            if (review.UserId != userId)
            {
                return new ApiResponse<string>(
                    false,
                    "You can only delete your own review");
            }

            await _reviewRepository.DeleteReviewAsync(review);

            return new ApiResponse<string>(
                true,
                "Review deleted successfully");
        }
    }
}