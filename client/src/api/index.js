import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
});

// Attach token
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token || localStorage.getItem("shoemart_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      try { store.dispatch(logout()); } catch (e) {}
      try { localStorage.removeItem("shoemart_token"); } catch (e) {}
      try { window.location.href = "/login"; } catch (e) {}
    }
    return Promise.reject(err);
  }
);

// AUTH
export const authAPI = {
  signup:  (data) => api.post("/auth/signup",  data),
  login:   (data) => api.post("/auth/login",   data),
  me:      ()     => api.get("/auth/me"),
  updateProfile: (data) => api.patch("/auth/profile", data, {
    headers: data instanceof FormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" },
  }),
  getMe:   ()     => api.get("/auth/me"),
  update:  (data) => api.patch("/auth/me",     data),
};

// PRODUCTS
export const productAPI = {
  getAll:      (params) => api.get("/products",          { params }),
  getOne:      (id)     => api.get(`/products/${id}`),
  getFeatured: ()       => api.get("/products/featured"),
  getNew:      ()       => api.get("/products/new"),
  create:      (data, config = {})   => api.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
    ...config,
  }),
  update:      (id, data) => api.patch(
    `/products/${id}`,
    data,
    {
      headers: data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
      timeout: 30000,
    }
  ),
  delete:      (id)     => api.delete(`/products/${id}`),
};

// CART
export const cartAPI = {
  get:    ()             => api.get("/cart"),
  add:    (data)         => api.post("/cart",       data),
  update: (id, quantity) => api.patch(`/cart/${id}`, { quantity }),
  remove: (id)           => api.delete(`/cart/${id}`),
  clear:  ()             => api.delete("/cart/clear"),
};

// WISHLIST
export const wishlistAPI = {
  get:    ()    => api.get("/wishlist"),
  add:    (pid) => api.post("/wishlist",           { productId: pid }),
  remove: (pid) => api.delete(`/wishlist/${pid}`),
};

// ORDERS
export const orderAPI = {
  create:  (data) => api.post("/orders",           data),
  getAll:  ()     => api.get("/orders"),
  getOne:  (id)   => api.get(`/orders/${id}`),
  // admin
  adminAll:    ()           => api.get("/orders/admin/all"),
  adminUpdate: (id, status) => api.patch(`/orders/admin/${id}`, { status }),
};

// PAYMENTS
export const paymentAPI = {
  createOrder: (amount) => api.post("/payments/create-order", { amount }),
  verifyPayment: (data) => api.post("/payments/verify", data),
};

// ADMIN
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getUsers: () => api.get("/admin/users"),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
