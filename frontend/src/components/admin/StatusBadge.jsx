/**
 * Colored badge for order status.
 * Falls back to gray for any status string not in the map below.
 */
const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  delivered: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  canceled: "bg-red-100 text-red-700",
  shipped: "bg-indigo-100 text-indigo-700",
  processing: "bg-orange-100 text-orange-700",
};

const StatusBadge = ({ status }) => {
  const key = String(status || "").toLowerCase();
  const classes = STATUS_STYLES[key] || "bg-gray-100 text-gray-700";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
      {status}
    </span>
  );
};

export default StatusBadge;