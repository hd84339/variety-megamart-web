import React from "react";
import ProductCard from "../../../components/ProductCard";

const HomeProducts = ({ products }) => {
  return (
    <div className="max-w-[1200px] mx-auto py-16 px-5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Featured Products</h2>
          <p className="text-gray-500 font-medium mt-1">Handpicked premium items just for you</p>
        </div>
        <button className="hidden md:block text-[#E60023] font-bold hover:underline border-none bg-transparent cursor-pointer">View All</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {products.map((item, i) => (
          <ProductCard key={i} product={item} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
