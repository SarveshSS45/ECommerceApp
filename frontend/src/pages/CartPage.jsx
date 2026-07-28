import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ EMPTY CART UI
  if (cart.length === 0)
    return (
      <div className="p-6 text-center">
        <h1 className="text-xl mb-4">Cart is empty</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Continue Shopping
        </button>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border p-4 mb-2"
        >
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p>₹{item.price}</p>

            {/* ✅ TOTAL PER ITEM */}
            <p className="text-sm text-gray-500">
              ₹{item.price} × {item.quantity} = ₹
              {item.price * item.quantity}
            </p>

            {/* ✅ STOCK INFO */}
            <p className="text-xs text-gray-400">
              Stock: {item.stock}
            </p>
          </div>

          {/* ✅ QUANTITY CONTROLS */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                updateQuantity(item.id, item.quantity - 1)
              }
              className="px-2 bg-gray-300"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              disabled={item.quantity >= item.stock}
              onClick={() =>
                updateQuantity(item.id, item.quantity + 1)
              }
              className={`px-2 ${
                item.quantity >= item.stock
                  ? "bg-gray-200 cursor-not-allowed"
                  : "bg-gray-300"
              }`}
            >
              +
            </button>
          </div>

          {/* ✅ CHECKOUT */}
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Checkout
          </button>

          {/* ✅ REMOVE */}
          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-4">Total: ₹{total}</h2>
    </div>
  );
};

export default CartPage;