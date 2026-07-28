/**
 * Shared white card wrapper used for every dashboard section
 * (Recent Orders, Top Products, Low Stock, etc).
 * Keeps spacing/shadow/heading style consistent across the page.
 */
const SectionCard = ({ icon, title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h2>
      {children}
    </div>
  );
};

export default SectionCard;