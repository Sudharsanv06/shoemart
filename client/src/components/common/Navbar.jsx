import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { cartAPI, wishlistAPI } from "../../api";
import { logout } from "../../store/authSlice";
import { setCart, clearCart } from "../../store/cartSlice";
import { setWishlist, clearWishlist } from "../../store/wishlistSlice";
import { Menu, X, Search, Heart, ShoppingCart, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((s) => s.auth);
  const { items: cartItems } = useSelector((s) => s.cart);
  const { items: wishlistItems } = useSelector((s) => s.wishlist);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Woodland"];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!token) return;
    cartAPI.get().then((r) => dispatch(setCart(r.data.data))).catch(() => {});
    wishlistAPI.get().then((r) => dispatch(setWishlist(r.data.data))).catch(() => {});
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-obsidian/90 backdrop-blur-md shadow-lg border-b border-white/10" : "bg-obsidian"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-2xl text-gold tracking-[0.3em] hover:text-ivory transition-colors">
          SHOEMART
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-ivory hover:text-gold transition-colors relative group">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
          </Link>

          <Link to="/products?gender=MEN" className="text-ivory hover:text-gold transition-colors relative group">
            Men
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
          </Link>

          <Link to="/products?gender=WOMEN" className="text-ivory hover:text-gold transition-colors relative group">
            Women
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
          </Link>

          <Link to="/products?gender=KIDS" className="text-ivory hover:text-gold transition-colors relative group">
            Kids
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
          </Link>

          <Link to="/products?category=SPORTS" className="text-ivory hover:text-gold transition-colors relative group">
            Sports
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
          </Link>

          {/* Brands Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button className="text-ivory hover:text-gold transition-colors relative">
              Brands
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-300" />
            </button>
            {brandsOpen && (
              <div className="absolute top-full left-0 mt-0 bg-charcoal border border-gold/30 w-48 py-2 shadow-lg">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    to={`/products?brand=${brand.toUpperCase()}`}
                    className="block px-4 py-2 text-ivory hover:bg-gold/20 hover:text-gold transition-colors"
                    onClick={() => setBrandsOpen(false)}
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="text-ivory hover:text-gold transition-colors">
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="text-ivory hover:text-gold transition-colors relative">
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className="text-ivory hover:text-gold transition-colors relative">
            <ShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-obsidian text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <button className="flex items-center gap-2 text-ivory hover:text-gold transition-colors">
                <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold flex items-center justify-center">
                  <User size={16} className="text-gold" />
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-0 bg-charcoal border border-gold/30 w-48 py-2 shadow-lg">
                  <div className="px-4 py-2 text-ivory/70 border-b border-white/10">
                    {user.name}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-ivory hover:bg-gold/20 hover:text-gold transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-ivory hover:bg-gold/20 hover:text-gold transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {user.role === "ADMIN" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-ivory hover:bg-gold/20 hover:text-gold transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-ivory hover:bg-gold/20 hover:text-gold transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-charcoal border-t border-white/10 p-4 space-y-4">
          <Link
            to="/"
            className="block text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/products?gender=MEN"
            className="block text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Men
          </Link>
          <Link
            to="/products?gender=WOMEN"
            className="block text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Women
          </Link>
          <Link
            to="/products?gender=KIDS"
            className="block text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Kids
          </Link>
          <Link
            to="/products?category=SPORTS"
            className="block text-ivory hover:text-gold transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Sports
          </Link>

          {/* Mobile Brands */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-gold font-semibold mb-2">Brands</p>
            <div className="space-y-2 pl-4">
              {brands.map((brand) => (
                <Link
                  key={brand}
                  to={`/products?brand=${brand.toUpperCase()}`}
                  className="block text-ivory hover:text-gold transition-colors text-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Auth */}
          {!user && (
            <Link
              to="/login"
              className="block px-4 py-2 bg-gold text-obsidian font-semibold text-center hover:bg-ivory transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
