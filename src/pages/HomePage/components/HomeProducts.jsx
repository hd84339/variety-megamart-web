import React from "react";
import ProductCard from "../../../components/ProductCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/mainCategory/";

const HomeProducts = ({ products, title = "Featured Products", categories = [], sidebarPosition = "right" }) => {
  const navigate = useNavigate();
  // Show all products instead of limiting to 8
  const displayProducts = products;
  // Show all subcategories in the sidebar
  const displayCats = categories;

  const gridColsClass = sidebarPosition === "left"
    ? "grid-cols-1 lg:grid-cols-[240px_1fr] xl:grid-cols-[260px_1fr]"
    : "grid-cols-1 lg:grid-cols-[1fr_240px] xl:grid-cols-[1fr_260px]";

  return (
    <div className="w-[96%] mx-auto py-16">
      <div className="mb-6">
        <h6 className="text-xl font-bold text-gray-900 tracking-wide uppercase">{title}</h6>
      </div>

      <div className={`grid ${gridColsClass} gap-6`}>
        {/* Product Grid (Takes up remaining space automatically) */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${sidebarPosition === "left" ? "lg:order-2" : "lg:order-1"}`}>
          {displayProducts.map((item, i) => (
            <ProductCard key={i} product={item} />
          ))}
        </div>

        {/* Category Sidebar (Matches exact height of side without expanding it) */}
        {categories && categories.length > 0 && (
          <div className={`hidden lg:block relative ${sidebarPosition === "left" ? "lg:order-1" : "lg:order-2"}`}>
            <div className="absolute inset-0 flex flex-col bg-white rounded-2xl border border-[#ECECEC] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <h3 className="font-bold text-gray-900 mb-5 uppercase tracking-wide border-b border-gray-100 pb-3 flex-shrink-0">
                Categories
              </h3>
              
              <ul className="space-y-4 flex-1 mt-2 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {displayCats.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => navigate(`/subcategory/${cat.id}`)}
                      className="w-full flex items-center gap-3 group text-left p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 border border-gray-100 shadow-sm">
                        <img 
                          src={`${IMAGE_BASE}${cat.image}`} 
                          alt={cat.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-800 line-clamp-2 uppercase group-hover:text-[#E60023] transition-colors leading-snug">
                          {cat.name}
                        </span>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#E60023] transition-colors flex-shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => navigate('/categories')} 
                className="w-full mt-6 py-3 bg-gray-50 text-gray-800 font-bold text-sm uppercase rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 flex-shrink-0"
              >
                View More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
