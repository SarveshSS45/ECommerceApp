import { useEffect, useState } from "react";
import { searchProducts } from "../services/productService";
import { getCategories } from "../services/categoryService";
import { useNavigate, useSearchParams } from "react-router-dom";

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* SEARCH + CATEGORY + SORT */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* <button
          onClick={handleSearch}
          className="bg-black text-white px-6 py-3 rounded"
        >
          Search
        </button> */}

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);

            setPageNumber(1);
          }}
          className="border p-3 rounded"
        >
          <option value="">All Categories</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-3 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => {
              setInStock(e.target.checked);
              setPageNumber(1);
            }}
          />
          In Stock Only
        </label>

        {/* Sorting */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPageNumber(1);
          }}
          className="border p-3 rounded"
        >
          <option value="newest">Newest</option>

          <option value="oldest">Oldest</option>

          <option value="priceAsc">Price Low → High</option>

          <option value="priceDesc">Price High → Low</option>

          <option value="nameAsc">Name A-Z</option>

          <option value="nameDesc">Name Z-A</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <div className="text-center py-10">Loading Products...</div>}

      {/* Products */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/product/${p.id}`)}
              className="border rounded shadow p-4 cursor-pointer hover:shadow-lg transition"
            >
              <img
                src={
                  p.imageUrl
                    ? `https://localhost:7172${p.imageUrl}`
                    : "/placeholder.png"
                }
                alt={p.name}
                className="h-48 w-full object-cover mb-3"
              />

              <h2 className="font-semibold text-lg">{p.name}</h2>

              <p className="text-sm text-gray-500 mb-1">
                Category: {p.categoryName}
              </p>

              <p className="text-gray-600">{p.description}</p>

              <p className="text-green-600 font-bold mt-2">₹{p.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* No Products */}
      {!loading && products.length === 0 && (
        <div className="text-center py-10">No products found.</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          disabled={pageNumber === 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {pageNumber} of {totalPages}
        </span>

        <button
          disabled={pageNumber === totalPages || totalPages === 0}
          onClick={() => setPageNumber(pageNumber + 1)}
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductPage;
