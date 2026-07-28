import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { removeFromWishlist } from "../services/wishlistService";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

const WishlistPage = () => {
  const { wishlist, fetchWishlist } = useWishlist();

  const { addToCart } = useCart();

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

      toast.success("Moved to cart 🛒");
    } catch (err) {
      console.error(err);

      toast.error("Failed to move item");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">❤️ My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow">
              <img
                src={`https://localhost:7172${item.imageUrl}`}
                alt={item.productName}
                className="w-full h-48 object-cover rounded"
              />

              <h2 className="font-semibold mt-3">{item.productName}</h2>

              <p className="text-green-600 font-bold mt-2">₹{item.price}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Move To Cart
                </button>

                <button
                  onClick={() => handleRemove(item.productId)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
