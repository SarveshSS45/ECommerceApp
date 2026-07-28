import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";

const NAV_ITEMS = [
  { to: "/admin",            label: "Dashboard",  icon: <FaChartBar /> },
  { to: "/admin/products",   label: "Products",   icon: <FaBox /> },
  { to: "/admin/orders",     label: "Orders",     icon: <FaShoppingCart /> },
  { to: "/admin/categories", label: "Categories", icon: <FaTags /> },
];

const AdminSidebar = () => {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-700">
        <p className="text-lg font-bold tracking-wide">⚡ Admin Panel</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            // exact match for /admin so Dashboard doesn't stay active on sub-routes
            end={to === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-gray-900"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;