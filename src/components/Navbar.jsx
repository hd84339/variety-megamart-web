import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, User, ShoppingCart, Heart, Menu } from "lucide-react";
import { getCartAPI } from "../services/cartService";
import { getWishlistAPI } from "../services/wishlistService";
import { getProfile } from "../services/authService";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await getCartAPI();
        const items = res.data.data || res.data.cart?.items || res.data.cart || res.data || [];
        setCartCount(Array.isArray(items) ? items.length : 0);
      } catch (err) {
        console.log("Navbar cart fetch error:", err);
      }
    };

    const fetchWishlistCount = async () => {
      try {
        const res = await getWishlistAPI();
        const items = res.data.data || res.data.wishlist || res.data.products || res.data || [];
        setWishlistCount(Array.isArray(items) ? items.length : 0);
      } catch (err) {
        console.error("❌ Navbar wishlist fetch error:", err.response?.data || err);


      }
    };

    const fetchUserProfile = async () => {
      try {
        const res = await getProfile();
        const user = res.data.user || res.data.data || res.data;
        setUserName(user?.name || user?.username || "Profile");
      } catch (err) {
        console.log("Navbar profile fetch error:", err);
      }
    };

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      if (!token) setUserName("");
    };

    if (isLoggedIn) {
      fetchCartCount();
      fetchWishlistCount();
      fetchUserProfile();
    }
    
    checkAuth();
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    window.addEventListener("cartUpdated", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
      window.removeEventListener("cartUpdated", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [isLoggedIn]);

  return (
    <nav className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_1px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-5 h-[96px] flex justify-between items-center gap-6 md:gap-10">
        {/* Left: Brand Identity */}
        <div 
          className="cursor-pointer flex items-center transition-all duration-500 hover:scale-105" 
          onClick={() => navigate("/")}
        >
          <img 
            src={logo} 
            alt="MegaMart" 
            className="h-[72px] md:h-[84px] object-contain" 
          />
        </div>

        {/* Center: Search Engine */}
        <div className="hidden md:flex flex-1 max-w-[500px] relative items-center group">
          <input 
            type="text" 
            placeholder="Search our catalog..." 
            className="w-full py-2.5 px-5 pl-12 rounded-full border border-gray-200 text-[0.9rem] bg-gray-50/50 text-gray-900 placeholder:text-gray-400 transition-all duration-500 focus:bg-white focus:border-[#E60023] focus:outline-none focus:ring-4 focus:ring-red-50 focus:shadow-lg"
          />
          <Search className="absolute left-4 text-gray-400 group-focus-within:text-[#E60023] transition-colors pointer-events-none" size={18} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className="relative flex items-center gap-2.5 p-2 rounded-2xl text-gray-700 cursor-pointer transition-all hover:bg-red-50 hover:text-[#E60023] group border-none bg-transparent" 
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
          >
            <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors">
              <User size={22} className="transition-transform group-hover:scale-110" />
            </div>
            <div className="hidden lg:flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Account</span>
              <span className="text-sm font-extrabold">
                {isLoggedIn ? (userName || "My Profile") : "Sign In"}
              </span>
            </div>
          </button>

          <button 
            className="relative flex items-center gap-2.5 p-2 rounded-2xl text-gray-700 cursor-pointer transition-all hover:bg-red-50 hover:text-[#E60023] group border-none bg-transparent" 
            onClick={() => navigate("/wishlist")}
          >
            <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors relative">
              <Heart size={22} className="transition-transform group-hover:scale-110" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E60023] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Watchlist</span>
              <span className="text-sm font-extrabold">Favorites</span>
            </div>
          </button>

          <button 
            className="relative flex items-center gap-2.5 p-2 rounded-2xl text-gray-700 cursor-pointer transition-all hover:bg-red-50 hover:text-[#E60023] group border-none bg-transparent" 
            onClick={() => navigate("/cart")}
          >
            <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors relative">
              <ShoppingCart size={22} className="transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E60023] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col items-start leading-none text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Your Cart</span>
              <span className="text-sm font-extrabold">Shop Now</span>
            </div>
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

