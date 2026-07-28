import { useState } from "react";
import { updateOrderStatus } from "../../services/adminService";

const statuses = [
  "Pending",
  "Paid",
  "Packed",
  "Shipped",
  "Out For Delivery",
  "Delivered",
  "Cancelled",
];

const OrderStatusDropdown = ({
  orderId,
  currentStatus,
  onStatusUpdated,
}) => {
  const [status, setStatus] =
    useState(currentStatus);

  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newStatus = e.target.value;

    setStatus(newStatus);

    try {
      setLoading(true);

      await updateOrderStatus(orderId, newStatus);

      if (onStatusUpdated) {
        onStatusUpdated(orderId, newStatus);
      }

      alert("Order status updated");
    } catch (error) {
      console.error(error);

      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={loading}
      className="border rounded px-2 py-1"
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default OrderStatusDropdown;