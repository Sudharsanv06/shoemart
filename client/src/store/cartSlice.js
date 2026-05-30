import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0, count: 0 },
  reducers: {
    setCart: (state, { payload }) => {
      state.items = Array.isArray(payload) ? payload : payload?.items || [];
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
      state.total = state.items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
    },
    addToCart: (state, { payload }) => {
      const { productId, quantity } = payload;
      const existing = state.items.find((i) => i.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
    updateCartItem: (state, { payload }) => {
      const item = state.items.find((i) => i.id === payload.id);
      if (item) item.quantity = payload.quantity;
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
    removeFromCart: (state, { payload }) => {
      state.items = state.items.filter((i) => i.id !== payload);
      state.count = state.items.reduce((s, i) => s + i.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
    },
  },
});

export const { setCart, addToCart, updateCartItem, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
