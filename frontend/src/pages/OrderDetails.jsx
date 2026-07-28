import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderById } from "../services/orderService";
import toast from "react-hot-toast";

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
    return <p className="text-center mt-10 text-lg">Loading...</p>;
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

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Order Tracking */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Order Tracking</h2>

          <div className="flex flex-col gap-4">
            {orderSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index <= currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  {index <= currentStep ? "✓" : index + 1}
                </div>

                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      index <= currentStep ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Information */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Order Information</h2>

            <p>
              <strong>Order ID:</strong> #{order.id}
            </p>

            <p className="mt-2">
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-white text-sm ${
                  order.status === "Paid"
                    ? "bg-green-500"
                    : order.status === "Shipped"
                      ? "bg-blue-500"
                      : order.status === "Delivered"
                        ? "bg-purple-500"
                        : order.status === "Cancelled"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                }`}
              >
                {order.status}
              </span>
            </p>

            <p className="mt-2">
              <strong>Total:</strong> ₹{order.totalAmount}
            </p>

            <p className="mt-2">
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <p className="mt-2 break-all">
              <strong>Payment ID:</strong> {order.razorpayPaymentId}
            </p>
          </div>

          {/* Delivery Address */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Delivery Address</h2>

            <div className="border rounded p-4 bg-gray-50">
              <p className="font-semibold">{order.address.fullName}</p>

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

              <span className="inline-block mt-3 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                {order.address.addressType}
              </span>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="border-t pt-6">
          <h2 className="text-2xl font-semibold mb-4">Ordered Products</h2>

          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border rounded-lg p-4 mb-4 shadow-sm hover:shadow transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://localhost:7172${item.productImage}`}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded border"
                />

                <div>
                  <h3 className="font-semibold text-lg">{item.productName}</h3>

                  <p className="text-gray-500 mt-1">
                    Quantity : {item.quantity}
                  </p>

                  <p className="text-green-600 font-semibold mt-2">
                    ₹{item.price}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-sm">Item Total</p>

                <p className="text-xl font-bold">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
