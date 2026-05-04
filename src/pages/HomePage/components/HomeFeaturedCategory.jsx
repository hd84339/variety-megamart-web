import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubCategories } from "../../../services/categoryService";
import { ChevronRight } from "lucide-react";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/mainCategory/";

const HomeFeaturedCategory = ({ categoryId, title, subtitle }) => {
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSubCategories(categoryId);
        setSubCats((res.data.data || res.data || []).slice(0, 6)); // Show top 6
      } catch (err) {
        console.error("Featured category error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId]);

  if (loading || subCats.length === 0) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-16 px-5 border-t border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{title}</h2>
          <p className="text-gray-500 font-medium mt-1">{subtitle}</p>
        </div>
        <button 
            onClick={() => navigate(`/category/${categoryId}`)}
            className="flex items-center gap-2 text-[#E60023] font-bold hover:underline border-none bg-transparent cursor-pointer group"
        >
            View All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth">
        {subCats.map((sub) => (
          <div
            key={sub.id}
            className="min-w-[180px] md:min-w-[200px] snap-start group cursor-pointer flex flex-col"
            onClick={() => navigate(`/subcategory/${sub.id}`)}
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-[2.5rem] bg-white shadow-md shadow-gray-100 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-red-50 group-hover:-translate-y-2 border border-gray-100/50">
              <img
                src={`${IMAGE_BASE}${sub.image}`}
                alt={sub.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-base font-bold text-gray-900 transition-colors group-hover:text-[#E60023] line-clamp-1 mt-1">
              {sub.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeFeaturedCategory;
