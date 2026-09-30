import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiPackage, FiXCircle } from "react-icons/fi";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div className="mx-auto mt-20 flex max-w-md flex-col items-center gap-4 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <FiXCircle size={28} />
        </div>

        <h2 className="text-lg font-semibold text-gray-900">
          No order found
        </h2>

        <p className="text-sm text-gray-500">
          We couldn't find any order details to show here.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-lg rounded-xl border border-gray-200 bg-white p-8 shadow-xs">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <FiCheck size={28} />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Thanks for your order — a confirmation has been recorded.
        </p>
      </div>

      <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Order ID
          </p>
          <p className="font-medium text-gray-900">{data.orderId}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Payment ID
          </p>
          <p className="break-all text-sm text-gray-700">{data.paymentId}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="font-semibold text-gray-900">Total Amount</span>
          <span className="text-xl font-bold text-gray-900">
            ₹{data.amount}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => navigate("/orders")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <FiPackage size={16} />
          View My Orders
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex-1 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;