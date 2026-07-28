import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createReview,
  updateReview,
} from "../services/reviewService";

const ReviewForm = ({
  productId,
  onReviewAdded,
  editingReview,
  clearEdit,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setComment(editingReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [editingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error(
        "Please enter a review",
      );
      return;
    }

    try {
      setLoading(true);

      if (editingReview) {
        await updateReview(
          editingReview.id,
          {
            productId: Number(
              productId,
            ),
            rating,
            comment,
          },
        );

        toast.success(
          "Review updated ⭐",
        );

        clearEdit();
      } else {
        await createReview({
          productId: Number(
            productId,
          ),
          rating,
          comment,
        });

        toast.success(
          "Review added ⭐",
        );
      }

      setComment("");
      setRating(5);

      onReviewAdded();
    } catch (err) {
      toast.error(
        err.response?.data
          ?.message ||
          "Operation failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">
        {editingReview
          ? "Edit Review"
          : "Write a Review"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block mb-2">
            Rating
          </label>

          <div className="flex gap-1 text-3xl">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setRating(star)
                  }
                  className={`${
                    star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ),
            )}
          </div>
        </div>

        <textarea
          rows={4}
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value,
            )
          }
          className="border rounded px-3 py-2 w-full"
          placeholder="Share your experience..."
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-500 text-white px-6 py-2 rounded"
          >
            {loading
              ? "Saving..."
              : editingReview
              ? "Update Review"
              : "Submit Review"}
          </button>

          {editingReview && (
            <button
              type="button"
              onClick={clearEdit}
              className="bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;