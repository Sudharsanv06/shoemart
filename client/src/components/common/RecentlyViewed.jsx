import { useNavigate }       from "react-router-dom";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed";

export default function RecentlyViewed({ currentProductId }) {
  const { recentlyViewed, clearAll } = useRecentlyViewed();
  const navigate                     = useNavigate();

  // Filter out the current product if we're on a product page
  const filtered = recentlyViewed.filter((p) => p.id !== currentProductId);

  if (filtered.length === 0) return null;

  const parseImage = (raw) => {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr[0] : raw;
    } catch { return raw; }
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-ivory">Recently Viewed</h2>
          <p className="text-muted text-sm mt-1">
            Your last {filtered.length} viewed {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>
        <button
          onClick={clearAll}
          className="text-muted hover:text-ivory text-xs transition-colors underline"
        >
          Clear all
        </button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className="group cursor-pointer bg-carbon border border-white/5 hover:border-gold/30 rounded-sm overflow-hidden transition-all duration-300"
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-charcoal">
              <img
                src={parseImage(product.images)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = "/placeholder.jpg"; }}
              />
            </div>

            {/* Info */}
            <div className="p-3">
              <p className="text-muted text-xs tracking-widest uppercase mb-1">
                {product.brand}
              </p>
              <p className="text-ivory text-sm font-medium truncate group-hover:text-gold transition-colors">
                {product.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-gold text-sm font-semibold">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                {product.mrp > product.price && (
                  <span className="text-muted text-xs line-through">
                    ₹{product.mrp?.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}