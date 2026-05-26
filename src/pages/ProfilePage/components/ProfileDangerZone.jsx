import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, ShieldCheck, ChevronRight } from "lucide-react";

const ProfileDangerZone = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#ECECEC] shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
      <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 ml-2">
        Account Management
      </h2>
      
      <div className="space-y-4">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-between p-5 bg-gray-50/60 border border-gray-100 text-gray-700 rounded-2xl font-black text-sm transition-all duration-300 hover:bg-white hover:border-gray-200 hover:shadow-sm cursor-pointer group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white text-gray-500 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
              <LogOut size={18} />
            </div>
            <span>Log Out</span>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" />
        </button>

        <button 
          className="w-full flex items-center justify-between p-5 bg-red-50/30 border border-red-100/50 text-red-600 rounded-2xl font-black text-sm transition-all duration-300 hover:bg-red-50/70 hover:border-red-200 hover:shadow-sm cursor-pointer group"
          onClick={() => { if(window.confirm("Are you sure? This cannot be undone.")) { /* delete logic */ } }}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white text-red-500 rounded-xl group-hover:scale-105 transition-transform shadow-sm">
              <Trash2 size={18} />
            </div>
            <span>Delete Account</span>
          </div>
          <ChevronRight size={16} className="text-red-300 group-hover:text-red-600 transition-colors" />
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 py-2 px-5 bg-green-50/50 border border-green-100/30 rounded-full w-fit mx-auto text-[10px] text-green-700 font-bold uppercase tracking-wider">
        <ShieldCheck size={14} className="text-green-600 flex-shrink-0" />
        <span>Privacy & Data Security Guaranteed</span>
      </div>
    </div>
  );
};

export default ProfileDangerZone;
