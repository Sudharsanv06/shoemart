import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiBox, FiShoppingBag, FiUsers, FiLogOut } from "react-icons/fi";
import { logout } from "../../store/authSlice";

const navItems = [
  { label: "Dashboard", icon: FiGrid, path: "/admin" },
  { label: "Products", icon: FiBox, path: "/admin/products" },
  { label: "Orders", icon: FiShoppingBag, path: "/admin/orders" },
  { label: "Users", icon: FiUsers, path: "/admin/users" },
];

export default function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="w-64 bg-charcoal border-r border-white/10 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="font-display text-2xl text-gold tracking-widest hover:text-ivory transition-colors">
          SHOEMART
        </Link>
      </div>

      <div className="p-4 border-b border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
        >
          <span className="font-medium">Back to Store</span>
        </Link>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded transition-all ${
                isActive
                  ? "bg-gold/20 border-l-4 border-gold text-gold"
                  : "text-ivory/60 hover:text-ivory border-l-4 border-transparent hover:bg-white/5"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
        >
          <FiLogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
