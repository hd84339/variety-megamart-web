import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  UserPlus, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Loader2,
  User 
} from "lucide-react";
import { registerAPI } from "../services/authService";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    mobile: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault(); // Standard form behavior
    
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await registerAPI(form);
      console.log("SIGNUP SUCCESS:", res.data);
      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-5 font-sans relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-50 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gray-100 blur-[120px] -z-10" />

      <div className="w-full max-w-[480px]">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E60023] text-white rounded-2xl shadow-lg shadow-red-200 mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">Create Account</h1>
          <p className="text-gray-500 mt-2 font-medium">Join us for a premium shopping experience</p>
        </div>

        {/* Signup Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Full Name / Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            
            {/* Mobile Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Mobile Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  name="mobile"
                  type="text"
                  required
                  placeholder="9876543210"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  onChange={handleChange}
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

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1 tracking-wider">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E60023] transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  name="confirm_password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-red-50 focus:border-[#E60023] outline-none transition-all font-medium"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E60023] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 transition-all hover:bg-[#cc001f] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 border-none mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>Create Account <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-[#E60023] font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed max-w-[300px] mx-auto">
          By creating an account, you agree to our 
          <span className="font-bold"> Terms of Service </span> 
          and <span className="font-bold"> Privacy Policy. </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;