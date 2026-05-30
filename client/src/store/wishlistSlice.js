import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [] },
  reducers: {
    setWishlist: (state, { payload }) => {
      state.items = Array.isArray(payload) ? payload : payload?.items || [];
    },
    addToWishlist: (state, { payload }) => {
      const item = typeof payload === "object" ? payload : { id: payload };
      if (!state.items.some((existing) => existing.id === item.id)) {
        state.items.push(item);
      }
    },
    removeFromWishlist: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
