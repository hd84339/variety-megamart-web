import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, User, ShoppingCart, Heart, Menu } from "lucide-react";
import { getCartAPI } from "../services/cartService";
import { getWishlistAPI } from "../services/wishlistService";
import { getProfile } from "../services/authService";
import { getCategories } from "../services/categoryService";
import { searchProducts } from "../services/productService";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
  const [allCategories, setAllCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (type, item) => {
    if (type === "product") {
      navigate(`/product/${item.id}`);
    } else {
      navigate(`/category/${item.id}`);
    }
    setSearchQuery("");
    setShowSuggestions(false);
  };

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

    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setAllCategories(res.data.data || res.data || []);
      } catch (err) {
        console.log("Navbar categories error:", err);
      }
    };

    if (isLoggedIn) {
      fetchCartCount();
      fetchWishlistCount();
      fetchUserProfile();
    }
    
    fetchCategories();
    checkAuth();
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("wishlistUpdated", fetchWishlistCount);
    window.addEventListener("cartUpdated", checkAuth);
    window.addEventListener("storage", checkAuth);
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("wishlistUpdated", fetchWishlistCount);
      window.removeEventListener("cartUpdated", checkAuth);
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          // Filter categories
          const filteredCats = allCategories.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5);

          // Fetch products
          const res = await searchProducts(searchQuery);
          const filteredProds = (res.data.data || res.data.products || res.data || []).slice(0, 5);

          setSuggestions({ products: filteredProds, categories: filteredCats });
          setShowSuggestions(true);
        } catch (err) {
          console.log("Suggestions error:", err);
        }
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allCategories]);


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

        <div className="hidden md:flex flex-1 max-w-[500px] relative items-center group search-container">
          <input 
            type="text" 
            placeholder="Search our catalog..." 
            className="w-full py-2.5 px-5 pl-12 rounded-full border border-gray-200 text-[0.9rem] bg-gray-50/50 text-gray-900 placeholder:text-gray-400 transition-all duration-500 focus:bg-white focus:border-[#E60023] focus:outline-none focus:ring-4 focus:ring-red-50 focus:shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
          />
          <Search className="absolute left-4 text-gray-400 group-focus-within:text-[#E60023] transition-colors pointer-events-none" size={18} />

          {/* Suggestions Dropdown */}
          {showSuggestions && (searchQuery.trim().length > 1) && (
            <div className="absolute top-[110%] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="max-h-[400px] overflow-y-auto p-2">
                {suggestions.categories.length > 0 && (
                  <div className="mb-2">
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Collections</p>
                    {suggestions.categories.map(cat => (
                      <div 
                        key={cat.id}
                        className="px-4 py-2.5 hover:bg-red-50 rounded-2xl cursor-pointer flex items-center gap-3 group transition-colors"
                        onClick={() => handleSuggestionClick("category", cat)}
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white">
                          <Menu size={14} className="text-gray-400 group-hover:text-[#E60023]" />
                        </div>
                        <span className="text-sm font-bold text-gray-700 group-hover:text-[#E60023]">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.products.length > 0 && (
                  <div>
                    <p className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</p>
                    {suggestions.products.map(prod => (
                      <div 
                        key={prod.id}
                        className="px-4 py-2.5 hover:bg-red-50 rounded-2xl cursor-pointer flex items-center gap-3 group transition-colors"
                        onClick={() => handleSuggestionClick("product", prod)}
                      >
                        <img 
                          src={prod.latest_image?.image ? `https://project.varietymegastore.com/uploads/variations/${prod.latest_image.image}` : "https://via.placeholder.com/40"} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700 group-hover:text-[#E60023] line-clamp-1">{prod.title || prod.name}</span>
                          <span className="text-xs font-bold text-[#E60023]">₹{prod.active_price?.price || prod.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {suggestions.products.length === 0 && suggestions.categories.length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-sm text-gray-400 font-bold">No quick matches found</p>
                  </div>
                )}
              </div>
              <div 
                className="p-4 bg-gray-50 text-center border-t border-gray-100 cursor-pointer hover:bg-red-50 transition-colors"
                onClick={() => handleSearch({ key: "Enter" })}
              >
                <p className="text-xs font-black text-[#E60023] uppercase tracking-widest">View all results for "{searchQuery}"</p>
              </div>
            </div>
          )}
        </div>


        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Search Toggle */}
          <button 
            className="md:hidden p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-[#E60023] transition-colors border-none"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={22} />
          </button>

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

      {/* Mobile Search Bar (Expandable) */}
      <div className={`md:hidden px-5 pb-4 transition-all duration-300 overflow-hidden search-container ${showMobileSearch ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Search our catalog..." 
            className="w-full py-2.5 px-5 pl-12 rounded-2xl border border-gray-200 text-[0.9rem] bg-gray-50/50 text-gray-900 focus:bg-white focus:border-[#E60023] focus:outline-none focus:ring-4 focus:ring-red-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
          />
          <Search className="absolute left-4 text-gray-400" size={18} />
          
          {/* Mobile Suggestions Dropdown */}
          {showSuggestions && (searchQuery.trim().length > 1) && (
            <div className="absolute top-[110%] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[2000]">
               <div className="max-h-[300px] overflow-y-auto p-2">
                {suggestions.categories.map(cat => (
                  <div key={cat.id} className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-center gap-3" onClick={() => handleSuggestionClick("category", cat)}>
                    <Menu size={14} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">{cat.name}</span>
                  </div>
                ))}
                {suggestions.products.map(prod => (
                  <div key={prod.id} className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-center gap-3" onClick={() => handleSuggestionClick("product", prod)}>
                    <img src={prod.latest_image?.image ? `https://project.varietymegastore.com/uploads/variations/${prod.latest_image.image}` : "https://via.placeholder.com/30"} className="w-8 h-8 rounded-lg object-cover" alt="" />
                    <span className="text-sm font-bold text-gray-700 line-clamp-1">{prod.title || prod.name}</span>
                  </div>
                ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

