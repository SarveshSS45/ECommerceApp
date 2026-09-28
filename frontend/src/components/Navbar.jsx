import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiSearch,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

// Icon link with a count badge (used for Cart and Wishlist)
const IconLink = ({ to, label, count, children }) => (
  <Link
    to={to}
    aria-label={label}
    title={label}
    className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-200 transition hover:bg-white/10 hover:text-white"
  >
    {children}

    {count > 0 && (
      <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-yellow-400 px-1 text-[11px] font-bold text-black">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

// Single row inside the user dropdown
const menuItemClass =
  "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100";

const Navbar = () => {
  const { cart } = useCart();

  const { wishlist } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  // UI only: user dropdown
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

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

  const userInitial = (user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-white sm:text-2xl"
        >
          Shop<span className="text-yellow-400">.</span>
        </Link>

        {/* Search: full width on mobile (second row), centered on desktop */}
        <div className="order-last flex w-full md:order-none md:mx-6 md:w-auto md:max-w-2xl md:flex-1">
          <div className="relative flex-1">
            <FiSearch
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-l-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm text-black placeholder:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <button
            onClick={handleSearch}
            className="rounded-r-lg bg-yellow-400 px-5 text-sm font-semibold text-black transition hover:bg-yellow-500"
          >
            Search
          </button>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <IconLink to="/cart" label="Cart" count={cart.length}>
            <FiShoppingCart size={20} />
          </IconLink>

          {user && (
            <IconLink to="/wishlist" label="Wishlist" count={wishlist.length}>
              <FiHeart size={20} />
            </IconLink>
          )}

          {user ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen((previous) => !previous)}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm font-bold text-black">
                  {userInitial}
                </span>

                <FiChevronDown
                  size={16}
                  className={`text-gray-300 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-900 shadow-lg"
                >
                  {/* User info */}
                  <div className="border-b border-gray-200 px-4 py-3">
                    <p className="truncate text-sm font-semibold">
                      {user.email}
                    </p>

                    {user.role && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {user.role}
                      </p>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className={menuItemClass}
                    >
                      <FiUser size={16} />
                      My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={closeMenu}
                      className={menuItemClass}
                    >
                      <FiShoppingBag size={16} />
                      My Orders
                    </Link>

                    <Link
                      to="/addresses"
                      onClick={closeMenu}
                      className={menuItemClass}
                    >
                      <FiMapPin size={16} />
                      Addresses
                    </Link>

                    {/* ADMIN LINK */}
                    {user.role === "Admin" && (
                      <Link
                        to="/admin"
                        onClick={closeMenu}
                        className={menuItemClass}
                      >
                        <FiShield size={16} />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-gray-200 py-1">
                    <button
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-1 flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg border border-white/40 px-3 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;