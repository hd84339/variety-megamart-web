import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, ShoppingCart, MapPin, ChevronRight } from "lucide-react";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "My Orders", icon: <ShoppingBag size={24} />, path: "/orders", color: "bg-blue-50 text-blue-600" },
    { title: "Wishlist", icon: <Heart size={24} />, path: "/wishlist", color: "bg-pink-50 text-pink-600" },
    { title: "My Cart", icon: <ShoppingCart size={24} />, path: "/cart", color: "bg-orange-50 text-orange-600" },
    { title: "Saved Addresses", icon: <MapPin size={24} />, path: "/address", color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className="flex items-center gap-5 p-6 bg-white border border-gray-100 rounded-[2rem] text-left transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 group cursor-pointer"
        >
          <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${item.color}`}>
            {item.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">View Details</p>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-[#E60023] transition-colors" />
        </button>
      ))}
    </div>
  );
};

export default ProfileMenu;
