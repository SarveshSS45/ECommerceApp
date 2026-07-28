const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  yellow: "bg-yellow-50 text-yellow-600",
  purple: "bg-purple-50 text-purple-600",
  rose: "bg-rose-50 text-rose-600",
};

/**
 * Single statistic card used in the dashboard's top grid.
 * `color` must be one of: blue | green | yellow | purple | rose
 */
const StatCard = ({ icon, label, value, color = "blue" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${colorMap[color]} text-xl shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;