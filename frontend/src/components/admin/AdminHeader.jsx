import { useAuth } from "../../context/AuthContext";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";

const AdminHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Left — page context label */}
      <p className="text-sm text-gray-500 font-medium">
        Admin Management System
      </p>

      {/* Right — user info + logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <FaUserShield className="text-gray-400" />
          <span className="font-medium">{user?.email}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;