import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Column 1: Logo & Tagline */}
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-gold tracking-[0.3em]">SHOEMART</h2>
          <p className="text-ivory/70 text-sm leading-relaxed">
            Luxury footwear for every moment. Step into excellence.
          </p>
        </div>

        {/* Column 2: Gender */}
        <div>
          <h3 className="font-display text-lg text-gold mb-4 uppercase tracking-wider">GENDER</h3>
          <ul className="space-y-2 text-ivory/70 text-sm">
            <li>
              <Link to="/products?gender=MEN" className="hover:text-gold transition-colors">
                Men
              </Link>
            </li>
            <li>
              <Link to="/products?gender=WOMEN" className="hover:text-gold transition-colors">
                Women
              </Link>
            </li>
            <li>
              <Link to="/products?gender=KIDS" className="hover:text-gold transition-colors">
                Kids
              </Link>
            </li>
            <li>
              <Link to="/products?gender=UNISEX" className="hover:text-gold transition-colors">
                Unisex
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Categories */}
        <div>
          <h3 className="font-display text-lg text-gold mb-4 uppercase tracking-wider">CATEGORIES</h3>
          <ul className="space-y-2 text-ivory/70 text-sm">
            {["CASUALS", "SPORTS", "RUNNING", "SNEAKERS", "FORMALS", "BOOTS"].map((category) => (
              <li key={category}>
                <Link to={`/products?category=${category}`} className="hover:text-gold transition-colors capitalize">
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Brands */}
        <div>
          <h3 className="font-display text-lg text-gold mb-4 uppercase tracking-wider">BRANDS</h3>
          <ul className="space-y-2 text-ivory/70 text-sm">
            {["NIKE", "ADIDAS", "PUMA", "REEBOK", "SKECHERS", "WOODLAND"].map((brand) => (
              <li key={brand}>
                <Link to={`/products?brand=${brand}`} className="hover:text-gold transition-colors capitalize">
                  {brand.charAt(0) + brand.slice(1).toLowerCase()}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 5: Help */}
        <div>
          <h3 className="font-display text-lg text-gold mb-4 uppercase tracking-wider">HELP</h3>
          <ul className="space-y-2 text-ivory/70 text-sm">
            <li>
              <button type="button" onClick={() => toast("📧 support@shoemart.com")} className="hover:text-gold transition-colors">
                Contact
              </button>
            </li>
            <li>
              <button type="button" onClick={() => toast("🔄 30-day easy returns")} className="hover:text-gold transition-colors">
                Returns
              </button>
            </li>
            <li>
              <button type="button" onClick={() => toast("🚚 Free shipping above ₹999")} className="hover:text-gold transition-colors">
                Shipping
              </button>
            </li>
            <li>
              <Link to="/products" className="hover:text-gold transition-colors">
                All Products
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-ivory/50 text-sm">
          &copy; 2026 ShoeMart. All rights reserved.
        </p>
        <div className="flex gap-4 text-ivory/70">
          <a href="#instagram" className="hover:text-gold transition-colors">
            <FaInstagram size={18} />
          </a>
          <a href="#twitter" className="hover:text-gold transition-colors">
            <FaXTwitter size={18} />
          </a>
          <a href="#facebook" className="hover:text-gold transition-colors">
            <FaFacebookF size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
