import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, User, ShoppingCart, Menu } from "lucide-react";
import { getCartAPI } from "../services/cartService";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

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

    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    fetchCartCount();
    checkAuth();
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("cartUpdated", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("cartUpdated", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-[1000] bg-[#E60023] shadow-xl font-sans">
      <div className="max-w-[1400px] mx-auto px-5 h-[80px] flex justify-between items-center gap-8">
        {/* Left: Logo */}
        <div 
          className="cursor-pointer flex items-center transition-all duration-300 hover:scale-105 active:scale-95" 
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="MegaMart" className="h-[60px] md:h-[68px] object-contain drop-shadow-md" />
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-[600px] relative items-center group">
          <input 
            type="text" 
            placeholder="Search for premium products..." 
            className="w-full py-3 px-5 pl-12 rounded-xl border-none text-[1rem] bg-white/20 text-white placeholder:text-white/80 transition-all duration-300 focus:bg-white focus:text-[#111] focus:outline-none focus:ring-4 focus:ring-black/10 focus:shadow-inner"
          />
          <Search className="absolute left-4 text-white group-focus-within:text-[#E60023] transition-colors pointer-events-none" size={22} />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-5 md:gap-8">
          <button 
            className="flex flex-col items-center text-white cursor-pointer transition-all hover:opacity-100 hover:-translate-y-0.5 bg-transparent border-none p-0 opacity-90 group" 
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
          >
            <div className="relative p-1 rounded-lg group-hover:bg-white/10 transition-colors">
              <User size={26} />
            </div>
            <span className="text-[0.75rem] font-bold mt-0.5 uppercase tracking-widest hidden sm:block">
              {isLoggedIn ? "Profile" : "Login"}
            </span>
          </button>

          <button className="flex flex-col items-center text-white cursor-pointer transition-all hover:opacity-100 hover:-translate-y-0.5 bg-transparent border-none p-0 opacity-90 group" onClick={() => navigate("/cart")}>
            <div className="relative p-1 rounded-lg group-hover:bg-white/10 transition-colors">
              <ShoppingCart size={26} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-black text-white text-[0.7rem] font-black px-2 py-0.5 rounded-full border-2 border-[#E60023] min-w-[20px] text-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[0.75rem] font-bold mt-0.5 uppercase tracking-widest hidden sm:block">Cart</span>
          </button>

          {/* Mobile Menu Button */}
          <button className="sm:hidden text-white bg-transparent border-none cursor-pointer p-2 hover:bg-white/10 rounded-lg">
            <Menu size={28} />
          </button>
        </div>
      </div>
    </nav>
  );
};



export default Navbar;