import { useState, useEffect } from "react";
import { reviewAPI } from "../../api";
import AdminSidebar from "../../components/admin/AdminSidebar";
import StarRating from "../../components/common/StarRating";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await reviewAPI.adminGetAll();
      setReviews(res.data.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewAPI.delete(id);
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-obsidian">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center text-ivory">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-obsidian">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-display text-4xl text-ivory">All Reviews</h1>
        </div>

        <div className="bg-charcoal border border-white/10 rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-white/5 text-ivory/60 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Rating</th>
                  <th className="px-6 py-4 font-semibold">Review</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-ivory/60">
                      No reviews found.
                    </td>
                  </tr>
                ) : (
                  reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-ivory font-medium line-clamp-1">{review.product?.name}</p>
                        <p className="text-gold text-xs">{review.product?.brand}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-ivory">{review.user?.name}</p>
                        <p className="text-ivory/60 text-xs">{review.user?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StarRating rating={review.rating} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-ivory font-medium">{review.title}</p>
                        <p className="text-ivory/60 text-xs line-clamp-1">{review.body}</p>
                      </td>
                      <td className="px-6 py-4 text-ivory/60 whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
