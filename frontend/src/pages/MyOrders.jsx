import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiPackage,
  FiCreditCard,
  FiChevronRight,
} from "react-icons/fi";
import { getMyOrders } from "../services/orderService";
import { API_BASE_URL } from "../services/api";

const getItemImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

// Status badge colors only — same cases/logic as before
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Paid":
      return "bg-blue-100 text-blue-700";
    case "Shipped":
      return "bg-indigo-100 text-indigo-700";
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
};

const OrderSkeleton = () => (
  <div className="mb-6 animate-pulse overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="h-20 bg-gray-100" />
    <div className="space-y-3 p-6">
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="h-16 w-full rounded bg-gray-100" />
    </div>
  </div>
);

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Kept for compatibility, not used directly in JSX below
  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-500";
      case "Shipped":
        return "bg-blue-500";
      case "Delivered":
        return "bg-purple-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">
        My Orders
      </h1>

      {loading && (
        <>
          <OrderSkeleton />
          <OrderSkeleton />
        </>
      )}

      {!loading && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FiPackage size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No orders found
          </h2>

          <p className="text-sm text-gray-500">
            When you place an order, it will show up here.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Start Shopping
          </button>
        </div>
      )}

      {!loading &&
        orders.map((order) => (
          <div
            key={order.id}
            className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  Order <span className="font-medium text-gray-900">#{order.id}</span>
                </p>

                <p className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>

                <p className="text-lg font-bold text-gray-900">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* Payment + Address */}
            <div className="grid grid-cols-1 gap-6 border-b border-gray-100 px-6 py-5 sm:grid-cols-2">
              <div>
                <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <FiMapPin size={14} />
                  Delivery Address
                </h2>

                <div className="text-sm text-gray-600">
                  <p className="font-medium text-gray-900">
                    {order.address.fullName}
                  </p>

                  <p>{order.address.mobileNumber}</p>

                  <p>{order.address.addressLine1}</p>

                  {order.address.addressLine2 && (
                    <p>{order.address.addressLine2}</p>
                  )}

                  <p>
                    {order.address.city}, {order.address.state}
                  </p>

                  <p>{order.address.postalCode}</p>
                </div>
              </div>

              <div>
                <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gray-900">
                  <FiCreditCard size={14} />
                  Payment ID
                </h2>

                <p className="break-all text-xs text-gray-500">
                  {order.razorpayPaymentId}
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="px-6 py-5">
              <h2 className="mb-3 text-sm font-semibold text-gray-900">
                Ordered Items
              </h2>

              <div className="divide-y divide-gray-100">
                {order.items.map((item) => {
                  const imageSrc = getItemImageUrl(item.productImage);

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="flex items-center gap-4">
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={item.productName}
                            className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-300">
                            <FiPackage size={20} />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-gray-900">
                            {item.productName}
                          </p>

                          <p className="mt-0.5 text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-base font-bold text-gray-900">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="mt-5 flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View Details
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyOrders;