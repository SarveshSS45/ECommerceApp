import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../services/orderService";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiMapPin,
  FiPackage,
  FiXCircle,
} from "react-icons/fi";
import { API_BASE_URL } from "../services/api";

const getItemImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${API_BASE_URL}${imageUrl}`;
};

// Status badge colors only — same cases as before
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

const OrderDetailsSkeleton = () => (
  <div className="mx-auto mt-10 max-w-5xl p-6">
    <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

    <div className="mt-6 animate-pulse space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-6 w-2/3 rounded bg-gray-100" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="h-32 rounded bg-gray-100" />
        <div className="h-32 rounded bg-gray-100" />
      </div>

      <div className="h-24 rounded bg-gray-100" />
    </div>
  </div>
);

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrderById(id);

      setOrder(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order");
    }
  };

  if (!order) {
    return <OrderDetailsSkeleton />;
  }

  const orderSteps = [
    "Pending",
    "Paid",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const currentStep = orderSteps.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";

  return (
    <div className="mx-auto mt-10 max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
        Order Details
      </h1>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        {/* Order Tracking */}
        <div className="mb-8">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Order Tracking
          </h2>

          {isCancelled && (
            <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              <FiXCircle size={16} />
              This order was cancelled and is no longer being processed.
            </div>
          )}

          <div className="flex flex-col">
            {orderSteps.map((step, index) => {
              const isComplete = index <= currentStep;
              const isLast = index === orderSteps.length - 1;

              return (
                <div key={step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        isComplete ? "bg-green-500" : "bg-gray-300"
                      }`}
                    >
                      {isComplete ? <FiCheck size={16} /> : index + 1}
                    </div>

                    {!isLast && (
                      <div
                        className={`w-0.5 flex-1 ${
                          index < currentStep ? "bg-green-500" : "bg-gray-200"
                        }`}
                        style={{ minHeight: "1.5rem" }}
                      />
                    )}
                  </div>

                  <div className="flex-1 pb-4">
                    <p
                      className={`font-medium ${
                        isComplete ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Information */}
        <div className="mb-6 grid grid-cols-1 gap-6 border-t border-gray-100 pt-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-base font-semibold text-gray-900">
              Order Information
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Order ID
                </p>
                <p className="font-medium text-gray-900">#{order.id}</p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                    order.status,
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Total
                </p>
                <p className="text-lg font-bold text-gray-900">
                  ₹{order.totalAmount}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Date
                </p>
                <p className="text-gray-700">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Payment ID
                </p>
                <p className="break-all text-xs text-gray-500">
                  {order.razorpayPaymentId}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-base font-semibold text-gray-900">
              <FiMapPin size={15} />
              Delivery Address
            </h2>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">
                {order.address.fullName}
              </p>

              <p>{order.address.mobileNumber}</p>

              <p className="mt-2">{order.address.addressLine1}</p>

              {order.address.addressLine2 && (
                <p>{order.address.addressLine2}</p>
              )}

              <p>
                {order.address.city}, {order.address.state}
              </p>

              <p>{order.address.postalCode}</p>

              <p>{order.address.country}</p>

              <span className="mt-3 inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                {order.address.addressType}
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Ordered Products
          </h2>

          <div className="space-y-4">
            {order.items.map((item) => {
              const imageSrc = getItemImageUrl(item.productImage);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.productName}
                        className="h-20 w-20 shrink-0 rounded-lg border border-gray-200 object-cover sm:h-24 sm:w-24"
                      />
                    ) : (
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-100 text-gray-300 sm:h-24 sm:w-24">
                        <FiPackage size={22} />
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Item Total</p>

                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;