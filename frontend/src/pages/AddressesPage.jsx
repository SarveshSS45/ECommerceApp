import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiPlus } from "react-icons/fi";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

import AddressCard from "../components/AddressCard";
import AddressForm from "../components/AddressForm";

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingAddress, setEditingAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();

      setAddresses(data);
    } catch (err) {
      console.error(err);

      toast.error("Failed to load addresses");
    }
  };

  // ADD ADDRESS
  const handleAddAddress = async (formData) => {
    try {
      await addAddress(formData);

      toast.success("Address added successfully");

      setShowForm(false);

      fetchAddresses();
    } catch (err) {
      console.error(err);

      toast.error("Failed to add address");
    }
  };

  // UPDATE ADDRESS
  const handleUpdateAddress = async (formData) => {
    try {
      await updateAddress(editingAddress.id, formData);

      toast.success("Address updated");

      setEditingAddress(null);

      setShowForm(false);

      fetchAddresses();
    } catch (err) {
      console.error(err);

      toast.error("Failed to update address");
    }
  };

  // DELETE ADDRESS
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) {
      return;
    }

    try {
      await deleteAddress(id);

      toast.success("Address deleted");

      fetchAddresses();
    } catch (err) {
      console.error(err);

      toast.error("Failed to delete address");
    }
  };

  // SET DEFAULT ADDRESS
  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);

      toast.success("Default address updated");

      fetchAddresses();
    } catch (err) {
      console.error(err);

      toast.error("Failed to update default address");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          My Addresses
        </h1>

        {!showForm && (
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <FiPlus size={16} />
            Add Address
          </button>
        )}
      </div>

      {/* ADDRESS FORM */}
      {showForm && (
        <div className="mb-8">
          <AddressForm
            initialData={editingAddress}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />
        </div>
      )}

      {/* ADDRESS LIST */}
      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <FiMapPin size={28} />
          </div>

          <h2 className="text-lg font-semibold text-gray-900">
            No addresses found
          </h2>

          <p className="text-sm text-gray-500">
            Add an address to speed up checkout next time.
          </p>

          {!showForm && (
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowForm(true);
              }}
              className="mt-2 flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <FiPlus size={16} />
              Add Address
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(address) => {
                setEditingAddress(address);

                setShowForm(true);
              }}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressesPage;