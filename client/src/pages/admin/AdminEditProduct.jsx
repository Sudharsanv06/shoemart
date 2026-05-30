import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

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

export default function AdminEditProduct() {
  const { id } = useParams();
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
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productAPI.getOne(id);
        const product = res.data.data;
        setForm({
          name: product.name,
          description: product.description || "",
          brand: product.brand,
          category: product.category,
          gender: product.gender,
          price: product.price,
          mrp: product.mrp || product.price,
          stock: product.stock || 0,
          sizes: product.sizes || [],
          tags: product.tags ? product.tags.join(",") : "",
          isFeatured: product.isFeatured || false,
          isNew: product.isNew || false,
        });
        setExistingImages(product.images || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Request failed");
        alert("Error loading product");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

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
    setNewImages([...newImages, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreviews((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (idx) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setNewImages(newImages.filter((_, i) => i !== idx));
    setImagePreviews(imagePreviews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("brand", form.brand);
      formData.append("category", form.category);
      formData.append("gender", form.gender);
      formData.append("price", form.price);
      formData.append("mrp", form.mrp);
      formData.append("stock", form.stock);
      formData.append("sizes", JSON.stringify(form.sizes));
      formData.append("tags", form.tags);
      formData.append("isFeatured", form.isFeatured);
      formData.append("isNew", form.isNew);
      formData.append("existingImages", JSON.stringify(existingImages));

      newImages.forEach((img) => {
        formData.append("images", img);
      });

      await productAPI.update(id, formData);
      toast.success("Product updated!");
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Loading...</div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1 className="font-display text-4xl text-ivory mb-8">Edit Product</h1>

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

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-sm text-ivory/60 mb-3">Existing Images</label>
              <div className="grid grid-cols-4 gap-4">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Product ${idx}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-sm text-ivory/60 mb-3">Add More Images</label>
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
                <span className="text-ivory">Click to upload more images</span>
              </label>
            </div>

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
                      onClick={() => removeNewImage(idx)}
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
              disabled={submitting}
              className="flex-1 py-3 bg-gold text-obsidian hover:bg-ivory disabled:opacity-50 transition-colors font-semibold"
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
