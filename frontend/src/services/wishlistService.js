import api from "./api";

// Get My Wishlist
export const getWishlist = async () => {
  const response = await api.get("/Wishlist");

  return response.data;
};

// Add To Wishlist
export const addToWishlist = async (productId) => {
  const response = await api.post("/Wishlist", {
    productId,
  });

  return response.data;
};

// Remove From Wishlist
export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/Wishlist/${productId}`);

  return response.data;
};

export const checkWishlist = async (productId) => {
  const response = await api.get(`/Wishlist/check/${productId}`);

  return response.data;
};
