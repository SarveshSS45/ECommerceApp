import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-hidden focus:ring-2 focus:ring-black/10";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";

const AddressForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "Home",
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border border-gray-200 bg-white p-6 shadow-xs"
    >
      <h2 className="text-xl font-bold text-gray-900">
        {initialData ? "Edit Address" : "Add New Address"}
      </h2>

      <div>
        <label className={labelClass}>Full Name</label>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Mobile Number</label>
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Address Line 1</label>
        <input
          type="text"
          name="addressLine1"
          placeholder="Address Line 1"
          value={formData.addressLine1}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      <div>
        <label className={labelClass}>Address Line 2</label>
        <input
          type="text"
          name="addressLine2"
          placeholder="Address Line 2 (optional)"
          value={formData.addressLine2}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>State</label>
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address Type</label>
        <select
          name="addressType"
          value={formData.addressType}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black/20"
        />
        Set as Default Address
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <FiCheck size={16} />
          Save Address
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          <FiX size={16} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;