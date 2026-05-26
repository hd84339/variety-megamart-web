import React, { useEffect, useState } from "react";
import { User, Settings, ShoppingBag, Heart, ShoppingCart, Award } from "lucide-react";
import { getProfile } from "../../../services/authService";
import { getOrdersAPI } from "../../../services/orderService";
import { getWishlistAPI } from "../../../services/wishlistService";
import { getCartAPI } from "../../../services/cartService";
import { useNavigate } from "react-router-dom";

const ProfileHeader = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, cart: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      setLoading(true);
      try {
        const profileRes = await getProfile();
        setUser(profileRes.data.user || profileRes.data.data || profileRes.data);

        // Fetch stats in parallel with defensive error boundaries
        const [ordersRes, wishlistRes, cartRes] = await Promise.allSettled([
          getOrdersAPI(),
          getWishlistAPI(),
          getCartAPI()
        ]);

        let ordersCount = 0;
        if (ordersRes.status === "fulfilled") {
          const ordersData = ordersRes.value.data?.data?.orders || ordersRes.value.data?.data || ordersRes.value.data?.orders || ordersRes.value.data || [];
          ordersCount = Array.isArray(ordersData) ? ordersData.length : 0;
        }

        let wishlistCount = 0;
        if (wishlistRes.status === "fulfilled") {
          const wData = wishlistRes.value.data;
          let items = [];
          if (Array.isArray(wData)) items = wData;
          else if (wData?.data && Array.isArray(wData.data)) items = wData.data;
          else if (wData?.wishlist && Array.isArray(wData.wishlist)) items = wData.wishlist;
          else if (wData?.data?.wishlist && Array.isArray(wData.data.wishlist)) items = wData.data.wishlist;
          else if (wData?.data?.data && Array.isArray(wData.data.data)) items = wData.data.data;
          wishlistCount = items.length;
        }

        let cartCount = 0;
        if (cartRes.status === "fulfilled") {
          const cData = cartRes.value.data;
          let items = [];
          if (Array.isArray(cData)) items = cData;
          else if (cData?.data && Array.isArray(cData.data)) items = cData.data;
          else if (cData?.cart && Array.isArray(cData.cart)) items = cData.cart;
          else if (cData?.data?.cart_items && Array.isArray(cData.data.cart_items)) items = cData.data.cart_items;
          cartCount = items.length;
        }

        setStats({
          orders: ordersCount,
          wishlist: wishlistCount,
          cart: cartCount
        });

      } catch (err) {
        console.error("Failed to fetch profile/stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, []);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mb-8 bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#ECECEC] shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Decorative colored glow blob inside the card */}
      <div className="absolute -top-16 -left-16 w-32 h-32 bg-red-100/40 rounded-full blur-2xl pointer-events-none" />
      
      {/* Avatar and User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left flex-1 z-10 w-full">
        <div className="relative w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#E60023] via-[#ff4d6d] to-[#FF8008] shadow-[0_8px_25px_rgba(230,0,0,0.12)] flex items-center justify-center flex-shrink-0 animate-in fade-in zoom-in duration-500">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#E60023] font-black text-3xl select-none">
            {firstLetter || <User size={36} />}
          </div>
          {/* VIP Badge icon in corner */}
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-white p-1.5 rounded-full shadow-md border border-white">
            <Award size={14} className="fill-current" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="space-y-2">
              <div className="h-7 w-48 bg-gray-100 animate-pulse rounded-lg mx-auto sm:mx-0"></div>
              <div className="h-4 w-36 bg-gray-100 animate-pulse rounded-lg mx-auto sm:mx-0"></div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight truncate">
                  {user?.name || user?.username || "MegaMart Member"}
                </h1>
                <span className="inline-flex items-center justify-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-full text-[9px] font-black tracking-wider uppercase shadow-sm mx-auto sm:mx-0 w-fit">
                  Gold Club
                </span>
              </div>
              <p className="text-gray-500 font-medium text-sm mt-1 truncate">
                {user?.email || "Premium Member since 2026"}
              </p>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-2">
                Mobile: {user?.mobile || "Not Linked"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-3 gap-2 bg-gray-50/70 p-4 rounded-[2rem] border border-gray-100/70 w-full lg:w-auto min-w-[280px] sm:min-w-[360px] z-10">
        <button 
          onClick={() => navigate("/orders")} 
          className="flex flex-col items-center p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group cursor-pointer border-none bg-transparent"
        >
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform mb-2">
            <ShoppingBag size={18} />
          </div>
          <span className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
            {loading ? "..." : stats.orders}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Orders
          </span>
        </button>

        <button 
          onClick={() => navigate("/wishlist")} 
          className="flex flex-col items-center p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group cursor-pointer border-none bg-transparent"
        >
          <div className="p-2 bg-pink-50 text-pink-600 rounded-xl group-hover:scale-110 transition-transform mb-2">
            <Heart size={18} />
          </div>
          <span className="text-xl font-black text-gray-900 group-hover:text-pink-600 transition-colors">
            {loading ? "..." : stats.wishlist}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Wishlist
          </span>
        </button>

        <button 
          onClick={() => navigate("/cart")} 
          className="flex flex-col items-center p-3 rounded-2xl hover:bg-white hover:shadow-sm transition-all group cursor-pointer border-none bg-transparent"
        >
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform mb-2">
            <ShoppingCart size={18} />
          </div>
          <span className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
            {loading ? "..." : stats.cart}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Cart
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
