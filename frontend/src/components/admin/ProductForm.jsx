import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaBox } from "react-icons/fa";
import { getCategories } from "../../services/categoryService";

const IMAGE_BASE_URL = "https://localhost:7172";

const ProductForm = ({ initialData, onSubmit }) => {
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageFile: null,
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock: initialData.stock || "",
        categoryId: initialData.categoryId || "",
      }));
      if (initialData.imageUrl) {
        setPreview(`${IMAGE_BASE_URL}${initialData.imageUrl}`);
      }
    }
  }, [initialData]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, imageFile: file }));
      if (file) setPreview(URL.createObjectURL(file));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("categoryId", formData.categoryId);
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
    >
      {/* Name */}
      <div>
        <label className={labelClass}>Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Premium Wireless Headphones"
          className={inputClass}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the product..."
          className={inputClass}
          rows="4"
          required
        />
      </div>

      {/* Price + Stock side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>Category</label>
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Image upload */}
      <div>
        <label className={labelClass}>Product Image</label>
        <input
          type="file"
          name="imageFile"
          accept="image/*"
          onChange={handleChange}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-700 file:cursor-pointer"
        />
        <p className="text-xs text-gray-400 mt-1">
          {initialData?.imageUrl
            ? "Upload a new image to replace the current one"
            : "JPG, PNG or WEBP recommended"}
        </p>
      </div>

      {/* Image preview */}
      {preview ? (
        <div className="flex items-center gap-4">
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
          />
          <p className="text-xs text-gray-400">Image preview</p>
        </div>
      ) : (
        <div className="w-24 h-24 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
          <FaBox className="text-gray-300 text-2xl" />
        </div>
      )}

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : initialData
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;