import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartAPI, productAPI, wishlistAPI } from "../../api";
import { setCart } from "../../store/cartSlice";
import { setWishlist } from "../../store/wishlistSlice";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import ReviewSection from "../../components/common/ReviewSection";
import StarRating from "../../components/common/StarRating";
import { Heart, Star, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

const getFirstImage = (images) => {
  if (!images) return FALLBACK_IMAGE;
  if (Array.isArray(images)) return images[0] || FALLBACK_IMAGE;
  if (typeof images === "string") return images.split(",")[0]?.trim() || FALLBACK_IMAGE;
  return FALLBACK_IMAGE;
};

const toImageList = (images) => {
  if (!images) return [FALLBACK_IMAGE];
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string") return images.split(",").map((image) => image.trim()).filter(Boolean);
  return [FALLBACK_IMAGE];
};
const parseProduct = (p) => p;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : typeof product?.sizes === "string"
    ? product.sizes.split(",").map((size) => size.trim()).filter(Boolean)
    : [];
  const imageList = toImageList(product?.images);
  const outOfStock = Number(product?.stock) === 0;

  const fetchProduct = async () => {
    try {
      const res = await productAPI.getOne(id);
      const prod = res.data.data;
      setProduct(prod);
      setMainImage(getFirstImage(prod.images));
      
      // Fetch related products (same brand)
      const relatedRes = await productAPI.getAll({ brand: prod.brand });
      setRelated(relatedRes.data.data.products?.filter(p => p.id !== id).slice(0, 4) || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewUpdate = async () => {
    try {
      const res = await productAPI.getOne(id);
      setProduct(parseProduct(res.data.data));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    setSelectedSize(null);
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      setAddingToCart(true);
      const res = await cartAPI.add({
        productId: product.id,
        size: selectedSize,
        quantity: 1,
      });
      dispatch(setCart(res.data.data || []));
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to save items");
      navigate("/login");
      return;
    }

    try {
      setAddingToWishlist(true);
      const res = await wishlistAPI.add(product.id);
      dispatch(setWishlist(res.data.data || []));
      toast.success("Saved to wishlist!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) return <Loader full />;
  if (!product) return <div className="text-center py-12 text-ivory">Product not found</div>;

  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-charcoal aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={mainImage || getFirstImage(product.images)}
                alt={product.name}
                crossOrigin="anonymous"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x600/1A1A1A/C9A84C?text=SHOEMART";
                }}
                className="w-full h-full object-cover"
              />
            </div>
            {imageList.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {imageList.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`w-20 h-20 border-2 transition-colors ${
                      mainImage === img ? "border-gold" : "border-white/10"
                    }`}
                  >
                    <img
                      src={getFirstImage(img)}
                      alt={`${product.name} ${i}`}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x600/1A1A1A/C9A84C?text=SHOEMART";
                      }}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-gold text-sm font-semibold uppercase tracking-widest">{product.brand}</p>
              <h1 className="font-display text-4xl text-ivory mt-2">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating || 0} size="md" />
              <span className="text-gold font-semibold">{product.rating || 0}</span>
              <span className="text-muted text-sm">({product.reviewCount || 0} {product.reviewCount === 1 ? "review" : "reviews"})</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-semibold text-gold">₹{product.price.toLocaleString()}</span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-ivory/50 line-through">₹{product.mrp.toLocaleString()}</span>
                    <span className="px-3 py-1 bg-gold text-obsidian text-sm font-semibold">-{discount}%</span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-ivory/70 leading-relaxed">{product.description}</p>

            {outOfStock && (
              <div className="inline-flex px-4 py-2 bg-red-500/15 border border-red-500/40 text-red-300 font-semibold uppercase tracking-wider">
                Out of Stock
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div>
                <p className="font-semibold mb-3">
                  Size: {selectedSize ? `UK ${selectedSize}` : "Not selected"}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`
                        w-12 h-12 text-sm font-medium border transition-all duration-200
                        ${outOfStock
                          ? "border-white/10 text-ivory/30 cursor-not-allowed"
                          : selectedSize === size
                          ? "border-gold bg-gold text-obsidian"
                          : "border-white/20 text-ivory hover:border-gold hover:text-gold"
                        }
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="mt-3 text-sm text-ivory/60">Please select a size to add to cart</p>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <p className="font-semibold">Quantity</p>
              <div className="flex border border-white/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gold/20 transition-colors"
                >
                  <ChevronDown size={20} />
                </button>
                <span className="px-6 py-2 border-l border-r border-white/20">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gold/20 transition-colors"
                >
                  <ChevronUp size={20} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock || addingToCart}
                className={`flex-1 py-4 font-semibold transition-colors ${
                  outOfStock ? "bg-white/10 text-ivory/40 cursor-not-allowed" : "bg-gold text-obsidian hover:bg-ivory"
                }`}
              >
                {outOfStock
                  ? "Out of Stock"
                  : addingToCart
                  ? "Adding..."
                  : selectedSize
                  ? `Add to Cart - UK ${selectedSize}`
                  : "Select a Size"}
              </button>
              <button
                onClick={handleAddToWishlist}
                disabled={addingToWishlist}
                className="px-6 py-4 border border-gold text-gold hover:bg-gold/20 transition-colors"
              >
                <Heart size={20} />
              </button>
            </div>

            {/* USPs */}
            <div className="bg-charcoal p-4 space-y-2 text-sm text-ivory/70">
              <p>✓ Free delivery above ₹999</p>
              <p>✓ Easy 30-day returns</p>
              <p>✓ Authentic products guaranteed</p>
              <p>✓ Secure payment options</p>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="border-y border-white/10 py-8 mb-16">
          <div className="space-y-4">
            {["Description", "Size Guide", "Delivery & Returns"].map((tab) => (
              <div key={tab}>
                <button
                  onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
                  className="w-full flex justify-between items-center py-4 font-semibold text-ivory hover:text-gold transition-colors"
                >
                  {tab}
                  <span className={`transition-transform ${activeTab === tab.toLowerCase().replace(" ", "") ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {activeTab === tab.toLowerCase().replace(" ", "") && (
                  <div className="pb-4 text-ivory/70 space-y-2">
                    {tab === "Description" && <p>{product.description}</p>}
                    {tab === "Size Guide" && <p>Please refer to our size chart. Returns are free within 30 days.</p>}
                    {tab === "Delivery & Returns" && <p>Free delivery on orders above ₹999. Easy returns within 30 days.</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="font-display text-3xl text-ivory mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <ReviewSection productId={product.id} onReviewUpdate={handleReviewUpdate} />
      </div>
    </div>
  );
}
