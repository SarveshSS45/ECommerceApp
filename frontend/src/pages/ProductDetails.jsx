import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";
import { getReviewsByProduct } from "../services/reviewService";
import { getReviewSummary } from "../services/reviewService";
import { useWishlist } from "../context/WishlistContext";
import { addToWishlist, checkWishlist } from "../services/wishlistService";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  const [editingReview, setEditingReview] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchReviewSummary();
    fetchWishlistStatus();
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);

      console.log("Product Details:", data);

      setProduct(data);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load product ❌");
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getReviewsByProduct(id);

      setReviews(data);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load reviews");
    }
  };

  const fetchReviewSummary = async () => {
    try {
      const data = await getReviewSummary(id);

      setReviewSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlistStatus = async () => {
    if (!user) return;

    try {
      const data = await checkWishlist(id);

      setIsWishlisted(data.isInWishlist);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);

    toast.success("Added to cart 🛒");
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);

      await fetchWishlist();

      setIsWishlisted(true);

      toast.success("Added to wishlist ❤️");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (!product) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-8">
        <img
          src={`https://localhost:7172${product.imageUrl}`}
          alt={product.name}
          className="w-1/2 h-96 object-cover rounded"
        />

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-500 text-lg">
              {"★".repeat(Math.round(reviewSummary.averageRating))}
              {"☆".repeat(5 - Math.round(reviewSummary.averageRating))}
            </span>

            <span className="text-gray-600">
              {reviewSummary.averageRating} ({reviewSummary.reviewCount}{" "}
              reviews)
            </span>
          </div>

          <p className="mt-4 text-gray-600">{product.description}</p>

          <p className="mt-4 text-2xl font-bold text-green-600">
            ₹{product.price}
          </p>

          <p className="mt-2 text-sm text-gray-500">Stock: {product.stock}</p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              className="bg-yellow-500 px-6 py-2 rounded text-white"
            >
              Add to Cart
            </button>

            {user && (
              <button
                onClick={handleAddToWishlist}
                disabled={isWishlisted}
                className={`px-6 py-2 rounded text-white ${
                  isWishlisted ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {isWishlisted ? "❤️ In Wishlist" : "🤍 Add To Wishlist"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review Form */}
      {user && (
        <ReviewForm
          productId={id}
          onReviewAdded={fetchReviews}
          editingReview={editingReview}
          clearEdit={() => setEditingReview(null)}
        />
      )}

      {/* Reviews */}
      <ReviewList
        reviews={reviews}
        currentUserId={user?.nameid}
        onEdit={(review) => setEditingReview(review)}
        onReviewDeleted={fetchReviews}
      />
    </div>
  );
};

export default ProductDetails;
