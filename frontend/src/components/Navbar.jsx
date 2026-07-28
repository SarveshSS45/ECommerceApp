import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

const Navbar = () => {
  const { cart } = useCart();

  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <Link to="/">Shop</Link>
      <div className="flex flex-1 max-w-xl mx-8">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 rounded-l border border-gray-300 bg-white px-4 py-2 text-black placeholder:text-gray-500 focus:outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 rounded-r font-semibold"
        >
          Search
        </button>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/cart">Cart ({cart.length})</Link>

        {user && <Link to="/wishlist">Wishlist ❤️ ({wishlist.length})</Link>}

        {user ? (
          <>
            {/* ADMIN LINK */}
            {user.role === "Admin" && <Link to="/admin">Admin Panel</Link>}

            <span>{user.email}</span>

            <Link to="/orders">My Orders</Link>

            <Link to="/addresses">Addresses</Link>

            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
