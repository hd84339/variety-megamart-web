import React from "react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/mainCategory/";

const HomeCategories = ({ categories }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-5">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Shop by Category</h2>
          <p className="text-gray-500 font-medium mt-1">Explore our wide range of premium collections</p>
        </div>
        <button className="hidden md:block text-[#E60023] font-bold hover:underline">View All</button>
      </div>

      <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group cursor-pointer flex flex-col items-center flex-shrink-0 w-24 md:w-32 lg:w-40 snap-start"
            onClick={() => navigate(`/category/${cat.id}`)}
          >
            <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-[1.5rem] bg-white shadow-md shadow-gray-200/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-red-100 group-hover:-translate-y-1 border border-gray-100">
              <img
                src={`${IMAGE_BASE}${cat.image}`}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <p className="text-xs md:text-sm font-bold text-gray-800 text-center transition-colors group-hover:text-[#E60023] line-clamp-2">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCategories;
