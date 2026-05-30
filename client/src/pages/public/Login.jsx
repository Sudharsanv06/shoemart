import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAPI } from "../../api";
import { setCredentials } from "../../store/authSlice";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(formData);
      dispatch(setCredentials(res.data.data));
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-ivory flex">
      {/* Left Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-charcoal to-obsidian flex-col justify-center items-center p-12">
        <h1 className="font-display text-5xl text-gold mb-4 tracking-[0.3em]">SHOEMART</h1>
        <p className="text-ivory/70 text-lg text-center max-w-md">
          Step into luxury. Sign in to your account and explore premium footwear.
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md">
          <h2 className="font-display text-3xl text-ivory mb-2">Sign In</h2>
          <p className="text-ivory/60 mb-8">Welcome back</p>

          {error && <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-ivory mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-charcoal border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ivory mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-charcoal border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-ivory transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#forgot" className="text-gold hover:text-ivory transition-colors text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors disabled:opacity-50 cursor-disabled"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-ivory/60 mt-6">
            Don't have an account?{" "}
            <a href="/signup" className="text-gold hover:text-ivory transition-colors font-semibold">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
