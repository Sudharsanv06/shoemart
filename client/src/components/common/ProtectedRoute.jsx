import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((s) => s.auth);
  const location = useLocation();

  useEffect(() => {
    if (adminOnly && user && user.role !== "ADMIN") {
      toast.error("Access denied");
    }
  }, [adminOnly, user]);

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}
