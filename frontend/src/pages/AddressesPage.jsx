import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          My Addresses
        </h1>

        {!showForm && (
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            + Add Address
          </button>
        )}

      </div>

      {/* ADDRESS FORM */}

      {showForm && (
        <div className="mb-8">

          <AddressForm
            initialData={editingAddress}
            onSubmit={
              editingAddress
                ? handleUpdateAddress
                : handleAddAddress
            }
            onCancel={() => {
              setShowForm(false);
              setEditingAddress(null);
            }}
          />

        </div>
      )}

      {/* ADDRESS LIST */}

      {addresses.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">

          No addresses found.

        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

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