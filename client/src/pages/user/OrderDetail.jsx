import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { orderAPI } from "../../api";
import Loader from "../../components/common/Loader";
import OrderTimeline from "../../components/common/OrderTimeline";
import { ChevronLeft, MapPin, Package, Truck, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

const getFirstImage = (images) => {
  if (!images) return FALLBACK_IMAGE;
  if (Array.isArray(images)) return images[0] || FALLBACK_IMAGE;
  if (typeof images === "string") return images.split(",")[0]?.trim() || FALLBACK_IMAGE;
  return FALLBACK_IMAGE;
};

const statusSteps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      await orderAPI.getInvoice(order.id);
      toast.success("Invoice downloaded!");
    } catch (err) {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getOne(id);
        setOrder(res.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader full />;
  if (!order) return <div className="text-center py-12 text-ivory">Order not found</div>;

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-8">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/orders" className="flex items-center gap-2 text-gold hover:text-ivory mb-8 transition-colors">
          <ChevronLeft size={20} />
          Back to Orders
        </Link>

        {/* Order Header */}
        <div className="bg-charcoal border border-white/10 p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="font-display text-2xl text-ivory mb-2">Order #{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</h1>
              <p className="text-ivory/60 text-sm mb-4">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <button
                onClick={handleDownloadInvoice}
                disabled={downloading}
                className="btn-outline flex items-center gap-2 text-xs"
              >
                {downloading
                  ? <div className="w-3 h-3 border border-gold border-t-transparent rounded-full animate-spin" />
                  : <span>↓</span>
                }
                {downloading ? "Downloading..." : "Download Invoice"}
              </button>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-gold">₹{order.total.toLocaleString()}</p>
              <p className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full inline-block ${
                order.status === "DELIVERED"
                  ? "bg-green-500/20 text-green-400"
                  : order.status === "PENDING"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-blue-500/20 text-blue-400"
              }`}>
                {order.status}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Items & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-charcoal border border-white/10 p-6">
              <h2 className="font-display text-xl text-gold mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-white/10 pb-4 last:border-b-0">
                    <img
                      src={getFirstImage(item.product?.images)}
                      alt={item.product.name}
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="w-20 h-20 object-cover bg-obsidian"
                    />
                    <div className="flex-1">
                      <p className="text-gold text-xs uppercase tracking-widest">{item.product.brand}</p>
                      <p className="font-semibold text-ivory">{item.product.name}</p>
                      {item.size && <p className="text-ivory/60 text-sm">Size: {item.size}</p>}
                      <p className="text-ivory/60 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold font-semibold">₹{item.product.price.toLocaleString()}</p>
                      <p className="text-ivory/60 text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            {order.address && (
              <div className="bg-charcoal border border-white/10 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="text-gold flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="font-display text-xl text-gold mb-3">Delivery Address</h2>
                    <p className="font-semibold text-ivory">{order.address.fullName}</p>
                    <p className="text-ivory/70">{order.address.line1 || order.address.street}</p>
                    <p className="text-ivory/70">
                      {order.address.city}, {order.address.state} {order.address.pincode || order.address.zipCode}
                    </p>
                    <p className="text-ivory/70 mt-2 text-sm">Phone: {order.address.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Price Breakdown & Timeline */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="bg-charcoal border border-white/10 p-6 space-y-4">
              <h2 className="font-display text-xl text-gold mb-4">Price Details</h2>
              <div className="space-y-3 border-b border-white/10 pb-4">
                <div className="flex justify-between">
                  <span className="text-ivory/60">Subtotal</span>
                  <span>₹{(order.total - (order.deliveryFee || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Delivery</span>
                  <span className={order.deliveryCharge === 0 ? "text-green-400" : ""}>
                    {order.deliveryCharge === 0 ? "FREE" : `₹${order.deliveryCharge}`}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-gold">₹{order.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Order Timeline */}
            <OrderTimeline
              status={order.status}
              statusLogs={order.statusLogs || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}