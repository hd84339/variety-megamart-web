import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubCategories } from "../services/categoryService";
import { ArrowLeft } from "lucide-react";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/mainCategory/";

const Category = () => {
  const { id } = useParams();
  const [subCats, setSubCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubCategories();
  }, [id]);

  const loadSubCategories = async () => {
    setLoading(true);
    try {
      const res = await getSubCategories(id);
      setSubCats(res.data.data || res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Sub-Categories...</div>;

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5">
      <div className="flex items-center gap-4 mb-8">
        <button 
           onClick={() => navigate("/")}
           className="p-2 hover:bg-gray-100 rounded-full transition-colors border-none bg-transparent cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-black text-gray-900">Explore Collections</h1>
      </div>

      {subCats.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
           <p className="text-gray-400 font-medium">No sub-categories found for this collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {subCats.map((sub) => (
            <div
              key={sub.id}
              className="group cursor-pointer flex flex-col items-center"
              onClick={() => navigate(`/subcategory/${sub.id}`)}
            >
              <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-3xl bg-white shadow-lg shadow-gray-200/50 transition-all duration-500 group-hover:shadow-xl group-hover:shadow-red-100 group-hover:-translate-y-2 border border-gray-100">
                <img
                  src={`${IMAGE_BASE}${sub.image}`}
                  alt={sub.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <p className="text-sm font-bold text-gray-800 text-center transition-colors group-hover:text-[#E60023]">
                {sub.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;