import { useState, useEffect } from "react";

const KEY      = "shoemart_recently_viewed";
const MAX_ITEMS = 5;

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch { setRecentlyViewed([]); }
  }, []);

  const addProduct = (product) => {
    try {
      const stored  = localStorage.getItem(KEY);
      const current = stored ? JSON.parse(stored) : [];

      // Remove if already exists
      const filtered = current.filter((p) => p.id !== product.id);

      // Add to front
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);

      localStorage.setItem(KEY, JSON.stringify(updated));
      setRecentlyViewed(updated);
    } catch { console.error("Failed to save recently viewed"); }
  };

  const clearAll = () => {
    localStorage.removeItem(KEY);
    setRecentlyViewed([]);
  };

  return { recentlyViewed, addProduct, clearAll };
};