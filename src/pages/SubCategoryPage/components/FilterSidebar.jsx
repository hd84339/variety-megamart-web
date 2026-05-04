import React from "react";
import { X, Check } from "lucide-react";

const FilterSidebar = ({ showFilters, setShowFilters, sortBy, setSortBy, priceRange, setPriceRange }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${showFilters ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowFilters(false)}
      />
      
      <div className={`fixed top-0 right-0 h-full w-[350px] bg-white z-[101] shadow-2xl transition-transform duration-500 ease-in-out p-8 ${showFilters ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-gray-900">Filters</h3>
            <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent cursor-pointer">
                <X size={24} />
            </button>
        </div>

        <div className="space-y-10">
            {/* Sorting Section */}
            <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-5">Sort By</h4>
                <div className="flex flex-col gap-3">
                    {[
                        { id: "newest", label: "Newest Arrivals" },
                        { id: "priceLow", label: "Price: Low to High" },
                        { id: "priceHigh", label: "Price: High to Low" },
                    ].map(opt => (
                        <button 
                            key={opt.id}
                            onClick={() => setSortBy(opt.id)}
                            className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all border-none text-left cursor-pointer ${sortBy === opt.id ? "bg-[#E60023] text-white shadow-lg shadow-red-200" : "bg-gray-50 text-gray-600 hover:bg-gray-100"}`}
                        >
                            {opt.label}
                            {sortBy === opt.id && <Check size={18} />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div>
                <div className="flex justify-between items-center mb-5">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Range</h4>
                    <span className="text-[#E60023] font-black">Up to ₹{priceRange}</span>
                </div>
                <input 
                    type="range" 
                    min="100" 
                    max="10000" 
                    step="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-[#E60023] cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                    <span>₹100</span>
                    <span>₹10,000+</span>
                </div>
            </div>
        </div>

        <button 
            onClick={() => setShowFilters(false)}
            className="absolute bottom-10 left-8 right-8 bg-black text-white py-5 rounded-2xl font-bold shadow-xl active:scale-95 transition-all border-none cursor-pointer"
        >
            Apply Filters
        </button>
      </div>
    </>
  );
};

export default FilterSidebar;
