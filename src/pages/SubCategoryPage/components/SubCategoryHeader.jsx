import React from "react";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubCategoryHeader = ({ productCount, setShowFilters }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-3 bg-white hover:bg-gray-50 rounded-2xl transition-all border border-gray-100 shadow-sm cursor-pointer"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Premium Selection</h1>
          <p className="text-gray-500 font-medium">{productCount} Items found</p>
        </div>
      </div>

      <div className="flex gap-3">
         <button 
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl font-extrabold text-gray-900 hover:shadow-lg transition-all shadow-sm cursor-pointer group"
         >
            <SlidersHorizontal size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            Filter & Sort
         </button>
      </div>
    </div>
  );
};

export default SubCategoryHeader;
