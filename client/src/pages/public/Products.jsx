import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productAPI } from "../../api";
import { addToCart } from "../../store/cartSlice";
import { addToWishlist } from "../../store/wishlistSlice";
import ProductCard from "../../components/common/ProductCard";
import Loader from "../../components/common/Loader";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const BRAND_OPTIONS = ["NIKE", "ADIDAS", "PUMA", "REEBOK", "SKECHERS", "WOODLAND"];
const CATEGORY_OPTIONS = ["CASUALS", "FORMALS", "SPORTS", "RUNNING", "SNEAKERS", "SANDALS", "BOOTS", "FLATS", "HEELS", "SCHOOL", "DANCE", "BASKETBALL", "FOOTBALL", "TRAINING"];
const GENDER_OPTIONS = ["", "MEN", "WOMEN", "KIDS", "UNISEX"];
const MAX_PRICE = 20000;

const toList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);

  useEffect(() => {
    setSelectedBrands(toList(searchParams.get("brand")));
    setSelectedCategories(toList(searchParams.get("category")));
    setSelectedGender((searchParams.get("gender") || "").toUpperCase());
    setMinPrice(parseInt(searchParams.get("minPrice") || "0", 10));
    setMaxPrice(parseInt(searchParams.get("maxPrice") || String(MAX_PRICE), 10));
    setSortBy(searchParams.get("sort") || "featured");
    setPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  const toggleBrand = (brand) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((item) => item !== brand) : [...prev, brand]));
    setPage(1);
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => (prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]));
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedGender("");
    setMinPrice(0);
    setMaxPrice(MAX_PRICE);
    setSortBy("featured");
    setPage(1);
  };

  const fetchProducts = async () => {
    const useClientFiltering = selectedBrands.length > 1 || selectedCategories.length > 1;

    try {
      setLoading(true);
      const params = {
        page: useClientFiltering ? 1 : page,
        limit: useClientFiltering ? 1000 : 12,
        ...(selectedBrands.length === 1 ? { brand: selectedBrands[0] } : {}),
        ...(selectedCategories.length === 1 ? { category: selectedCategories[0] } : {}),
        ...(selectedGender ? { gender: selectedGender } : {}),
        ...(minPrice > 0 ? { minPrice } : {}),
        ...(maxPrice < MAX_PRICE ? { maxPrice } : {}),
        ...(sortBy ? { sort: sortBy } : {}),
      };

      const res = await productAPI.getAll(params);
      let nextProducts = res.data.data.products || [];

      if (selectedBrands.length > 1) {
        nextProducts = nextProducts.filter((product) => selectedBrands.includes(product.brand));
      }

      if (selectedCategories.length > 1) {
        nextProducts = nextProducts.filter((product) => selectedCategories.includes(product.category));
      }

      const nextTotal = useClientFiltering ? nextProducts.length : res.data.data.total || nextProducts.length;
      setProducts(nextProducts);
      setTotal(nextTotal);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedBrands, selectedCategories, selectedGender, minPrice, maxPrice, sortBy, page]);

  const pages = Math.ceil(total / 12);
  const useLocalPagination = selectedBrands.length > 1 || selectedCategories.length > 1;
  const visibleProducts = useLocalPagination ? products.slice((page - 1) * 12, page * 12) : products;
  const hasFilters = selectedBrands.length > 0 || selectedCategories.length > 0 || selectedGender || minPrice > 0 || maxPrice < MAX_PRICE;

  const handleAddToCart = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
    toast.success("Added to cart!");
  };

  const handleAddToWishlist = (productId) => {
    dispatch(addToWishlist(productId));
    toast.success("Saved to wishlist!");
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="font-display text-4xl text-ivory mb-8">Shop All Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            {hasFilters && (
              <button
                onClick={resetFilters}
                className="w-full text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300 rounded px-3 py-1.5 transition-colors mb-4"
              >
                ✕ Clear All Filters
              </button>
            )}

            <div>
              <h3 className="font-semibold text-gold mb-3 uppercase tracking-wider">Brand</h3>
              <div className="space-y-2">
                {BRAND_OPTIONS.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="hidden" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${selectedBrands.includes(brand) ? "bg-gold border-gold" : "bg-transparent border-ivory/30 group-hover:border-gold"}`}>
                      {selectedBrands.includes(brand) && (
                        <svg className="w-2.5 h-2.5 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${selectedBrands.includes(brand) ? "text-gold" : "text-ivory/70 group-hover:text-ivory"}`}>
                      {brand.charAt(0) + brand.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gold mb-3 uppercase tracking-wider">Gender</h3>
              <div className="space-y-2">
                {GENDER_OPTIONS.map((gender) => (
                  <label key={gender || "ALL"} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="gender" checked={selectedGender === gender} onChange={() => { setSelectedGender(gender); setPage(1); }} className="hidden" />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${selectedGender === gender ? "border-gold" : "border-ivory/30 group-hover:border-gold"}`}>
                      {selectedGender === gender && <div className="w-2 h-2 rounded-full bg-gold" />}
                    </div>
                    <span className={`text-sm ${selectedGender === gender ? "text-gold" : "text-ivory/70 group-hover:text-ivory"}`}>
                      {gender === "" ? "All" : gender.charAt(0) + gender.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gold mb-3 uppercase tracking-wider">Category</h3>
              <div className="space-y-2">
                {CATEGORY_OPTIONS.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} className="hidden" />
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${selectedCategories.includes(category) ? "bg-gold border-gold" : "bg-transparent border-ivory/30 group-hover:border-gold"}`}>
                      {selectedCategories.includes(category) && (
                        <svg className="w-2.5 h-2.5 text-obsidian" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm capitalize ${selectedCategories.includes(category) ? "text-gold" : "text-ivory/70 group-hover:text-ivory"}`}>
                      {category.charAt(0) + category.slice(1).toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gold text-xs font-body uppercase tracking-widest mb-3">Price Range</p>
              <div className="flex justify-between text-ivory/70 text-xs mb-2 font-body">
                <span>₹{minPrice.toLocaleString("en-IN")}</span>
                <span>₹{maxPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={500}
                  value={minPrice}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value < maxPrice) {
                      setMinPrice(value);
                      setPage(1);
                    }
                  }}
                  className="w-full accent-gold cursor-pointer"
                />
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (value > minPrice) {
                      setMaxPrice(value);
                      setPage(1);
                    }
                  }}
                  className="w-full accent-gold cursor-pointer"
                />
              </div>
              <button
                onClick={() => {
                  setMinPrice(0);
                  setMaxPrice(MAX_PRICE);
                  setPage(1);
                }}
                className="text-xs text-gold/60 hover:text-gold mt-2 font-body underline"
              >
                Reset price
              </button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-white/10">
              <p className="text-ivory/60">
                Showing <span className="text-gold font-semibold">{visibleProducts.length}</span> of <span className="text-gold font-semibold">{total}</span> products
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-charcoal border border-white/20 text-ivory focus:outline-none focus:border-gold appearance-none cursor-pointer pr-8"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gold" />
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : visibleProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-ivory/60 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {visibleProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => handleAddToCart(product.id)}
                      onAddToWishlist={() => handleAddToWishlist(product.id)}
                    />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    {Array.from({ length: pages }).map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => setPage(index + 1)}
                        className={`px-4 py-2 border transition-colors ${page === index + 1 ? "bg-gold text-obsidian border-gold" : "border-white/20 text-ivory hover:border-gold"}`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
