import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../../api";
import Loader from "../../components/common/Loader";
import { ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  SHIPPED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getAll();
        setOrders(res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader full />;

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">📦</div>
        <h1 className="font-display text-3xl mb-2">No Orders Yet</h1>
        <p className="text-ivory/60 mb-8">Start shopping to place your first order</p>
        <Link
          to="/products"
          className="px-8 py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="font-display text-4xl mb-2">My Orders</h1>
        <p className="text-ivory/60 mb-8">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="bg-charcoal border border-white/10 hover:border-gold/30 transition-all p-6 flex justify-between items-center group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-ivory">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                  <span
                    className={`px-3 py-1 text-xs font-semibold border rounded-full ${
                      statusColors[order.status] || statusColors.PENDING
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-ivory/60 text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-xl font-semibold text-gold">₹{order.total.toLocaleString()}</p>
                <p className="text-ivory/60 text-sm">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    try {
                      await orderAPI.getInvoice(order.id);
                      toast.success("Invoice downloaded!");
                    } catch {
                      toast.error("Failed to download");
                    }
                  }}
                  className="text-gold text-xs hover:underline block ml-auto mt-1"
                >
                  ↓ Invoice
                </button>
              </div>

              <ChevronRight size={20} className="ml-4 text-gold group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
