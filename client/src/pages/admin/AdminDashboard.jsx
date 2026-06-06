import { useEffect, useState } from "react";
import { orderAPI, productAPI, adminAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiShoppingCart, FiBox, FiUsers } from "react-icons/fi";
import toast from "react-hot-toast";
import AdminHeader from "../../components/admin/AdminHeader";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        const statsData = statsRes.data || {};

        setStats({
          totalRevenue: statsData.totalRevenue || 0,
          totalOrders: statsData.totalOrders || 0,
          totalProducts: statsData.totalProducts || 0,
          totalUsers: statsData.totalUsers || 0,
        });

        setOrders(statsData.recentOrders || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const orderChartData = orders.reduce((acc, order) => {
    const dateKey = new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    const existing = acc.find((item) => item.date === dateKey);
    if (existing) {
      existing.total += order.total || 0;
      existing.orders += 1;
    } else {
      acc.push({ date: dateKey, total: order.total || 0, orders: 1 });
    }
    return acc;
  }, []);
  
  // Order status distribution
  const orderStatusData = orders.reduce(
    (acc, order) => {
      const existing = acc.find((item) => item.name === order.status);
      if (existing) existing.value++;
      else acc.push({ name: order.status, value: 1 });
      return acc;
    },
    []
  );

  const statusColors = {
    PENDING: "#fbbf24",
    CONFIRMED: "#3b82f6",
    PROCESSING: "#a855f7",
    SHIPPED: "#06b6d4",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
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
        <h1 className="font-display text-4xl text-ivory mb-8">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={FiTrendingUp}
            color="text-green-400"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={FiShoppingCart}
            color="text-blue-400"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={FiBox}
            color="text-gold"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers || "—"}
            icon={FiUsers}
            color="text-purple-400"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-charcoal border border-white/10 p-6 rounded">
            <h2 className="font-display text-xl text-gold mb-4">Recent Orders by Date</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff60" />
                <YAxis stroke="#ffffff60" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #d4af37" }} />
                <Legend />
                <Bar dataKey="total" name="Revenue" fill="#d4af37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Pie Chart */}
          <div className="bg-charcoal border border-white/10 p-6 rounded">
            <h2 className="font-display text-xl text-gold mb-4">Orders by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={statusColors[entry.name] || "#ffffff"} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #d4af37" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-charcoal border border-white/10 p-6 rounded">
          <h2 className="font-display text-xl text-gold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-ivory/60 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 text-ivory/60 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-ivory/60 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 text-ivory/60 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 text-ivory/60 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-gold font-semibold">
                      {(order.orderNumber || order.id).slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-ivory">{order.user?.name || order.address?.fullName || "N/A"}</td>
                    <td className="py-3 px-4 text-ivory/70">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-ivory">₹{order.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          order.status === "DELIVERED"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-charcoal border border-white/10 p-6 rounded hover:border-gold/30 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ivory/60 text-sm mb-2">{title}</p>
          <p className="text-2xl font-semibold text-ivory">{value}</p>
        </div>
        <Icon size={32} className={`${color} opacity-60`} />
      </div>
    </div>
  );
}