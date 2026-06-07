import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate }                               from "react-router-dom";
import { searchAPI }                                 from "../../api";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(-1);
  const inputRef              = useRef(null);
  const timerRef              = useRef(null);
  const navigate              = useNavigate();

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
      setActive(-1);
    }
  }, [isOpen]);

  // Debounced search
  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    try {
      setLoading(true);
      const res = await searchAPI.search(q);
      setResults(res.data.data || []);
      setActive(-1);
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!query.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timerRef.current);
  }, [query, doSearch]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const parseImages = (raw) => {
    try {
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr[0] : raw;
    } catch { return raw; }
  };

  const goToProduct = (id) => {
    navigate(`/products/${id}`);
    onClose();
  };

  const goToResults = () => {
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  const handleKeyDown = (e) => {
    if (!results.length) {
      if (e.key === "Enter") goToResults();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) goToProduct(results[active].id);
      else goToResults();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center pt-20 px-4"
      style={{ background: "rgba(13,13,13,0.97)" }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-muted hover:text-ivory transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Search box */}
      <div className="w-full max-w-2xl">
        <div className="relative flex items-center border-b-2 border-gold/50 focus-within:border-gold transition-colors pb-2">
          {/* Search icon */}
          <svg className="text-muted flex-shrink-0 mr-4" width="22" height="22"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for shoes, brands, styles..."
            className="flex-1 bg-transparent text-ivory text-xl placeholder-muted focus:outline-none"
          />

          {/* Loading spinner */}
          {loading && (
            <div className="w-5 h-5 border-2 border-gold/30 border-t-gold rounded-full animate-spin flex-shrink-0" />
          )}

          {/* Clear button */}
          {query && !loading && (
            <button
              onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              className="text-muted hover:text-ivory transition-colors flex-shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {query.trim() && (
          <div className="mt-4 bg-carbon border border-white/10 rounded-sm overflow-hidden">
            {results.length > 0 ? (
              <>
                {results.map((product, i) => (
                  <div
                    key={product.id}
                    onClick={() => goToProduct(product.id)}
                    className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors
                      ${active === i ? "bg-gold/10 border-l-2 border-gold" : "hover:bg-white/5 border-l-2 border-transparent"}`}
                  >
                    {/* Product image */}
                    <div className="w-12 h-12 flex-shrink-0 bg-charcoal rounded-sm overflow-hidden">
                      <img
                        src={parseImages(product.images)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-muted text-xs mt-0.5">
                        {product.brand} · {product.category}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-gold text-sm font-semibold">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                      {product.mrp > product.price && (
                        <p className="text-muted text-xs line-through">
                          ₹{product.mrp.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>

                    {/* Arrow */}
                    <svg className="text-muted flex-shrink-0" width="14" height="14"
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                ))}

                {/* View all results */}
                <div
                  onClick={goToResults}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/10 text-gold text-sm cursor-pointer hover:bg-gold/5 transition-colors"
                >
                  <span>View all results for</span>
                  <span className="font-semibold">"{query}"</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </>
            ) : !loading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-muted text-sm">
                  No results found for <span className="text-ivory">"{query}"</span>
                </p>
                <p className="text-muted text-xs mt-1">
                  Try searching by brand, style, or category
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Search hints — show when no query */}
        {!query && (
          <div className="mt-8">
            <p className="text-muted text-xs tracking-widest uppercase mb-4">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {["Nike", "Adidas", "Running", "Casual", "Puma", "Formal", "Sneakers", "Kids"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setQuery(hint)}
                  className="px-4 py-2 border border-white/10 text-muted text-sm hover:border-gold/50 hover:text-gold transition-colors rounded-sm"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}