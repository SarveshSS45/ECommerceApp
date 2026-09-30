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
import { getProductImages } from "../services/productImageService";
import ProductImageGallery from "../components/ProductImageGallery";
import toast from "react-hot-toast";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";

// Star rating, styled only — same math as before
const RatingStars = ({ average }) => {
  const filled = Math.floor(average);
  const hasHalf = average % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, index) => {
        const isFilled = index < filled;
        const isHalf = !isFilled && index === filled && hasHalf;

        return (
          <FiStar
            key={index}
            size={16}
            className={
              isFilled || isHalf
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        );
      })}
    </div>
  );
};

// Loading skeleton matching the gallery + info layout
const ProductDetailsSkeleton = () => (
  <div className="mx-auto max-w-6xl p-4 sm:p-6">
    <div className="flex animate-pulse flex-col gap-10 lg:flex-row">
      <div className="aspect-square w-full rounded-xl bg-gray-200 lg:w-[420px]" />

      <div className="flex-1 space-y-4">
        <div className="h-8 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-100" />
        <div className="h-4 w-full rounded bg-gray-100" />
        <div className="h-4 w-5/6 rounded bg-gray-100" />
        <div className="h-8 w-24 rounded bg-gray-200" />
        <div className="mt-4 flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
          <div className="h-10 w-40 rounded-lg bg-gray-100" />
        </div>
      </div>
    </div>
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  const [editingReview, setEditingReview] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({
    averageRating: 0,
    reviewCount: 0,
  });

  const [reviewsLoading, setReviewsLoading] = useState(true);
  const { user } = useAuth();
  const [product, setProduct] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const { fetchWishlist } = useWishlist();

  useEffect(() => {
    fetchProduct();
    fetchGalleryImages();
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

      toast.error("Failed to load product");
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);

      const data = await getReviewsByProduct(id);

      setReviews(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
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

  const fetchGalleryImages = async () => {
    try {
      const response = await getProductImages(id);

      setGalleryImages(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    addToCart(product);

    toast.success("Added to cart");
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product.id);

      await fetchWishlist();

      setIsWishlisted(true);

      toast.success("Added to wishlist");
    } catch (err) {
      console.error(err);

      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  if (!product) {
    return <ProductDetailsSkeleton />;
  }

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="lg:w-[420px] lg:shrink-0">
          <ProductImageGallery
            productName={product.name}
            images={galleryImages}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-2 flex items-center gap-2">
            <RatingStars average={reviewSummary.averageRating} />

            <span className="text-sm text-gray-500">
              {reviewSummary.averageRating.toFixed(1)} (
              {reviewSummary.reviewCount} reviews)
            </span>
          </div>

          <p className="mt-4 max-w-xl text-gray-600">{product.description}</p>

          <p className="mt-5 text-3xl font-bold text-gray-900">
            ₹{product.price}
          </p>

          <p
            className={`mt-2 text-sm font-medium ${
              isOutOfStock
                ? "text-red-600"
                : isLowStock
                  ? "text-amber-600"
                  : "text-gray-500"
            }`}
          >
            {isOutOfStock
              ? "Out of stock"
              : isLowStock
                ? `Only ${product.stock} left in stock`
                : `In stock (${product.stock} available)`}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex items-center gap-2 rounded-lg bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiShoppingCart size={16} />
              Add to Cart
            </button>

            {user && (
              <button
                onClick={handleAddToWishlist}
                disabled={isWishlisted}
                className={`flex items-center gap-2 rounded-lg border px-6 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed ${
                  isWishlisted
                    ? "border-gray-200 bg-gray-100 text-gray-500"
                    : "border-gray-300 text-gray-700 hover:border-red-300 hover:text-red-600"
                }`}
              >
                <FiHeart
                  size={16}
                  className={isWishlisted ? "fill-gray-400 text-gray-400" : ""}
                />
                {isWishlisted ? "In Wishlist" : "Add to Wishlist"}
              </button>
            )}
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* Review Form */}
      {user && (
        <ReviewForm
          productId={id}
          onReviewAdded={() => {
            fetchReviews();
            fetchReviewSummary();
          }}
          editingReview={editingReview}
          clearEdit={() => setEditingReview(null)}
        />
      )}

      {/* Reviews */}
      {reviewsLoading ? (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Reviews</h2>

          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      ) : (
        <ReviewList
          reviews={reviews}
          currentUserId={user?.nameid}
          onEdit={(review) => setEditingReview(review)}
          onReviewDeleted={() => {
            fetchReviews();
            fetchReviewSummary();
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;