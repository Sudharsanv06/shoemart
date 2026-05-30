import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../../api";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import { ChevronRight, Truck, RotateCcw, Shield, Lock, Zap } from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Skechers", "Woodland"];
  const categories = [
    { name: "Men's", gender: "MEN", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
    { name: "Women's", gender: "WOMEN", image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=600&q=80" },
    { name: "Kids", gender: "KIDS", image: "https://images.unsplash.com/photo-1555274175-6cbf6f3b137b?w=600&q=80" },
  ];

  const sportTypes = [
    { name: "Running", icon: "🏃", category: "RUNNING" },
    { name: "Basketball", icon: "🏀", category: "BASKETBALL" },
    { name: "Football", icon: "⚽", category: "FOOTBALL" },
    { name: "Training", icon: "💪", category: "TRAINING" },
    { name: "Dance", icon: "💃", category: "DANCE" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes] = await Promise.all([
          productAPI.getFeatured(),
          productAPI.getNew(),
        ]);
        setFeatured(featuredRes.data.data || []);
        setNewArrivals(newRes.data.data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load homepage products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-obsidian text-ivory">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-charcoal to-obsidian flex items-center overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-30">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
            alt="Hero Shoe"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full md:w-1/2">
          <h1 className="font-display text-6xl md:text-7xl text-ivory mb-6 leading-tight">
            Step Into <span className="text-gold">Luxury</span>
          </h1>
          <p className="text-xl text-ivory/70 mb-8 max-w-md">
            Discover premium footwear for every moment. Authentic brands, unbeatable prices, luxury experience.
          </p>
          <div className="flex gap-4">
            <Link
              to="/category/men"
              className="px-8 py-4 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors flex items-center gap-2"
            >
              Shop Men <ChevronRight size={20} />
            </Link>
            <Link
              to="/category/women"
              className="px-8 py-4 border-2 border-gold text-gold font-semibold hover:bg-gold hover:text-obsidian transition-colors flex items-center gap-2"
            >
              Shop Women <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="bg-charcoal border-y border-white/10 py-8 overflow-x-auto">
        <div className="flex gap-12 px-6 w-fit md:w-full md:justify-center">
          {brands.map((brand) => (
            <Link
              key={brand}
              to={`/brand/${brand.toLowerCase()}`}
              className="text-ivory hover:text-gold transition-colors font-semibold text-lg whitespace-nowrap"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="font-display text-4xl text-ivory mb-2">Featured Collection</h2>
          <p className="text-ivory/60">Curated selections of luxury footwear</p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Category Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.gender}
              to={`/category/${cat.gender.toLowerCase()}`}
              className="group relative h-96 overflow-hidden"
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
                <h3 className="font-display text-3xl text-gold group-hover:text-ivory transition-colors">{cat.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="font-display text-4xl text-ivory mb-2">New Arrivals</h2>
          <p className="text-ivory/60">Latest collections just in</p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sport Types */}
      <section className="bg-charcoal border-y border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display text-4xl text-ivory mb-12">Shop by Sport</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {sportTypes.map((sport) => (
              <Link
                key={sport.category}
                to={`/category/${sport.category.toLowerCase()}`}
                className="flex flex-col items-center gap-4 p-6 border border-white/10 hover:border-gold hover:bg-gold/10 transition-all text-center group"
              >
                <span className="text-4xl group-hover:scale-125 transition-transform">{sport.icon}</span>
                <p className="text-ivory group-hover:text-gold transition-colors font-semibold">{sport.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* USP Strip */}
      <section className="bg-obsidian border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <Truck className="text-gold" size={32} />
            <p className="text-ivory font-semibold">Free Delivery Above ₹999</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <RotateCcw className="text-gold" size={32} />
            <p className="text-ivory font-semibold">Easy Returns</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Shield className="text-gold" size={32} />
            <p className="text-ivory font-semibold">Authentic Brands</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <Lock className="text-gold" size={32} />
            <p className="text-ivory font-semibold">Secure Payments</p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-charcoal border-b border-white/10 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl text-ivory mb-4">Stay Updated</h2>
          <p className="text-ivory/60 mb-8">Get exclusive offers and new arrivals delivered to your inbox</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-obsidian text-ivory border border-white/20 placeholder-ivory/40 focus:outline-none focus:border-gold"
            />
            <button className="px-6 py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
