import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Pages — public
import ProductPage from "./pages/ProductPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WishlistPage from "./pages/WishlistPage";
import AddressesPage from "./pages/AddressesPage";

// Pages — admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCategories from "./pages/admin/AdminCategories";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";

import MyProfile from "./pages/MyProfile";

/**
 * Renders the public Navbar only on non-admin routes.
 * Must be inside <BrowserRouter> to use useLocation.
 */
const PublicNavbar = () => {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return <Navbar />;
};

/**
 * Helper: wraps a page in both AdminRoute (auth guard) and AdminLayout (sidebar + header).
 */
const AdminPage = ({ children }) => (
  <AdminRoute>
    <AdminLayout>{children}</AdminLayout>
  </AdminRoute>
);

function App() {
  return (
    <BrowserRouter>
      {/* Only shows on non-admin routes */}
      <PublicNavbar />

      <Routes>
        {/* ── Public routes ─────────────────────────────────── */}
        <Route path="/" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* ── Protected user routes ─────────────────────────── */}
        <Route path="/profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>}/>
        <Route
          path="/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />
        <Route
          path="/wishlist"
          element={<ProtectedRoute><WishlistPage /></ProtectedRoute>}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
        />
        <Route
          path="/orders/:id"
          element={<ProtectedRoute><OrderDetails /></ProtectedRoute>}
        />
        <Route
          path="/addresses"
          element={<ProtectedRoute><AddressesPage /></ProtectedRoute>}
        />

        {/* ── Admin routes (AdminRoute guard + AdminLayout) ──── */}
        <Route
          path="/admin"
          element={<AdminPage><AdminDashboard /></AdminPage>}
        />
        <Route
          path="/admin/products"
          element={<AdminPage><AdminProducts /></AdminPage>}
        />
        <Route
          path="/admin/products/add"
          element={<AdminPage><AddProduct /></AdminPage>}
        />
        <Route
          path="/admin/products/edit/:id"
          element={<AdminPage><EditProduct /></AdminPage>}
        />
        <Route
          path="/admin/orders"
          element={<AdminPage><AdminOrders /></AdminPage>}
        />
        <Route
          path="/admin/categories"
          element={<AdminPage><AdminCategories /></AdminPage>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;