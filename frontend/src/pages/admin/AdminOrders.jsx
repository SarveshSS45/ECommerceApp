import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaShoppingCart, FaUser, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

import { getAllOrders } from "../../services/adminService";
import OrderStatusDropdown from "../../components/admin/OrderStatusDropdown";
import StatusBadge from "../../components/admin/StatusBadge";
import SectionCard from "../../components/admin/SectionCard";

const formatINR = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdated = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast.success(`Order #${orderId} status updated to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Manage and update customer orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          No orders found
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
            >
              {/* Order card header */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-5">
                {/* Left info */}
                <div className="space-y-4">
                  {/* Order ID + status badge */}
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold text-gray-900">
                      #{order.id}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Customer */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaUser className="text-gray-400" />
                      <span className="font-semibold text-gray-900">
                        {order.userName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaEnvelope className="text-gray-400" />
                      <span>{order.userEmail}</span>
                    </div>
                  </div>

                  {/* Amount + date */}
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        Total
                      </p>
                      <p className="font-bold text-gray-900 text-lg">
                        {formatINR(order.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                        Date
                      </p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <FaCalendarAlt className="text-gray-400 text-xs" />
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right — status dropdown */}
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Update Status
                  </p>
                  <OrderStatusDropdown
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdated={handleStatusUpdated}
                  />
                </div>
              </div>

              {/* Order items */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Ordered Items ({order.items?.length || 0})
                </p>
                <div className="space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatINR(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;