import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiImage, FiMinus, FiPlus, FiShoppingCart, FiTrash2 } from "react-icons/fi";
import { API_BASE_URL } from "../services/api";

const getItemImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // EMPTY CART UI
  if (cart.length === 0)
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <FiShoppingCart size={28} />
        </div>

        <h1 className="text-xl font-semibold text-gray-900">
          Your cart is empty
        </h1>

        <p className="text-sm text-gray-500">
          Looks like you haven't added anything to your cart yet.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Cart <span className="text-gray-400">({itemCount})</span>
      </h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cart items */}
        <div className="space-y-3 lg:col-span-2">
          {cart.map((item) => {
            const imageSrc = getItemImageUrl(item.imageUrl);
            const atMaxStock = item.quantity >= item.stock;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
              >
                {/* Image */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <FiImage size={22} />
                    </div>
                  )}
                </div>

                {/* Name / price / stock */}
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">{item.name}</h2>

                  <p className="mt-0.5 text-sm text-gray-500">
                    ₹{item.price} × {item.quantity} ={" "}
                    <span className="font-medium text-gray-700">
                      ₹{item.price * item.quantity}
                    </span>
                  </p>

                  <p
                    className={`mt-1 text-xs ${
                      atMaxStock ? "text-amber-600" : "text-gray-400"
                    }`}
                  >
                    {atMaxStock
                      ? `Max stock reached (${item.stock})`
                      : `Stock: ${item.stock}`}
                  </p>
                </div>

                {/* Quantity + remove */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center sm:gap-3">
                  <div className="flex items-center gap-1 rounded-full border border-gray-300 p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={14} />
                    </button>

                    <span className="w-6 text-center text-sm font-medium text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      disabled={atMaxStock}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                        atMaxStock
                          ? "cursor-not-allowed text-gray-300"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-red-600"
                  >
                    <FiTrash2 size={15} />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Items ({itemCount})</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-xl font-bold text-gray-900">
                ₹{total}
              </span>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-5 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/")}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;