import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { MapPin } from "lucide-react";
import { FiChevronLeft } from "react-icons/fi";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";

const getImage = (images) => {
  if (!images) return FALLBACK_IMAGE;
  if (Array.isArray(images)) return images[0] || FALLBACK_IMAGE;
  if (typeof images === "string") return images.split(",")[0].trim() || FALLBACK_IMAGE;
  return FALLBACK_IMAGE;
};

const statusOptions = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  SHIPPED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/admin/${id}`);
        setOrder(res.data.data);
        setNewStatus(res.data.data.status);
      } catch (error) {
        toast.error(error.response?.data?.message || "Order not found");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const handleStatusUpdate = async () => {
    if (!order || newStatus === order.status) return;
    setUpdating(true);
    try {
      await api.patch(`/orders/admin/${id}`, { status: newStatus });
      setOrder({ ...order, status: newStatus });
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Order not found</div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <Link to="/admin/orders" className="mb-8 flex items-center gap-2 text-gold transition-colors hover:text-ivory">
          <FiChevronLeft size={20} />
          Back to Orders
        </Link>

        <div className="bg-charcoal border border-white/10 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-2xl text-ivory mb-2">Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</h1>
              <p className="text-sm text-ivory/60">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gold">₹{order.total.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="bg-charcoal border border-white/10 p-6">
              <h2 className="font-display text-xl text-gold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4 last:border-b-0">
                    <img
                      src={getImage(item.product?.images)}
                      alt={item.product?.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                      className="h-20 w-20 bg-obsidian object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-widest text-gold">{item.product?.brand}</p>
                      <p className="font-semibold text-ivory">{item.product?.name}</p>
                      {item.size && <p className="text-sm text-ivory/60">Size: {item.size}</p>}
                      <p className="text-sm text-ivory/60">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gold">₹{item.product?.price.toLocaleString()}</p>
                      <p className="text-sm text-ivory/60">₹{(item.product?.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.address && (
              <div className="bg-charcoal border border-white/10 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 flex-shrink-0 text-gold" />
                  <div>
                    <h2 className="font-display text-xl text-gold mb-3">Delivery Address</h2>
                    <p className="font-semibold text-ivory">{order.address.fullName}</p>
                    <p className="text-ivory/70">{order.address.line1 || order.address.street}</p>
                    <p className="text-ivory/70">
                      {order.address.city}, {order.address.state} {order.address.pincode || order.address.zipCode}
                    </p>
                    <p className="mt-2 text-sm text-ivory/70">Phone: {order.address.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <h2 className="font-display text-xl text-gold mb-4">Update Status</h2>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-white/20 bg-obsidian px-4 py-2 text-ivory focus:border-gold focus:outline-none"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={newStatus === order.status || updating}
                className="flex w-full items-center justify-center gap-2 bg-gold py-2 font-semibold text-obsidian transition-colors hover:bg-ivory disabled:opacity-50"
              >
                {updating && <div className="h-4 w-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" />}
                {updating ? "Updating..." : "Update Status"}
              </button>
              <div className={`rounded border px-3 py-2 text-sm font-semibold ${statusColors[order.status] || statusColors.PENDING}`}>
                Current: {order.status}
              </div>
            </div>

            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <h2 className="font-display text-xl text-gold mb-4">Price Details</h2>
              <div className="border-b border-white/10 pb-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-ivory/60">Subtotal</span>
                  <span>₹{(order.total - (order.deliveryFee || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Delivery</span>
                  <span className={order.deliveryFee === 0 ? "text-green-400" : ""}>
                    {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-gold">₹{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-charcoal border border-white/10 p-6">
              <h2 className="font-display text-xl text-gold mb-6">Order Timeline</h2>
              <div className="space-y-4">
                {statusSteps.map((step, idx) => (
                  <div key={step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                          idx <= currentStepIndex ? "bg-gold text-obsidian" : "bg-white/10 text-ivory/30"
                        }`}
                      >
                        {idx < currentStepIndex ? "✓" : idx === currentStepIndex ? "◉" : idx + 1}
                      </div>
                      {idx < statusSteps.length - 1 && (
                        <div className={`my-1 h-8 w-0.5 ${idx < currentStepIndex ? "bg-gold" : "bg-white/10"}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className={`font-semibold ${idx <= currentStepIndex ? "text-gold" : "text-ivory/40"}`}>
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
