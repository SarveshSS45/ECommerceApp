const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect,
}) => {
  return (
    <div
      onClick={() => selectable && onSelect(address)}
      className={`border rounded-lg p-5 shadow-sm transition cursor-pointer
      ${
        selected
          ? "border-blue-600 bg-blue-50"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          {address.addressType}
        </h2>

        {address.isDefault && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            Default
          </span>
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-gray-700">
        <p className="font-semibold">{address.fullName}</p>

        <p>{address.mobileNumber}</p>

        <p>{address.addressLine1}</p>

        {address.addressLine2 && (
          <p>{address.addressLine2}</p>
        )}

        <p>
          {address.city}, {address.state}
        </p>

        <p>{address.postalCode}</p>

        <p>{address.country}</p>
      </div>

      {/* Buttons */}
      {!selectable && (
        <div className="flex gap-3 mt-5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

          {!address.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Make Default
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;