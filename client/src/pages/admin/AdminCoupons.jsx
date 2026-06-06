import { useState, useEffect } from "react";
import { adminAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminHeader  from "../../components/admin/AdminHeader";
import Loader       from "../../components/common/Loader";
import toast        from "react-hot-toast";
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiTag } from "react-icons/fi";

export default function AdminCoupons() {
  const [coupons,    setCoupons]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    code:          "",
    discountType:  "PERCENTAGE",
    discountValue: "",
    minOrder:      "",
    maxUses:       "",
    expiresAt:     "",
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getCoupons();
      setCoupons(res.data.data);
    } catch (e) {
      toast.error("Failed to load coupons");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleCreate = async () => {
    if (!form.code.trim()) { toast.error("Coupon code is required"); return; }
    if (!form.discountValue) { toast.error("Discount value is required"); return; }
    if (form.discountType === "PERCENTAGE" && +form.discountValue > 100) {
      toast.error("Percentage cannot exceed 100"); return;
    }
    try {
      setSubmitting(true);
      await adminAPI.createCoupon({
        code:          form.code.toUpperCase().trim(),
        discountType:  form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrder:      parseFloat(form.minOrder)  || 0,
        maxUses:       parseInt(form.maxUses)     || null,
        expiresAt:     form.expiresAt             || null,
      });
      toast.success(`Coupon ${form.code.toUpperCase()} created!`);
      setForm({ code: "", discountType: "PERCENTAGE", discountValue: "", minOrder: "", maxUses: "", expiresAt: "" });
      setShowForm(false);
      loadCoupons();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to create coupon");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await adminAPI.toggleCoupon(id, !current);
      toast.success(`Coupon ${!current ? "activated" : "deactivated"}`);
      loadCoupons();
    } catch (e) {
      toast.error("Failed to update coupon");
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon ${code}? This cannot be undone.`)) return;
    try {
      await adminAPI.deleteCoupon(id);
      toast.success("Coupon deleted");
      loadCoupons();
    } catch (e) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <AdminHeader title="Coupons" subtitle="Create and manage discount codes" />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <FiTag className="text-gold text-xl" />
            <p className="text-muted text-sm">
              {coupons.filter(c => c.isActive).length} active /  {coupons.length} total coupons
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-gold flex items-center gap-2"
          >
            <FiPlus />
            {showForm ? "Cancel" : "Create Coupon"}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="card-dark p-6 mb-8 border border-gold/20">
            <h3 className="font-display text-2xl text-ivory mb-6">New Coupon</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Coupon Code *
                </label>
                <input
                  className="input-dark uppercase font-mono tracking-widest"
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Discount Type *
                </label>
                <select
                  className="input-dark"
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FIXED">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Discount Value * {form.discountType === "PERCENTAGE" ? "(max 100%)" : "(₹)"}
                </label>
                <input
                  className="input-dark"
                  type="number"
                  min="1"
                  max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                  placeholder={form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 500"}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                />
              </div>

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Minimum Order Amount (₹)
                </label>
                <input
                  className="input-dark"
                  type="number"
                  placeholder="e.g. 999 (leave blank for no minimum)"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                />
              </div>

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Max Uses (optional)
                </label>
                <input
                  className="input-dark"
                  type="number"
                  placeholder="e.g. 100 (leave blank for unlimited)"
                  value={form.maxUses}
                  onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                />
              </div>

              <div>
                <label className="text-muted text-xs tracking-widest uppercase block mb-2">
                  Expiry Date (optional)
                </label>
                <input
                  className="input-dark"
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                />
              </div>
            </div>

            {/* Preview */}
            {form.code && form.discountValue && (
              <div className="mt-5 p-4 bg-gold/10 border border-gold/30 rounded-sm">
                <p className="text-gold text-sm font-semibold">
                  Preview: <span className="font-mono">{form.code}</span> gives{" "}
                  {form.discountType === "PERCENTAGE"
                    ? `${form.discountValue}% off`
                    : `₹${form.discountValue} off`}
                  {form.minOrder ? ` on orders above ₹${form.minOrder}` : ""}
                  {form.maxUses ? ` (max ${form.maxUses} uses)` : ""}
                  {form.expiresAt ? ` until ${new Date(form.expiresAt).toLocaleDateString("en-IN")}` : ""}
                </p>
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={submitting}
              className="btn-gold mt-6 flex items-center gap-2"
            >
              {submitting && (
                <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
              )}
              {submitting ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        )}

        {/* Coupons Table */}
        {loading ? (
          <Loader />
        ) : coupons.length === 0 ? (
          <div className="card-dark p-16 text-center">
            <FiTag className="text-gold text-5xl mx-auto mb-4 opacity-30" />
            <p className="font-display text-2xl text-ivory mb-2">No Coupons Yet</p>
            <p className="text-muted text-sm">Create your first discount coupon to attract customers.</p>
            <button onClick={() => setShowForm(true)} className="btn-gold mt-6">
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="card-dark overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-charcoal">
                  {["Code", "Type", "Value", "Min Order", "Uses", "Expires", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left text-muted text-xs tracking-widest uppercase p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">

                    {/* Code */}
                    <td className="p-4">
                      <span className="text-gold font-mono font-bold tracking-widest">{coupon.code}</span>
                    </td>

                    {/* Type */}
                    <td className="p-4">
                      <span className="text-muted text-xs uppercase tracking-wider">{coupon.discountType}</span>
                    </td>

                    {/* Value */}
                    <td className="p-4">
                      <span className="text-ivory font-semibold">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue.toLocaleString("en-IN")}`}
                      </span>
                    </td>

                    {/* Min Order */}
                    <td className="p-4 text-muted">
                      {coupon.minOrder > 0 ? `₹${coupon.minOrder.toLocaleString("en-IN")}` : "—"}
                    </td>

                    {/* Uses */}
                    <td className="p-4">
                      <span className={`text-sm ${coupon.maxUses && coupon.usedCount >= coupon.maxUses ? "text-red-400" : "text-muted"}`}>
                        {coupon.usedCount} / {coupon.maxUses || "∞"}
                      </span>
                    </td>

                    {/* Expires */}
                    <td className="p-4 text-muted text-xs">
                      {coupon.expiresAt
                        ? (() => {
                            const expired = new Date() > new Date(coupon.expiresAt);
                            return (
                              <span className={expired ? "text-red-400" : "text-muted"}>
                                {expired ? "Expired " : ""}
                                {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}
                              </span>
                            );
                          })()
                        : <span>Never</span>
                      }
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium
                        ${coupon.isActive
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleToggle(coupon.id, coupon.isActive)}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                          className={`transition-colors ${coupon.isActive ? "text-green-400 hover:text-red-400" : "text-red-400 hover:text-green-400"}`}
                        >
                          {coupon.isActive
                            ? <FiToggleRight size={22} />
                            : <FiToggleLeft  size={22} />}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                          title="Delete coupon"
                          className="text-muted hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}