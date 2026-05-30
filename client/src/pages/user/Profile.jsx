import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authAPI } from "../../api";
import { setCredentials } from "../../store/authSlice";
import { Camera, Trash2, MapPin, Lock, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);

  // Edit Profile
  const [profileForm, setProfileForm] = useState({ name: "", phone: "" });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  // Change Password
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({ name: user.name || "", phone: user.phone || "" });
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
    }
  }, [user]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", profileForm.name);
      formData.append("phone", profileForm.phone || "");
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await authAPI.updateProfile(formData);
      dispatch(setCredentials({ user: res.data.data, token }));
      setAvatarPreview(res.data.data.avatar || avatarPreview);
      setAvatarFile(null);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordError("");
      setSavingPassword(true);
      const res = await authAPI.update({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Error changing password");
    } finally {
      setSavingPassword(false);
    }
  };

  // Handle add address
  const handleAddAddress = () => {
    if (newAddress.fullName && newAddress.street && newAddress.city) {
      setAddresses([...addresses, newAddress]);
      setNewAddress({ fullName: "", phone: "", street: "", city: "", state: "", zipCode: "" });
      setShowAddressForm(false);
    }
  };

  // Handle delete address
  const handleDeleteAddress = (idx) => {
    setAddresses(addresses.filter((_, i) => i !== idx));
  };

  // Handle set default address
  const handleSetDefault = (idx) => {
    const updated = addresses.map((addr, i) => ({ ...addr, isDefault: i === idx }));
    setAddresses(updated);
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-4xl mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Avatar & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-charcoal border border-white/10 p-6 text-center">
              <button
                type="button"
                onClick={() => document.getElementById("avatarInput").click()}
                className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold/40 cursor-pointer"
              >
                <img
                  src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=C9A84C&color=0D0D0D`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-2 border-gold"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-ivory text-xs">Change</span>
                </div>
              </button>
              <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              <h2 className="font-display text-xl text-gold mb-1">{user?.name}</h2>
              <p className="text-ivory/60 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Right: Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit Profile */}
            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-gold" />
                <h2 className="font-display text-xl text-gold">Edit Profile</h2>
              </div>

              <div>
                <label className="text-sm text-ivory/60">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-ivory/60">Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full mt-1 px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  placeholder="Your phone"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={savingProfile}
                className="w-full py-2 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Change Password */}
            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={20} className="text-gold" />
                <h2 className="font-display text-xl text-gold">Change Password</h2>
              </div>

              {passwordError && (
                <div className="p-3 bg-red-500/20 border border-red-500 text-red-200 text-sm">{passwordError}</div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-green-500/20 border border-green-500 text-green-200 text-sm">{passwordSuccess}</div>
              )}

              <div>
                <label className="text-sm text-ivory/60">Current Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                    className="absolute right-3 top-2.5 text-ivory/60 hover:text-ivory"
                  >
                    {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-ivory/60">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-2.5 text-ivory/60 hover:text-ivory"
                  >
                    {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-ivory/60">Confirm Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-2.5 text-ivory/60 hover:text-ivory"
                  >
                    {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                disabled={savingPassword}
                className="w-full py-2 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
              >
                {savingPassword ? "Processing..." : "Update Password"}
              </button>
            </div>

            {/* My Addresses */}
            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="text-gold" />
                <h2 className="font-display text-xl text-gold">My Addresses</h2>
              </div>

              <div className="space-y-3">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 border border-white/10 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-ivory">{addr.fullName}</p>
                        <p className="text-ivory/70">{addr.street}</p>
                        <p className="text-ivory/70">
                          {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-ivory/60 text-sm">Phone: {addr.phone}</p>
                      </div>
                      {addr.isDefault && (
                        <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-semibold">DEFAULT</span>
                      )}
                    </div>
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => handleSetDefault(idx)}
                        className="px-3 py-1 border border-gold text-gold hover:bg-gold/20 transition-colors"
                      >
                        Set Default
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(idx)}
                        className="px-3 py-1 border border-red-500 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {showAddressForm ? (
                <div className="border border-gold/30 p-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    className="w-full px-3 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 py-2 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-2 border border-white/20 text-ivory hover:border-gold transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="w-full py-2 border border-gold text-gold hover:bg-gold/20 transition-colors font-semibold"
                >
                  + Add New Address
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
