import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartAPI } from "../../api";
import { setCart, updateCartItem, removeFromCart, clearCart } from "../../store/cartSlice";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const getImage = (images) => {
  if (!images) return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
  if (Array.isArray(images)) return images[0] || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
  if (typeof images === "string") return images.split(",")[0].trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
  return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
};

export default function Cart() {
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.cart);
  const [loading, setLoading] = useState(true);

  const getItemProduct = (item) => item.product || {};

  useEffect(() => {
    const load = async () => {
      try {
        const res = await cartAPI.get();
        dispatch(setCart(res.data.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dispatch]);

  const handleUpdateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await cartAPI.update(id, newQty);
      dispatch(updateCartItem({ id, quantity: newQty }));
      toast.success("Cart updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleRemove = async (id) => {
    try {
      await cartAPI.remove(id);
      dispatch(removeFromCart(id));
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed");
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || item.price || 0) * item.quantity, 0);
  const delivery = subtotal > 999 ? 0 : 99;
  const total = subtotal + delivery;

  if (loading) {
    return <div className="h-screen flex items-center justify-center text-ivory">Loading...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="font-display text-3xl mb-2">Your Cart is Empty</h1>
        <p className="text-ivory/60 mb-8">Add some luxury shoes to get started</p>
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
        <h1 className="font-display text-4xl mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-charcoal border border-white/10 p-6 flex gap-6 hover:border-gold/30 transition-colors">
                {/* Image */}
                <div className="w-24 h-24 flex-shrink-0 overflow-hidden bg-obsidian">
                  <img
                    src={getImage(getItemProduct(item).images)}
                    alt={getItemProduct(item).name || "Cart item"}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <p className="text-gold text-sm uppercase tracking-widest">{getItemProduct(item).brand || "Shoemart"}</p>
                  <h3 className="font-display text-lg text-ivory">{getItemProduct(item).name || "Selected product"}</h3>
                  {item.size && <p className="text-ivory/60 text-sm">Size: {item.size}</p>}
                  <p className="text-xl font-semibold text-gold">₹{(item.product?.price || item.price || 0).toLocaleString()}</p>
                </div>

                {/* Qty & Actions */}
                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center border border-white/20">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gold/20 transition-colors"
                    >
                      <ChevronDown size={16} />
                    </button>
                    <span className="px-4 py-1 border-l border-r border-white/20">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gold/20 transition-colors"
                    >
                      <ChevronUp size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                  <p className="text-ivory/60 text-sm">
                    Total: <span className="text-gold">₹{((item.product?.price || item.price || 0) * item.quantity).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-charcoal border border-gold/30 p-8 space-y-6 sticky top-24">
              <h2 className="font-display text-2xl text-gold">Order Summary</h2>

              <div className="space-y-3 border-b border-white/10 pb-6">
                <div className="flex justify-between">
                  <span className="text-ivory/60">Subtotal</span>
                  <span className="text-ivory">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ivory/60">Delivery</span>
                  <span className={delivery === 0 ? "text-green-400" : "text-ivory"}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-semibold">
                <span>Total</span>
                <span className="text-gold">₹{total.toLocaleString()}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors text-center block"
              >
                Proceed to Checkout
              </Link>

              <button
                onClick={() => dispatch(clearCart())}
                className="w-full py-3 border border-white/20 text-ivory hover:border-gold transition-colors"
              >
                Clear Cart
              </button>

              {subtotal <= 999 && (
                <p className="text-sm text-amber-400">Add ₹{(1000 - subtotal).toLocaleString()} more for free delivery!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
