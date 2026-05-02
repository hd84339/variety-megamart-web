import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { loginUser } from "../services/authService";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    try {
      const res = await loginUser(mobile, password);
      console.log("FULL RESPONSE:", res.data);

      const token = res.data.token || res.data.data?.token || res.data.access_token;

      if (!token) {
        alert("Authentication failed: Token not found.");
        return;
      }

      localStorage.setItem("token", token);
      // Trigger a custom event so the Navbar/Header updates immediately
      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-5 font-sans relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-50 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gray-100 blur-[120px] -z-10" />

      <div className="w-full max-w-[450px]">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E60023] text-white rounded-2xl shadow-lg shadow-red-200 mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">Welcome Back</h1>
          <p className="text-gray-500 mt-2 font-medium">Log in to manage your orders and cart</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Mobile Number Input */}
            <div>
              <label className="block text-sm font-bold mb-2 ml-1 text-gray-700">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your mobile number"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <Link to="/forgot-password" size="sm" className="text-sm font-semibold text-[#E60023] hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E60023] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all hover:bg-[#cc001f] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none mt-2"
            >
              {loading ? "Verifying..." : "Sign In"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          {/* Footer inside card */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-[#E60023] font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
          <ShieldCheck size={18} className="text-green-500" />
          Secure, encrypted login
        </div>
      </div>
    </div>
  );
};

export default Login;