import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiChevronRight,
  FiEye,
  FiEyeOff,
  FiHeart,
  FiMapPin,
  FiShoppingBag,
} from "react-icons/fi";
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
} from "../services/userService";

import { API_BASE_URL } from "../services/api";

// Shared styles (Tailwind v4: always set border color explicitly)
const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-hidden focus:ring-2 focus:ring-black/10 disabled:bg-gray-100 disabled:text-gray-500";
const labelClass = "mb-1 block text-sm font-medium text-gray-700";
const primaryButtonClass =
  "rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50";
const secondaryButtonClass =
  "rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50";

// Password input with show/hide toggle (UI only)
const PasswordField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}) => (
  <div>
    <label className={labelClass}>{label}</label>

    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} pr-10`}
        placeholder={placeholder}
      />

      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-700"
      >
        {visible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
      </button>
    </div>
  </div>
);

// Read-only label/value pair
const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
  </div>
);

const MyProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // UI only: show/hide password toggles
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const togglePasswordVisibility = (field) => {
    setShowPasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const getProfileImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl}`;
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccessMessage("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmNewPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setError("New password and confirmation password do not match.");
      return;
    }

    try {
      setChangingPassword(true);

      const response = await changePassword(passwordData);

      if (response?.success === false) {
        setError(response.message || "Failed to change password.");
        return;
      }

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });

      setSuccessMessage("Password changed successfully.");
    } catch (error) {
      console.error("Error changing password:", error);

      setError(error?.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProfile();

      if (response?.success === false) {
        setError(response.message || "Failed to load profile.");
        return;
      }

      const profileData = response?.data ?? response;

      setProfile(profileData);

      setFormData({
        name: profileData.name || "",
        phone: profileData.phone || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setSuccessMessage("");
    setError("");

    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || "",
      phone: profile.phone || "",
    });

    setError("");
    setSuccessMessage("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const response = await updateProfile({
        name: formData.name.trim(),
        phone: formData.phone.trim() || null,
      });

      if (response?.success === false) {
        setError(response.message || "Failed to update profile.");
        return;
      }

      const updatedProfile = response?.data ?? response;

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        phone: updatedProfile.phone || "",
      });

      setIsEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setError("");
      setSuccessMessage("");

      const response = await uploadProfilePicture(file);

      if (response?.success === false) {
        setError(response.message || "Failed to upload profile image.");
        return;
      }

      const updatedProfile =
        response?.data?.profile ?? response?.data ?? response;

      setProfile(updatedProfile);

      setSuccessMessage("Profile image uploaded successfully.");
    } catch (error) {
      console.error("Error uploading profile image:", error);

      setError(
        error?.response?.data?.message || "Failed to upload profile image.",
      );
    } finally {
      setUploadingImage(false);

      // Allows selecting the same file again
      e.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse p-6">
        <div className="mb-6 h-8 w-40 rounded bg-gray-200" />
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="h-24 bg-gray-100" />
          <div className="space-y-4 p-6">
            <div className="-mt-16 h-24 w-24 rounded-full border-4 border-white bg-gray-200" />
            <div className="h-5 w-48 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p>Profile not found.</p>
      </div>
    );
  }

  const profileImage = getProfileImageUrl(profile.profileImageUrl);
  const initial = (profile.name || profile.email || "?")
    .trim()
    .charAt(0)
    .toUpperCase();

  const quickLinks = [
    {
      title: "My Orders",
      description: "View your order history and order details.",
      path: "/orders",
      icon: FiShoppingBag,
    },
    {
      title: "Wishlist",
      description: "View and manage your saved products.",
      path: "/wishlist",
      icon: FiHeart,
    },
    {
      title: "Addresses",
      description: "Manage your delivery addresses.",
      path: "/addresses",
      icon: FiMapPin,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>

      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Profile Card */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
        {/* Neutral banner */}
        <div className="h-24 bg-linear-to-r from-gray-100 to-gray-200 sm:h-28" />

        <div className="px-4 pb-6 sm:px-6">
          {/* Profile Header */}
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <label
                className={`group relative block h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-sm ${
                  uploadingImage ? "cursor-wait" : "cursor-pointer"
                }`}
                title="Change photo"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-gray-500">
                    {initial}
                  </span>
                )}

                {/* Hover / uploading overlay */}
                <span
                  className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 text-xs font-medium text-white transition ${
                    uploadingImage
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  <FiCamera size={18} />
                  {uploadingImage ? "Uploading..." : "Change"}
                </span>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleProfileImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <div className="sm:pb-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.name}
                </h2>

                <p className="text-sm text-gray-600">{profile.email}</p>

                {profile.role && (
                  <span className="mt-2 inline-block rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {profile.role}
                  </span>
                )}
              </div>
            </div>

            {!isEditing && (
              <button onClick={handleEdit} className={primaryButtonClass}>
                Edit Profile
              </button>
            )}
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Name</label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone</label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Email</label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className={inputClass}
                />

                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButtonClass}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className={secondaryButtonClass}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* Profile Details */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <DetailItem label="Name" value={profile.name} />
              <DetailItem label="Email" value={profile.email} />
              <DetailItem
                label="Phone"
                value={profile.phone || "Not provided"}
              />
              <DetailItem label="Role" value={profile.role} />
            </div>
          )}
        </div>
      </section>

      {/* Change Password */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:p-6">
        <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
        <p className="mb-5 mt-1 text-sm text-gray-500">
          Use a strong password that you don't use elsewhere.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <PasswordField
            label="Current Password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Enter current password"
            visible={showPasswords.currentPassword}
            onToggle={() => togglePasswordVisibility("currentPassword")}
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <PasswordField
              label="New Password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              visible={showPasswords.newPassword}
              onToggle={() => togglePasswordVisibility("newPassword")}
            />

            <PasswordField
              label="Confirm New Password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              visible={showPasswords.confirmNewPassword}
              onToggle={() => togglePasswordVisibility("confirmNewPassword")}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className={`${primaryButtonClass} w-full sm:w-auto`}
            >
              {changingPassword ? "Changing Password..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>

      {/* Quick Links */}
      <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs sm:p-6">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Quick Links
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickLinks.map(({ title, description, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="group flex items-start gap-3 rounded-lg border border-gray-200 p-4 text-left transition hover:border-gray-400 hover:bg-gray-50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition group-hover:bg-black group-hover:text-white">
                <Icon size={18} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-gray-900">
                  {title}
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  {description}
                </span>
              </span>

              <FiChevronRight
                size={18}
                className="mt-1 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-gray-700"
              />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MyProfile;