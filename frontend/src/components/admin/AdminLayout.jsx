import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

/**
 * AdminLayout wraps every admin page.
 * Structure:
 *   ┌──────────────────────────────────┐
 *   │  AdminHeader (full width top)    │
 *   ├──────────────┬───────────────────┤
 *   │  AdminSidebar│  page content     │
 *   │  (fixed left)│  (scrollable)     │
 *   └──────────────┴───────────────────┘
 */
const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top header — spans full width */}
      <AdminHeader />

      {/* Body: sidebar + main content side by side */}
      <div className="flex flex-1">
        <AdminSidebar />

        {/* Main scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;