import { useEffect, useState } from "react";
import { searchProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiImage,
  FiPackage,
  FiSearch,
  FiSliders,
} from "react-icons/fi";
import { API_BASE_URL } from "../services/api";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-black focus:outline-hidden focus:ring-2 focus:ring-black/10";
const labelClass = "mb-1 block text-xs font-medium text-gray-500";

// One product card
const ProductCard = ({ product, onClick }) => {
  const imageSrc = product.imageUrl
    ? `${API_BASE_URL}${product.imageUrl}`
    : null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-400">
            <FiImage size={28} />
            <span className="text-xs">No Image</span>
          </div>
        )}

        {isOutOfStock && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-900/90 px-2 py-0.5 text-[11px] font-semibold text-white">
            Out of Stock
          </span>
        )}

        {!isOutOfStock && isLowStock && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[11px] font-semibold text-white">
            Low Stock
          </span>
        )}
      </div>

      <div className="p-4">
        {product.categoryName && (
          <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
            {product.categoryName}
          </span>
        )}

        <h2 className="mt-2 line-clamp-1 font-semibold text-gray-900">
          {product.name}
        </h2>

        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>

          {!isOutOfStock && (
            <p className="text-xs text-gray-400">Stock: {product.stock}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Skeleton card shown while loading
const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="aspect-square w-full animate-pulse bg-gray-200" />
    <div className="space-y-2 p-4">
      <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
      <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
    </div>
  </div>
);

const ProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchTerm = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);

  // UI only: mobile filter panel visibility
  const [showFilters, setShowFilters] = useState(false);

  // Load Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Reset to first page whenever search changes
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  // Load Products (Live Search with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    searchTerm,
    pageNumber,
    sortBy,
    selectedCategory,
    minPrice,
    maxPrice,
    inStock,
  ]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await searchProducts({
        searchTerm,
        categoryId: selectedCategory,
        pageNumber,
        pageSize: 9,
        minPrice,
        maxPrice,
        inStock,
        sortBy,
      });

      console.log("Products:", response.data.items);

      setProducts(response.data.items);

      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Products
        </h1>

        {searchTerm && (
          <span className="hidden items-center gap-1.5 text-sm text-gray-500 sm:flex">
            <FiSearch size={14} />
            Results for "{searchTerm}"
          </span>
        )}

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters((previous) => !previous)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 md:hidden"
        >
          <FiFilter size={16} />
          Filters
        </button>
      </div>

      {/* FILTER / SORT TOOLBAR */}
      <div
        className={`mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-xs ${
          showFilters ? "block" : "hidden md:block"
        }`}
      >
        <div className="flex items-center gap-2 pb-3 text-sm font-semibold text-gray-700 md:hidden">
          <FiSliders size={16} />
          Filters
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Category Filter */}
          <div>
            <label className={labelClass}>Category</label>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);

                setPageNumber(1);
              }}
              className={inputClass}
            >
              <option value="">All Categories</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className={labelClass}>Price Range (₹)</label>

            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={inputClass}
              />

              <span className="text-gray-400">–</span>

              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className={labelClass}>Sort By</label>

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPageNumber(1);
              }}
              className={inputClass}
            >
              <option value="newest">Newest</option>

              <option value="oldest">Oldest</option>

              <option value="priceAsc">Price Low → High</option>

              <option value="priceDesc">Price High → Low</option>

              <option value="nameAsc">Name A-Z</option>

              <option value="nameDesc">Name Z-A</option>
            </select>
          </div>

          {/* In Stock */}
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => {
                  setInStock(e.target.checked);
                  setPageNumber(1);
                }}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
              />
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* Products */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => navigate(`/product/${p.id}`)}
            />
          ))}
        </div>
      )}

      {/* No Products */}
      {!loading && products.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 text-center">
          <FiPackage size={32} className="text-gray-300" />
          <p className="font-medium text-gray-600">No products found.</p>
          <p className="text-sm text-gray-400">
            Try adjusting your filters or search term.
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiChevronLeft size={16} />
            Previous
          </button>

          <span className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
            Page {pageNumber} of {totalPages}
          </span>

          <button
            disabled={pageNumber === totalPages || totalPages === 0}
            onClick={() => setPageNumber(pageNumber + 1)}
            className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
