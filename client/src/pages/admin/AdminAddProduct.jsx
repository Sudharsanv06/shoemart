import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

const normalizeEnum = (value) => {
  if (!value) return value;
  const normalized = String(value).trim().toUpperCase();
  const map = {
    CASUAL: "CASUALS",
    FORMAL: "FORMALS",
    SPORT: "SPORTS",
    SNEAKER: "SNEAKERS",
    SANDAL: "SANDALS",
    BOOT: "BOOTS",
    FLAT: "FLATS",
    HEEL: "HEELS",
  };
  return map[normalized] || normalized;
};

const FALLBACK_IMAGE = "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg";

const brands = [
  { label: "Nike", value: "NIKE" },
  { label: "Adidas", value: "ADIDAS" },
  { label: "Puma", value: "PUMA" },
  { label: "Reebok", value: "REEBOK" },
  { label: "Skechers", value: "SKECHERS" },
  { label: "Woodland", value: "WOODLAND" },
  { label: "Other", value: "OTHER" },
];
const categories = [
  { label: "Casuals", value: "CASUALS" },
  { label: "Formals", value: "FORMALS" },
  { label: "Sports", value: "SPORTS" },
  { label: "Running", value: "RUNNING" },
  { label: "Sneakers", value: "SNEAKERS" },
  { label: "Sandals", value: "SANDALS" },
  { label: "Boots", value: "BOOTS" },
  { label: "Flats", value: "FLATS" },
  { label: "Heels", value: "HEELS" },
  { label: "School", value: "SCHOOL" },
  { label: "Dance", value: "DANCE" },
  { label: "Basketball", value: "BASKETBALL" },
  { label: "Football", value: "FOOTBALL" },
  { label: "Training", value: "TRAINING" },
];
const genders = [
  { label: "Men", value: "MEN" },
  { label: "Women", value: "WOMEN" },
  { label: "Kids", value: "KIDS" },
  { label: "Unisex", value: "UNISEX" },
];
const availableSizes = ["4", "5", "6", "7", "8", "9", "10", "11"];

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    category: "",
    gender: "",
    price: "",
    mrp: "",
    stock: "",
    sizes: [],
    tags: "",
    isFeatured: false,
    isNew: false,
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSizeToggle = (size) => {
    setForm({
      ...form,
      sizes: form.sizes.includes(size) ? form.sizes.filter((s) => s !== size) : [...form.sizes, size],
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    setImages([...images, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.brand || !form.category || !form.gender || !form.price) {
      toast.error("Please fill all required fields");
      return;
    }

    let timeout;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description?.trim() || `Premium ${form.name}`);
      formData.append("price", form.price);
      formData.append("mrp", form.mrp || form.price);
      formData.append("brand", form.brand.toUpperCase());
      formData.append("category", normalizeEnum(form.category));
      formData.append("gender", normalizeEnum(form.gender));
      formData.append("stock", form.stock || 0);
      formData.append("isFeatured", form.isFeatured || false);
      formData.append("isNew", form.isNew || false);
      formData.append("sizes", Array.isArray(form.sizes) ? form.sizes.join(",") : "");
      formData.append("tags", form.tags || "");

      images.forEach((img) => {
        formData.append("images", img);
      });

      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), 30000);

      await productAPI.create(formData, { signal: controller.signal });

      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED" || error.name === "CanceledError") {
        toast.error("Upload timed out. Try a smaller image.");
      } else {
        toast.error(error.response?.data?.message || "Failed to create product");
      }
    } finally {
      if (timeout) clearTimeout(timeout);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="font-display text-4xl text-ivory mb-8">Add Product</h1>

        <form onSubmit={handleSubmit} className="bg-charcoal border border-white/10 p-8 max-w-4xl space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-ivory/60 mb-2">Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              placeholder="E.g., Nike Air Max 90"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-ivory/60 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold h-24 resize-none"
              placeholder="Product description..."
            />
          </div>

          {/* Brand, Category, Gender */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-ivory/60 mb-2">Brand *</label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
                required
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price, MRP, Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-ivory/60 mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">MRP (₹)</label>
              <input
                type="number"
                name="mrp"
                value={form.mrp}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-sm text-ivory/60 mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm text-ivory/60 mb-3">Sizes</label>
            <div className="grid grid-cols-8 gap-2">
              {availableSizes.map((size) => (
                <label key={size} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="w-4 h-4 accent-gold"
                  />
                  <span className="text-ivory text-sm">{size}</span>
                </label>
              ))}
            </div>
            {form.gender === "KIDS" && (
              <p className="mt-3 text-sm text-ivory/60">
                ℹ️ For Kids, recommended sizes are 4–7. Sizes 8+ are typically adult sizes.
              </p>
            )}
            {form.gender === "UNISEX" && (
              <p className="mt-3 text-sm text-ivory/60">
                ℹ️ Unisex products will appear in both Men and Women category pages.
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm text-ivory/60 mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-obsidian border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              placeholder="e.g., limited-edition, bestseller"
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleInputChange}
                className="w-5 h-5 accent-gold"
              />
              <span className="text-ivory">Is Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={form.isNew}
                onChange={handleInputChange}
                className="w-5 h-5 accent-gold"
              />
              <span className="text-ivory">Is New Arrival</span>
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm text-ivory/60 mb-3">Product Images *</label>
            <div className="border-2 border-dashed border-white/20 hover:border-gold/50 p-6 rounded cursor-pointer transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imageInput"
              />
              <label htmlFor="imageInput" className="flex flex-col items-center gap-2 cursor-pointer">
                <Upload size={32} className="text-gold" />
                <span className="text-ivory">Click to upload or drag and drop</span>
                <span className="text-ivory/60 text-sm">PNG, JPG, GIF up to 10MB</span>
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 py-3 border border-white/20 text-ivory hover:border-gold transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gold text-obsidian hover:bg-ivory disabled:opacity-50 transition-colors font-semibold"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
