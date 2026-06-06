import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";
import AdminHeader from "../../components/admin/AdminHeader";
const statusColors = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  PROCESSING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  SHIPPED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DELIVERED: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const statuses = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
  const statusOptions = statuses.filter((status) => status !== "ALL");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.adminAll();
        const payload = res.data.data || {};
        const allOrders = Array.isArray(payload) ? payload : payload.orders || [];
        setOrders(allOrders);
        setTotal(Array.isArray(payload) ? payload.length : payload.total || allOrders.length);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const results =
      statusFilter === "ALL" ? orders : orders.filter((o) => o.status === statusFilter);
    setFiltered(results);
  }, [statusFilter, orders]);

  const handleStatusUpdate = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await orderAPI.adminUpdate(orderId, nextStatus);
      const updatedOrder = res.data.data || res.data;
      setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: updatedOrder.status || nextStatus } : order)));
      toast.success("Order status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Loading...</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="font-display text-4xl text-ivory mb-8">Orders</h1>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                statusFilter === status
                  ? "bg-gold text-obsidian"
                  : "bg-charcoal border border-white/20 text-ivory/60 hover:border-gold"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-charcoal border border-white/10 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-charcoal/80 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Order ID</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Customer</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Date</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Items</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Total</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 text-gold font-semibold">{order.orderNumber || order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="py-4 px-4 text-ivory">{order.address?.fullName || "N/A"}</td>
                    <td className="py-4 px-4 text-ivory/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-ivory">{order.items?.length || 0} item(s)</td>
                    <td className="py-4 px-4 text-ivory">₹{order.total.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${
                        statusColors[order.status] || statusColors.PENDING
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-2 min-w-[180px]">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          disabled={updatingOrderId === order.id}
                          className="w-full px-3 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-gold hover:text-ivory transition-colors"
                        >
                          View <FiChevronRight size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-ivory/60 mt-6">Total: {filtered.length} order(s){total && total !== filtered.length ? ` of ${total}` : ""}</p>
      </div>
    </div>
  );
}
