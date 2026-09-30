import { FiEdit2, FiMapPin, FiStar, FiTrash2 } from "react-icons/fi";

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
      className={`rounded-xl border p-5 shadow-xs transition ${
        selectable ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-black bg-gray-50 ring-1 ring-black"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-base font-semibold text-gray-900">
          <FiMapPin size={15} className="text-gray-400" />
          {address.addressType}
        </h2>

        {address.isDefault && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            Default
          </span>
        )}
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-sm text-gray-600">
        <p className="font-semibold text-gray-900">{address.fullName}</p>

        <p>{address.mobileNumber}</p>

        <p>{address.addressLine1}</p>

        {address.addressLine2 && <p>{address.addressLine2}</p>}

        <p>
          {address.city}, {address.state}
        </p>

        <p>{address.postalCode}</p>

        <p>{address.country}</p>
      </div>

      {/* Buttons */}
      {!selectable && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <FiEdit2 size={14} />
            Edit
          </button>

          {!address.isDefault && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(address.id);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <FiStar size={14} />
              Make Default
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            aria-label="Delete address"
            title="Delete"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 text-gray-400 transition hover:border-red-300 hover:text-red-600"
          >
            <FiTrash2 size={15} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;