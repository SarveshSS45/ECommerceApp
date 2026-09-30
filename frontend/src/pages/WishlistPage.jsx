import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHeart, FiImage, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { removeFromWishlist } from "../services/wishlistService";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../services/api";

const getItemImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

const WishlistPage = () => {
  const { wishlist, fetchWishlist } = useWishlist();

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

      toast.success("Removed from wishlist");

      fetchWishlist();
    } catch (err) {
      console.error(err);

      toast.error("Failed to remove item");
    }
  };

  const handleMoveToCart = async (item) => {
    try {
      addToCart({
        id: item.productId,
        name: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      });

      await removeFromWishlist(item.productId);

      await fetchWishlist();

      toast.success("Moved to cart");
    } catch (err) {
      console.error(err);

      toast.error("Failed to move item");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-900 sm:text-3xl">
        <FiHeart size={24} className="text-gray-700" />
        My Wishlist
        {wishlist.length > 0 && (
          <span className="text-gray-400">({wishlist.length})</span>
        )}
      </h1>

      {wishlist.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FiHeart size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            Your wishlist is empty
          </h2>

          <p className="text-sm text-gray-500">
            Save items you like by tapping the heart on any product.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {wishlist.map((item) => {
            const imageSrc = getItemImageUrl(item.imageUrl);

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.productName}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <FiImage size={28} />
                    </div>
                  )}

                  <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm">
                    <FiHeart size={14} className="fill-red-500" />
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="line-clamp-1 font-semibold text-gray-900">
                    {item.productName}
                  </h2>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      <FiShoppingCart size={14} />
                      Move to Cart
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      aria-label="Remove from wishlist"
                      title="Remove"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-400 transition hover:border-red-300 hover:text-red-600"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;