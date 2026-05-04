import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, ShieldCheck } from "lucide-react";

const ProfileDangerZone = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
      <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 ml-2">Account Management</h2>
      
      <div className="space-y-3">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-4 p-5 bg-gray-50 text-gray-700 rounded-2xl font-bold transition-all hover:bg-gray-100 border-none cursor-pointer"
        >
          <div className="p-2 bg-white rounded-xl shadow-sm text-gray-500">
            <LogOut size={20} />
          </div>
          Log Out
        </button>

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
  );
};

export default ProfileDangerZone;
