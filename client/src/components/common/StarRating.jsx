export default function StarRating({ rating, interactive = false, onRate, size = "md" }) {
  const sizes = { sm: "text-sm", md: "text-xl", lg: "text-2xl" };

  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onRate && onRate(star)}
          className={`
            ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
            ${star <= Math.round(rating) ? "text-gold" : "text-white/20"}
          `}
        >
          ★
        </span>
      ))}
    </div>
  );
}
