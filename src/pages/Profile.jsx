import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  MapPin, 
  LogOut, 
  Trash2, 
  User, 
  ChevronRight,
  Settings,
  ShieldCheck
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    // Trigger storage event so navbar updates
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const menuItems = [
    { title: "My Orders", icon: <ShoppingBag size={24} />, path: "/orders", color: "bg-blue-50 text-blue-600" },
    { title: "Wishlist", icon: <Heart size={24} />, path: "/wishlist", color: "bg-pink-50 text-pink-600" },
    { title: "My Cart", icon: <ShoppingCart size={24} />, path: "/cart", color: "bg-orange-50 text-orange-600" },
    { title: "Saved Addresses", icon: <MapPin size={24} />, path: "/address", color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className="max-w-[1000px] mx-auto py-12 px-5 font-sans min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="w-24 h-24 bg-gradient-to-tr from-[#E60023] to-[#ff4d6d] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-100">
          <User size={48} />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black text-[#1a1a1a]">My Account</h1>
          <p className="text-gray-500 font-medium">Manage your preferences and track your orders</p>
        </div>
        <div className="flex gap-2">
           <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors border-none cursor-pointer">
             <Settings size={20} />
           </button>
        </div>
      </div>

      {/* Navigation Grid */}
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

      {/* Danger Zone */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Account Management</h2>
        
        <div className="space-y-3">
          {/* Logout Button */}
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 p-5 bg-gray-50 text-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-100 border-none cursor-pointer"
          >
            <div className="p-2 bg-white rounded-xl shadow-sm text-gray-500">
              <LogOut size={20} />
            </div>
            Log Out
          </button>

          {/* Delete Account Button */}
          <button 
            className="w-full flex items-center gap-4 p-5 bg-red-50 text-red-600 rounded-2xl font-bold transition-all hover:bg-red-100 border-none cursor-pointer"
            onClick={() => { if(window.confirm("Are you sure? This cannot be undone.")) { /* delete logic */ } }}
          >
            <div className="p-2 bg-white rounded-xl shadow-sm text-red-500">
              <Trash2 size={20} />
            </div>
            Delete Account
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          <ShieldCheck size={14} className="text-green-500" />
          Privacy & Data Protection Guaranteed
        </div>
      </div>
    </div>
  );
};

export default Profile;