import toast from "react-hot-toast";
import { deleteReview } from "../services/reviewService";

const ReviewList = ({
  reviews,
  currentUserId,
  onEdit,
  onReviewDeleted,
}) => {
  if (!reviews.length) {
    return (
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Reviews
        </h2>

        <p className="text-gray-500">
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  const handleDelete = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteReview(reviewId);

      toast.success("Review deleted successfully 🗑️");

      onReviewDeleted();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        Reviews ({reviews.length})
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-4 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                {review.userName}
              </h3>

              <span className="text-yellow-500">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>

            {/* Comment */}
            <p className="mt-2 text-gray-700">
              {review.comment}
            </p>

            {/* Date */}
            <p className="mt-2 text-sm text-gray-500">
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </p>

            {/* Edit/Delete Buttons */}
            {review.userId ===
              Number(currentUserId) && (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    onEdit(review)
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(review.id)
                  }
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;