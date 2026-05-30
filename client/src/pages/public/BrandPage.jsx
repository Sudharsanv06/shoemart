import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productAPI } from "../../api";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";

export default function BrandPage() {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ brand: (brand || "").toUpperCase() });
        setProducts(res.data.data.products || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [brand]);

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-charcoal to-obsidian py-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="font-display text-5xl text-gold mb-4 uppercase tracking-[0.2em]">{brand}</h1>
          <p className="text-ivory/60 text-lg">Premium footwear collection</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ivory/60 text-lg">No products found for {brand}</p>
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
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
