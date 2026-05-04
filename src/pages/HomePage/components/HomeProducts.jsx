import React from "react";
import ProductCard from "../../../components/ProductCard";

const HomeProducts = ({ products }) => {
  return (
    <div className="max-w-[1200px] mx-auto py-16 px-5">
      <div className="mb-10">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase">Featured Products</h2>
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
