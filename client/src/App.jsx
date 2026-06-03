import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar         from "./components/common/Navbar";
import Footer         from "./components/common/Footer";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Public
import Home          from "./pages/public/Home";
import Products      from "./pages/public/Products";
import ProductDetail from "./pages/public/ProductDetail";
import BrandPage     from "./pages/public/BrandPage";
import CategoryPage  from "./pages/public/CategoryPage";
import Login         from "./pages/public/Login";
import Signup        from "./pages/public/Signup";
import About         from "./pages/public/About";

// User
import Profile     from "./pages/user/Profile";
import Cart        from "./pages/user/Cart";
import Wishlist    from "./pages/user/Wishlist";
import Orders      from "./pages/user/Orders";
import OrderDetail from "./pages/user/OrderDetail";
import Checkout    from "./pages/user/Checkout";

// Admin
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminProducts   from "./pages/admin/AdminProducts";
import AdminAddProduct from "./pages/admin/AdminAddProduct";
import AdminEditProduct from "./pages/admin/AdminEditProduct";
import AdminOrders     from "./pages/admin/AdminOrders";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import AdminUsers      from "./pages/admin/AdminUsers";
import AdminReviews    from "./pages/admin/AdminReviews";
import NotFound        from "./pages/NotFound";

function App() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-obsidian text-ivory font-body">
      <Routes>
        {/* Admin routes — own layout, no Navbar/Footer */}
        <Route path="/admin/*" element={
          <ProtectedRoute adminOnly>
            <Routes>
              <Route index               element={<AdminDashboard />} />
              <Route path="products"     element={<AdminProducts />} />
              <Route path="products/add" element={<AdminAddProduct />} />
              <Route path="products/:id/edit" element={<AdminEditProduct />} />
              <Route path="products/new" element={<AdminAddProduct />} />
              <Route path="products/:id" element={<AdminEditProduct />} />
              <Route path="orders"       element={<AdminOrders />} />
              <Route path="orders/:id"   element={<AdminOrderDetail />} />
              <Route path="users"        element={<AdminUsers />} />
              <Route path="reviews"      element={<AdminReviews />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Public + User routes — with Navbar/Footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main>
              <Routes>
                <Route index              element={<Home />} />
                <Route path="products"    element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="brands" element={<BrandPage />} />
                <Route path="brands/:brand" element={<BrandPage />} />
                <Route path="brand/:brand"    element={<BrandPage />} />
                <Route path="category/:cat"   element={<CategoryPage />} />
                <Route path="about"       element={<About />} />
                <Route path="login"       element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="signup"      element={user ? <Navigate to="/" /> : <Signup />} />
                <Route path="profile"     element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="cart"        element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="wishlist"    element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="orders"      element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="orders/:id"  element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path="checkout"    element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
