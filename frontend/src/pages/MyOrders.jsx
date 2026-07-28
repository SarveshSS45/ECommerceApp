import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 && (
        <div className="text-center text-gray-500">No orders found.</div>
      )}

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow border mb-6 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-100 px-6 py-4 flex flex-col md:flex-row justify-between">
            <div className="space-y-1">
              <p>
                <strong>Order #</strong> {order.id}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p>
                <strong>Total:</strong> ₹{order.totalAmount}
              </p>
            </div>

            <div className="mt-4 md:mt-0 text-left md:text-right">
              <span
                className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(order.status)}`}
              >
                {order.status}
              </span>

              <p className="text-sm text-gray-500 mt-2">Payment ID</p>

              <p className="text-sm break-all">{order.razorpayPaymentId}</p>
            </div>
          </div>

          {/* Address */}
          <div className="px-6 pt-5">
            <h2 className="font-semibold mb-2">Delivery Address</h2>

            <div className="text-gray-700">
              <p className="font-medium">{order.address.fullName}</p>

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

          {/* Items */}
          <div className="px-6 py-5 border-t mt-5">
            <h2 className="font-semibold mb-3">Ordered Items</h2>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`https://localhost:7172${item.productImage}`}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded border"
                  />

                  <div>
                    <p className="font-semibold">{item.productName}</p>

                    <p className="text-gray-500">Quantity : {item.quantity}</p>
                  </div>
                </div>

                <div className="font-bold text-lg">₹{item.price}</div>
              </div>
            ))}

            <button
              onClick={() => navigate(`/orders/${order.id}`)}
              className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
