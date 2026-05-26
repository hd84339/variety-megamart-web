import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ShoppingCart, MapPin, ChevronRight } from "lucide-react";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { 
      title: "My Orders", 
      description: "Track, return, or buy items again",
      icon: <ShoppingBag size={22} />, 
      path: "/orders", 
      gradient: "from-blue-500 to-indigo-600 shadow-blue-100" 
    },
    { 
      title: "Wishlist", 
      description: "View and manage your saved favorites",
      icon: <Heart size={22} />, 
      path: "/wishlist", 
      gradient: "from-[#E60023] to-[#ff4d6d] shadow-red-100" 
    },
    { 
      title: "My Cart", 
      description: "Review items and complete your checkout",
      icon: <ShoppingCart size={22} />, 
      path: "/cart", 
      gradient: "from-orange-400 to-amber-500 shadow-orange-100" 
    },
    { 
      title: "Saved Addresses", 
      description: "Manage shipping and delivery locations",
      icon: <MapPin size={22} />, 
      path: "/address", 
      gradient: "from-emerald-400 to-teal-500 shadow-emerald-100" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-5 p-6 bg-white/80 backdrop-blur-md border border-[#ECECEC] rounded-[2rem] text-left transition-all duration-300 hover:bg-white hover:border-[#E60023]/30 hover:shadow-[0_12px_30px_rgba(230,0,0,0.04)] hover:-translate-y-1 group cursor-pointer"
        >
          <div className={`p-4 rounded-2xl text-white bg-gradient-to-br shadow-md transition-transform duration-300 group-hover:scale-110 ${item.gradient}`}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-gray-900 text-base leading-snug group-hover:text-[#E60023] transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-1 truncate">
              {item.description}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-50 transition-colors flex-shrink-0">
            <ChevronRight size={16} className="text-gray-400 group-hover:text-[#E60023] transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ProfileMenu;
