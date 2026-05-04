import React from "react";
import ProductCard from "../../../components/ProductCard";
import { SlidersHorizontal } from "lucide-react";

const ProductGrid = ({ products, setPriceRange, setSortBy }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <SlidersHorizontal size={32} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">No products found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or browse other categories.</p>
        <button 
          onClick={() => {
              setPriceRange(10000);
              setSortBy("newest");
          }}
          className="mt-8 px-8 py-3 bg-[#E60023] text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-[#cc001f] transition-all border-none cursor-pointer"
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {products.map((item, index) => (
        <ProductCard key={index} product={item} />
      ))}
    </div>
  );
};

export default ProductGrid;
