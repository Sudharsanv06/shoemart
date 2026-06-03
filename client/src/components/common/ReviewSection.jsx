import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { reviewAPI } from "../../api";
import StarRating from "./StarRating";

export default function ReviewSection({ productId, onReviewUpdate }) {
  const { user } = useSelector((s) => s.auth);
  const navigate  = useNavigate();
  const [reviews,    setReviews]    = useState([]);
  const [avgRating,  setAvgRating]  = useState(0);
  const [total,      setTotal]      = useState(0);
  const [showForm,   setShowForm]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });

  const loadReviews = async () => {
    try {
      const res = await reviewAPI.getByProduct(productId);
      setReviews(res.data.data.reviews);
      setAvgRating(res.data.data.avgRating);
      setTotal(res.data.data.totalReviews);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadReviews(); }, [productId]);

  const handleSubmit = async () => {
    if (!user) { navigate("/login"); return; }
    if (form.rating === 0) { toast.error("Please select a rating"); return; }
    if (!form.title.trim()) { toast.error("Please add a title"); return; }
    if (!form.body.trim())  { toast.error("Please write your review"); return; }
    try {
      setSubmitting(true);
      await reviewAPI.add(productId, form);
      toast.success("Review submitted!");
      setForm({ rating: 0, title: "", body: "" });
      setShowForm(false);
      await loadReviews();
      onReviewUpdate?.();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to submit review");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    try {
      await reviewAPI.delete(id);
      toast.success("Review deleted");
      await loadReviews();
      onReviewUpdate?.();
    } catch (e) { toast.error("Failed to delete"); }
  };

  return (
    <div className="mt-16 border-t border-white/10 pt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-3xl text-ivory">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <StarRating rating={avgRating} size="md" />
            <span className="text-gold font-semibold">{avgRating}</span>
            <span className="text-muted text-sm">({total} {total === 1 ? "review" : "reviews"})</span>
          </div>
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-outline text-xs"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        )}
        {!user && (
          <button onClick={() => navigate("/login")} className="btn-outline text-xs">
            Login to Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-carbon border border-white/10 p-6 mb-8 rounded-sm">
          <h3 className="font-display text-xl text-ivory mb-4">Your Review</h3>
          <div className="mb-4">
            <p className="text-muted text-sm mb-2">Rating</p>
            <StarRating
              rating={form.rating}
              interactive
              size="lg"
              onRate={(r) => setForm({ ...form, rating: r })}
            />
          </div>
          <input
            className="input-dark mb-3"
            placeholder="Review title (e.g. Great comfort!)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className="input-dark mb-4 h-24 resize-none"
            placeholder="Share your experience with this product..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-gold flex items-center gap-2"
          >
            {submitting && <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />}
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="bg-carbon border border-white/5 p-6 rounded-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold">
                    {review.user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-ivory font-medium text-sm">{review.user.name}</p>
                    <p className="text-muted text-xs">{new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size="sm" />
                  {(user?.id === review.userId || user?.role === "ADMIN") && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-muted hover:text-red-400 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              <h4 className="text-ivory font-medium mt-3">{review.title}</h4>
              <p className="text-muted text-sm mt-1 leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
