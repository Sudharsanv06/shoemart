import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authAPI } from "../../api";
import { setCredentials } from "../../store/authSlice";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthColor = strength === 0 ? "bg-gray-400" : strength === 1 ? "bg-red-500" : strength === 2 ? "bg-yellow-500" : strength === 3 ? "bg-blue-500" : "bg-green-500";
  const strengthText = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.signup({ name: formData.name, email: formData.email, password: formData.password });
      dispatch(setCredentials(res.data.data));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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
          Join the ShoeMart community and discover premium footwear curated for you.
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-12">
        <div className="max-w-md">
          <h2 className="font-display text-3xl text-ivory mb-2">Create Account</h2>
          <p className="text-ivory/60 mb-8">Join us today</p>

          {error && <div className="mb-6 p-3 bg-red-500/20 border border-red-500 text-red-200">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-ivory mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-charcoal border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                placeholder="John Doe"
              />
            </div>

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
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="w-full h-1 bg-gray-700 overflow-hidden">
                    <div className={`h-full ${strengthColor} transition-all`} style={{ width: `${(strength / 4) * 100}%` }} />
                  </div>
                  <p className={`text-xs ${strength <= 1 ? "text-red-400" : strength === 2 ? "text-yellow-400" : strength === 3 ? "text-blue-400" : "text-green-400"}`}>
                    Strength: {strengthText}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ivory mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-charcoal border border-white/20 text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/50 hover:text-ivory transition-colors"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gold text-obsidian font-semibold hover:bg-ivory transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-ivory/60 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-gold hover:text-ivory transition-colors font-semibold">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
