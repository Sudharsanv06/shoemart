import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productAPI } from "../../api";
import { addToCart } from "../../store/cartSlice";
import { addToWishlist } from "../../store/wishlistSlice";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

const categoryInfo = {
  men: { name: "Men's Footwear", description: "Premium shoes for the modern man" },
  women: { name: "Women's Footwear", description: "Elegant and comfortable footwear" },
  kids: { name: "Kids' Footwear", description: "Durable shoes for active kids" },
  running: { name: "Running Shoes", description: "Performance shoes for runners" },
  basketball: { name: "Basketball Shoes", description: "Court shoes for athletes" },
  football: { name: "Football Boots", description: "Professional football footwear" },
  training: { name: "Training Shoes", description: "Multi-purpose athletic shoes" },
  dance: { name: "Dance Shoes", description: "Shoes for dance enthusiasts" },
};

export default function CategoryPage() {
  const { cat } = useParams();
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryKey = cat.toLowerCase();
  const info = categoryInfo[categoryKey] || { name: cat, description: "Featured collection" };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ category: cat.toUpperCase() });
        setProducts(res.data.data.products || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [cat]);

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-charcoal to-obsidian py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl text-gold mb-4 uppercase tracking-[0.2em]">{info.name}</h1>
          <p className="text-ivory/60 text-lg">{info.description}</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ivory/60 text-lg">No products found in {info.name}</p>
          </div>
        ) : (
          <>
            <p className="text-ivory/60 mb-8">
              Found <span className="text-gold font-semibold">{products.length}</span> products
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => {
                    dispatch(addToCart({ productId: product.id, quantity: 1 }));
                    toast.success("Added to cart!");
                  }}
                  onAddToWishlist={() => {
                    dispatch(addToWishlist(product.id));
                    toast.success("Saved to wishlist!");
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
