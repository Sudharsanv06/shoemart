import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartAPI, wishlistAPI } from "../../api";
import { setCart } from "../../store/cartSlice";
import { setWishlist } from "../../store/wishlistSlice";
import { Heart, Eye } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating";

const getFirstImage = (images, returnAll = false) => {
  const fallback = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";
  let arr = [];

  if (!images) arr = [fallback];
  else if (Array.isArray(images)) arr = images.filter(Boolean);
  else if (typeof images === "string") arr = images.split(",").map((s) => s.trim()).filter(Boolean);

  if (arr.length === 0) arr = [fallback];
  return returnAll ? arr : arr[0];
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [hoverInterval, setHoverInterval] = useState(null);
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const outOfStock = Number(product.stock) === 0;
  const images = getFirstImage(product.images, true);
  const activeImage = images[imgIndex] || images[0];
  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : typeof product.sizes === "string"
    ? product.sizes.split(",").map((size) => size.trim()).filter(Boolean)
    : [];

  useEffect(() => () => {
    if (hoverInterval) clearInterval(hoverInterval);
  }, [hoverInterval]);

  const startHoverCycle = () => {
    if (images.length <= 1 || hoverInterval) return;
    const interval = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 800);
    setHoverInterval(interval);
  };

  const stopHoverCycle = () => {
    if (hoverInterval) clearInterval(hoverInterval);
    setHoverInterval(null);
    setImgIndex(0);
  };

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast.error("Select a size first");
      return;
    }

    try {
      const res = await cartAPI.add({ productId: product.id, size: selectedSize, quantity: 1 });
      dispatch(setCart(res.data.data));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleQuickWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save items");
      navigate("/login");
      return;
    }

    try {
      const res = await wishlistAPI.add(product.id);
      dispatch(setWishlist(res.data.data || []));
      toast.success("Saved to wishlist!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save");
    }
  };

  return (
    <>
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="group relative block bg-charcoal border border-transparent hover:border-gold transition-all duration-300 overflow-hidden cursor-pointer"
      onMouseEnter={startHoverCycle}
      onMouseLeave={stopHoverCycle}
    >
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-charcoal/50">
        <img
          src={activeImage}
          alt={product.name}
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/600x600/1A1A1A/C9A84C?text=SHOEMART";
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 right-4 bg-gold text-obsidian px-3 py-1 text-sm font-semibold">
            -{discount}%
          </div>
        )}

        {outOfStock && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-semibold uppercase tracking-wider">
            Out of Stock
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-colors ${i === imgIndex ? "bg-gold" : "bg-white/40"}`}
              />
            ))}
          </div>
        )}

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(true);
            }}
            className="p-2 rounded-full bg-obsidian/80 text-ivory hover:text-gold transition-colors"
            title="Quick View"
          >
            <Eye size={20} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleQuickWishlist(e);
            }}
            className="p-3 bg-gold text-obsidian rounded-full hover:bg-ivory transition-colors"
            title="Add to Wishlist"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <p className="text-gold text-xs font-semibold uppercase tracking-widest">{product.brand}</p>

        {/* Product Name */}
        <h3 className="font-display text-lg text-ivory line-clamp-2 hover:text-gold transition-colors cursor-pointer">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <StarRating rating={product.rating || 0} size="sm" />
          <span className="text-muted text-xs">({product.reviewCount || 0})</span>
        </div>

        {/* Sizes */}
        {sizes.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-2 py-1 text-xs border rounded transition-all duration-150 ${
                  selectedSize === size
                    ? "bg-gold text-obsidian border-gold font-semibold"
                    : "bg-transparent text-ivory/70 border-ivory/20 hover:border-gold hover:text-gold"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold text-gold">₹{product.price.toLocaleString()}</span>
          {product.mrp && product.mrp > product.price && (
            <span className="text-sm text-ivory/50 line-through">₹{product.mrp.toLocaleString()}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleQuickAdd(e);
          }}
          disabled={outOfStock}
          className={`w-full py-2 font-semibold transition-colors duration-300 ${
            outOfStock ? "bg-white/10 text-ivory/40 cursor-not-allowed" : "bg-gold text-obsidian hover:bg-ivory"
          }`}
        >
          {outOfStock ? "Out of Stock" : selectedSize ? `Add to Cart - UK ${selectedSize}` : "Select a Size"}
        </button>
      </div>

      {showQuickView && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center px-4"
          onClick={() => setShowQuickView(false)}
        >
          <div
            className="relative bg-charcoal max-w-md w-full border border-gold/30 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQuickView(false)}
              className="absolute top-4 right-4 text-ivory/50 hover:text-gold text-xl"
            >
              ✕
            </button>

            <img
              src={activeImage}
              alt={product.name}
              crossOrigin="anonymous"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x600/1A1A1A/C9A84C?text=SHOEMART";
              }}
              className="w-full h-56 object-cover mb-4"
            />

            <p className="text-gold text-xs font-semibold tracking-widest uppercase">{product.brand}</p>
            <h3 className="font-display text-2xl text-ivory mt-1 mb-2">{product.name}</h3>
            <p className="text-gold font-semibold text-lg">
              ₹{product.price?.toLocaleString("en-IN")}
              {product.mrp ? (
                <span className="ml-2 text-sm text-ivory/50 line-through">₹{product.mrp?.toLocaleString("en-IN")}</span>
              ) : null}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {(product.sizes || []).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-10 h-10 rounded border text-xs transition-all ${
                    selectedSize === size
                      ? "bg-gold text-obsidian border-gold font-bold"
                      : "bg-transparent text-ivory border-ivory/30 hover:border-gold"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <button
              onClick={(e) => {
                handleQuickAdd(e);
                setShowQuickView(false);
              }}
              className="btn-gold w-full mt-4 text-sm"
            >
              {selectedSize ? `Add to Cart - UK ${selectedSize}` : "Select a Size"}
            </button>

            <button
              className="w-full mt-3 text-ivory/70 hover:text-gold text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}`);
                setShowQuickView(false);
              }}
            >
              View Full Details -&gt;
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
