import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, User, ShoppingCart, Heart, Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { getCartAPI } from "../services/cartService";
import { getWishlistAPI } from "../services/wishlistService";
import { getProfile } from "../services/authService";
import { getCategories, getSubCategories } from "../services/categoryService";
import { searchProducts, getHomeData } from "../services/productService";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
  const [allCategories, setAllCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [subCategoriesMap, setSubCategoriesMap] = useState({});

  const handleCategoryClick = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }
    setExpandedCategory(categoryId);
    if (!subCategoriesMap[categoryId]) {
      try {
        const res = await getSubCategories(categoryId);
        setSubCategoriesMap(prev => ({ ...prev, [categoryId]: res.data.data || res.data || [] }));
      } catch (err) {
        console.log("Error fetching subcategories", err);
      }
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setShowSuggestions(false);
      setShowMobileMenu(false);
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
    setShowMobileMenu(false);
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
        let items = [];
        const d = res.data;
        if (Array.isArray(d)) items = d;
        else if (d?.data && Array.isArray(d.data)) items = d.data;
        else if (d?.wishlist && Array.isArray(d.wishlist)) items = d.wishlist;
        else if (d?.data?.wishlist && Array.isArray(d.data.wishlist)) items = d.data.wishlist;
        else if (d?.data?.data && Array.isArray(d.data.data)) items = d.data.data;
        else if (d?.wishlist?.items && Array.isArray(d.wishlist.items)) items = d.wishlist.items;
        else if (d?.data?.items && Array.isArray(d.data.items)) items = d.data.items;
        else if (d?.products && Array.isArray(d.products)) items = d.products;
        else if (d?.items && Array.isArray(d.items)) items = d.items;
        
        setWishlistCount(items.length);
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
        const res = await getHomeData();
        const categoriesData = res.data.data?.categories || res.data.categories || [];
        setAllCategories(categoriesData);
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
          const filteredCats = allCategories.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
          ).slice(0, 5);

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
        
        {/* Left Side: Brand Identity Logo */}
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

        {/* Desktop Search Engine (Hidden on Mobile) */}
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
              </div>
            </div>
          )}
        </div>

        {/* Right Side Actions for Desktop & Three Dots Trigger for Mobile */}
        <div className="flex items-center gap-4">
          {/* Desktop Only Actions Layout */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              className="relative flex items-center gap-2.5 p-2 rounded-2xl text-gray-700 cursor-pointer transition-all hover:bg-red-50 hover:text-[#E60023] group border-none bg-transparent" 
              onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
            >
              <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors">
                <User size={22} className="transition-transform group-hover:scale-110" />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Account</span>
                <span className="text-sm font-extrabold">{isLoggedIn ? (userName || "My Profile") : "Sign In"}</span>
              </div>
            </button>

            <button 
              className="relative flex items-center gap-2.5 p-2 rounded-2xl text-gray-700 cursor-pointer transition-all hover:bg-red-50 hover:text-[#E60023] group border-none bg-transparent" 
              onClick={() => navigate("/wishlist")}
            >
              <div className="p-2.5 rounded-xl bg-gray-50 group-hover:bg-white transition-colors relative">
                <Heart size={22} className="transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#E60023] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md">
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
                  <span className="absolute -top-1 -right-1 bg-[#E60023] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-md">
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

          {/* Three Dots Button for Mobile Screen ONLY */}
          <button 
            className="md:hidden p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-[#E60023] transition-colors border-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label={showMobileMenu ? "Close menu" : "Open menu"}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Unified Mobile Drawer Layout (Contains Everything Inside) */}
      {/* Unified Mobile Drawer Layout (Contains Everything Inside) */}
      {showMobileMenu && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Sidebar */}
          <div
            className="fixed top-0 right-0 h-screen w-[85%] max-w-[340px] bg-white z-[9999] shadow-2xl overflow-y-auto pb-24 animate-in slide-in-from-right-8 duration-300"
          >
            <div className="sticky top-0 bg-white z-20 p-5 flex justify-between items-center border-b border-gray-100 shadow-sm">
              <h2 className="text-lg font-black text-gray-800">
                Menu
              </h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-full hover:bg-red-50 hover:text-[#E60023] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 1. Mobile Inline Search Bar */}
            <div className="p-4 border-b border-gray-100 search-container">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Search our catalog..." 
                  className="w-full py-2.5 px-4 pl-10 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-900 focus:bg-white focus:border-[#E60023] focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                />
                <Search className="absolute left-3.5 text-gray-400" size={16} />
              </div>

              {/* Inline Mobile Suggestions UI */}
              {showSuggestions && (searchQuery.trim().length > 1) && (
                <div className="mt-2 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-lg">
                  <div className="max-h-[220px] overflow-y-auto p-1.5">
                    {suggestions.categories.map(cat => (
                      <div key={cat.id} className="px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2" onClick={() => handleSuggestionClick("category", cat)}>
                        <Menu size={12} className="text-gray-400" />
                        <span>{cat.name}</span>
                      </div>
                    ))}
                    {suggestions.products.map(prod => (
                      <div key={prod.id} className="px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-2" onClick={() => handleSuggestionClick("product", prod)}>
                        <img src={prod.latest_image?.image ? `https://project.varietymegastore.com/uploads/variations/${prod.latest_image.image}` : "https://via.placeholder.com/24"} className="w-6 h-6 rounded object-cover" alt="" />
                        <span className="line-clamp-1">{prod.title || prod.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Unified Quick Action Shortcuts */}
            <div className="p-4 grid grid-cols-3 gap-2 border-b border-gray-100 bg-gray-50/50">
              <button 
                className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-gray-100 text-gray-700 hover:text-[#E60023] hover:shadow-sm transition-all"
                onClick={() => { setShowMobileMenu(false); navigate(isLoggedIn ? "/profile" : "/login"); }}
              >
                <User size={20} />
                <span className="text-[10px] font-bold mt-1 max-w-full truncate">
                  {isLoggedIn ? (userName || "Account") : "Sign In"}
                </span>
              </button>

              <button 
                className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-gray-100 text-gray-700 hover:text-[#E60023] hover:shadow-sm transition-all"
                onClick={() => { setShowMobileMenu(false); navigate("/wishlist"); }}
              >
                <Heart size={20} />
                <span className="text-[10px] font-bold mt-1">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-4 bg-[#E60023] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-gray-100 text-gray-700 hover:text-[#E60023] hover:shadow-sm transition-all"
                onClick={() => { setShowMobileMenu(false); navigate("/cart"); }}
              >
                <ShoppingCart size={20} />
                <span className="text-[10px] font-bold mt-1">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-5 bg-[#E60023] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* 3. Catalog Categories Section */}
            <div className="py-2">
              <p className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Shop by Category</p>
              {allCategories.map(cat => (
                <div key={cat.id} className="border-b border-gray-50 last:border-0">
                  <div 
                    className="px-5 py-3.5 flex justify-between items-center cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setShowMobileMenu(false);
                      navigate(`/category/${cat.id}`);
                    }}
                  >
                    <span className="text-sm font-bold text-gray-700">{cat.name}
                     
                    </span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;