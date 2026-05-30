import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { wishlistAPI, cartAPI } from "../../api";
import { setWishlist, removeFromWishlist } from "../../store/wishlistSlice";
import { addToCart } from "../../store/cartSlice";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

export default function Wishlist() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.wishlist);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await wishlistAPI.get();
        dispatch(setWishlist(res.data.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const handleAddToCart = async (productId) => {
    try {
      await cartAPI.add({ productId, quantity: 1 });
      dispatch(addToCart({ productId, quantity: 1 }));
      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.remove(productId);
      dispatch(removeFromWishlist(productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) return <Loader full />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center">
        <Heart size={64} className="mb-6 text-gold" />
        <h1 className="font-display text-3xl mb-2">Your Wishlist is Empty</h1>
        <p className="text-ivory/60 mb-8">Save your favorite shoes to view them later</p>
        <Link
          to="/products"
          className="px-8 py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-ivory py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display text-4xl mb-2">My Wishlist</h1>
        <p className="text-ivory/60 mb-8">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product || item;
            const productId = product.id || item.productId || item.id;

            return (
              <div key={item.id} className="group relative">
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(productId)}
                  onAddToWishlist={() => handleRemove(productId)}
                />
                <div className="absolute top-4 right-4 space-y-2">
                  <button
                    onClick={() => handleRemove(productId)}
                    className="w-full px-3 py-1 bg-red-500/80 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
