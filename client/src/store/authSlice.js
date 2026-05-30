import { createSlice } from "@reduxjs/toolkit";

const stored = JSON.parse(localStorage.getItem("shoemart_user") || "null");

const authSlice = createSlice({
  name: "auth",
  initialState: { user: stored, token: localStorage.getItem("shoemart_token") || null },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem("shoemart_user", JSON.stringify(payload.user));
      localStorage.setItem("shoemart_token", payload.token);
    },
    updateUser: (state, { payload }) => {
      state.user = payload;
      localStorage.setItem("shoemart_user", JSON.stringify(payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("shoemart_user");
      localStorage.removeItem("shoemart_token");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
