import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubCategories } from "../../../services/categoryService";
import { ChevronRight } from "lucide-react";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/mainCategory/";

const HomeFeaturedCategory = ({ categoryId, title, subtitle, theme = "light" }) => {
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSubCategories(categoryId);
        setSubCats((res.data.data || res.data || []).slice(0, 8)); // Show top 8
      } catch (err) {
        console.error("Featured category error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryId]);

  if (loading || subCats.length === 0) return null;

  // Theme-based styling
  const themes = {
    light: {
        container: "bg-transparent",
        card: "bg-white",
        text: "text-gray-900"
    },
    mixed: {
        container: "bg-[#F7F3FF]", // Soft Lavender/Mixed Art theme
        card: "bg-white",
        text: "text-[#2D1B5E]"
    },
    office: {
        container: "bg-[#F1F5F9]", // Professional Gray theme
        card: "bg-white",
        text: "text-[#0F172A]"
    },
    alternate: {
        container: "bg-[#FFF9F5]", // Warm Peach theme
        card: "bg-white",
        text: "text-gray-900"
    },
    teak: {
        container: "bg-[#FAFAF5]", // Earthy Teak theme
        card: "bg-white",
        text: "text-[#4A3728]"
    }
  };

  const currentTheme = themes[theme] || themes.light;

  return (
    <section className={`py-12 ${currentTheme.container} transition-colors duration-700`}>
      <div className="max-w-[1400px] mx-auto px-5">
        <div className="mb-8 text-center md:text-left">
            <h2 className={`text-2xl md:text-3xl font-black ${currentTheme.text} tracking-tighter uppercase opacity-90`}>
                {title}
            </h2>
            <div className="h-1 w-12 bg-[#E60023] mt-2 mx-auto md:mx-0 rounded-full" />
        </div>

        <div className={`flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar scroll-smooth ${subCats.length < 5 ? 'md:justify-center' : ''}`}>
          {subCats.map((sub) => (
            <div
              key={sub.id}
              className="min-w-[180px] md:min-w-[200px] snap-start group cursor-pointer flex flex-col items-center"
              onClick={() => navigate(`/subcategory/${sub.id}`)}
            >
              <div className={`relative w-full aspect-square mb-4 overflow-hidden rounded-[2rem] ${currentTheme.card} shadow-lg shadow-black/5 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/10 group-hover:-translate-y-2 border border-gray-100/50`}>
                <img
                  src={`${IMAGE_BASE}${sub.image}`}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-500" />
              </div>
              <p className={`text-[0.9rem] md:text-base font-black ${currentTheme.text} transition-colors group-hover:text-[#E60023] line-clamp-1 uppercase tracking-tight text-center px-2`}>
                {sub.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFeaturedCategory;
