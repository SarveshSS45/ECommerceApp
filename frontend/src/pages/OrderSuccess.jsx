import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="text-center mt-20">
        <h2>No Order Found ❌</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        ✅ Order Placed Successfully!
      </h1>

      <p className="mb-2">
        <strong>Order ID:</strong> {data.orderId}
      </p>

      <p className="mb-2">
        <strong>Payment ID:</strong> {data.paymentId}
      </p>

      <p className="mb-4">
        <strong>Total Amount:</strong> ₹{data.amount}
      </p>

      <button
        onClick={() => navigate("/orders")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        View My Orders
      </button>
    </div>
  );
};

export default OrderSuccess;