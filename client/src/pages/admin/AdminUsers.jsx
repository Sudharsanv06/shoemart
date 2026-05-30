import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { adminAPI } from "../../api";
import toast from "react-hot-toast";

const FALLBACK_AVATAR = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminAPI.getUsers();
        setUsers(res.data.users || res.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Loading...</div>
      </div>
    );

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.filter((u) => u.role === "USER").length;

  const handleMakeAdmin = async (id) => {
    if (!window.confirm("Make this user an admin?")) return;
    setActionLoading(id);
    try {
      await adminAPI.updateRole(id, "ADMIN");
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, role: "ADMIN" } : user)));
      toast.success("Role updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setActionLoading(id);
    try {
      await adminAPI.deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="font-display text-4xl text-ivory mb-8">Users</h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-charcoal border border-white/10 p-4">
            <p className="text-ivory/60 text-sm mb-1">Total Users</p>
            <p className="text-2xl font-semibold text-gold">{totalUsers}</p>
          </div>
          <div className="bg-charcoal border border-white/10 p-4">
            <p className="text-ivory/60 text-sm mb-1">Admins</p>
            <p className="text-2xl font-semibold text-gold">{adminCount}</p>
          </div>
          <div className="bg-charcoal border border-white/10 p-4">
            <p className="text-ivory/60 text-sm mb-1">Regular Users</p>
            <p className="text-2xl font-semibold text-gold">{userCount}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-charcoal border border-white/10 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-charcoal/80 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">User</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Email</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Role</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Joined</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Orders</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_AVATAR;
                            }}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center font-semibold">
                            {user.name?.slice(0, 1)?.toUpperCase() || "U"}
                          </div>
                        )}
                        <span className="font-semibold text-ivory">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-ivory/70">{user.email}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          user.role === "ADMIN"
                            ? "bg-gold/20 text-gold"
                            : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-ivory/70">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {user.role !== "ADMIN" && (
                          <button
                            onClick={() => handleMakeAdmin(user.id)}
                            disabled={actionLoading === user.id}
                            className="px-3 py-1 border border-gold text-gold hover:bg-gold/10 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === user.id ? "Processing..." : "Make Admin"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading === user.id}
                          className="px-3 py-1 border border-red-500 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                          {actionLoading === user.id ? "Processing..." : "Delete"}
                        </button>
                      </div>
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
