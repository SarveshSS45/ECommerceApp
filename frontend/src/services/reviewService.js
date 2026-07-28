import api from "./api";

// Get reviews
export const getReviewsByProduct = async (
  productId,
) => {
  const response = await api.get(
    `/Reviews/product/${productId}`,
  );

  return response.data;
};

// Create review
export const createReview = async (
  reviewData,
) => {
  const response = await api.post(
    "/Reviews",
    reviewData,
  );

  return response.data;
};

// Update review
export const updateReview = async (
  reviewId,
  reviewData,
) => {
  const response = await api.put(
    `/Reviews/${reviewId}`,
    reviewData,
  );

  return response.data;
};

// Delete review
export const deleteReview = async (
  reviewId,
) => {
  const response = await api.delete(
    `/Reviews/${reviewId}`,
  );

  return response.data;
};

export const getReviewSummary = async (
  productId,
) => {
  const response = await api.get(
    `/Reviews/product/${productId}/summary`,
  );

  return response.data;
};