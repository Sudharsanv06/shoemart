import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import toast from "react-hot-toast";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300";

const getImage = (images) => {
  if (!images) return FALLBACK_IMAGE;
  if (Array.isArray(images)) return images[0] || FALLBACK_IMAGE;
  if (typeof images === "string") return images.split(",")[0].trim() || FALLBACK_IMAGE;
  return FALLBACK_IMAGE;
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const itemsPerPage = 1000;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ limit: 1000 });
        setProducts(res.data.data.products || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(results);
    setCurrentPage(1);
  }, [search, products]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      await productAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl text-ivory">Products</h1>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors"
          >
            <Plus size={20} /> Add Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-3 text-ivory/40" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-charcoal border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-charcoal border border-white/10 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-charcoal/80 border-b border-white/10">
                <tr>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Image</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Brand</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Category</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Price</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Stock</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Featured</th>
                  <th className="text-left py-4 px-4 text-ivory/60 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      <img
                        src={getImage(product.images)}
                        alt={product.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = FALLBACK_IMAGE;
                        }}
                        className="w-10 h-10 object-cover"
                      />
                    </td>
                    <td className="py-4 px-4 text-ivory line-clamp-1">{product.name}</td>
                    <td className="py-4 px-4 text-gold font-semibold">{product.brand}</td>
                    <td className="py-4 px-4 text-ivory/70">{product.category}</td>
                    <td className="py-4 px-4 text-ivory">₹{product.price.toLocaleString()}</td>
                    <td className="py-4 px-4 text-ivory">{product.stock}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${
                        product.isFeatured ? "bg-gold/20 text-gold" : "bg-white/10 text-ivory/40"
                      }`}>
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleting}
                          className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-ivory/60">
            Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{" "}
            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-white/20 text-ivory hover:border-gold disabled:opacity-50 transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <span className="flex items-center px-4 text-ivory">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-white/20 text-ivory hover:border-gold disabled:opacity-50 transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
