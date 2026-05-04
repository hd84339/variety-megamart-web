import React from "react";
import { User, Settings } from "lucide-react";

const ProfileHeader = () => {
  return (
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
  );
};

export default ProfileHeader;
