import { useEffect, useState } from "react";

const AddressForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
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
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">
        {initialData
          ? "Edit Address"
          : "Add New Address"}
      </h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="mobileNumber"
        placeholder="Mobile Number"
        value={formData.mobileNumber}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="addressLine1"
        placeholder="Address Line 1"
        value={formData.addressLine1}
        onChange={handleChange}
        className="w-full border rounded p-2"
        required
      />

      <input
        type="text"
        name="addressLine2"
        placeholder="Address Line 2"
        value={formData.addressLine2}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="border rounded p-2"
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          className="border rounded p-2"
        />
      </div>

      <select
        name="addressType"
        value={formData.addressType}
        onChange={handleChange}
        className="w-full border rounded p-2"
      >
        <option value="Home">
          Home
        </option>

        <option value="Office">
          Office
        </option>

        <option value="Other">
          Other
        </option>
      </select>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isDefault"
          checked={formData.isDefault}
          onChange={handleChange}
        />

        Set as Default Address
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Save Address
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 text-white px-5 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddressForm;