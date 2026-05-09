import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { searchProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import ProductCard from "../../components/ProductCard";
import { Search as SearchIcon, ArrowLeft, SlidersHorizontal, Package, LayoutGrid } from "lucide-react";
import FilterSidebar from "../SubCategoryPage/components/FilterSidebar";
import SubCategoryHeader from "../SubCategoryPage/components/SubCategoryHeader";
import ProductGrid from "../SubCategoryPage/components/ProductGrid";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [matchingCategories, setMatchingCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(10000);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract query from URL
  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch products directly with the full query
        let res = await searchProducts(query);
        let directData = res.data.data || res.data.products || res.data || [];
        
        let allResultsMap = new Map();
        if (Array.isArray(directData)) {
            directData.forEach(p => {
                if(p && p.id) allResultsMap.set(p.id, p);
            });
        }
        
        // Fallback/Extensive: Search by individual words and merge results
        const words = query.split(" ").map(w => w.trim()).filter(w => w.length > 1);
        if (words.length > 0) {
            const wordPromises = words.map(word => searchProducts(word).catch(() => null));
            const wordResponses = await Promise.all(wordPromises);
            
            wordResponses.forEach(wRes => {
                if(wRes && wRes.data) {
                    let wData = wRes.data.data || wRes.data.products || wRes.data || [];
                    if(Array.isArray(wData)) {
                        wData.forEach(p => {
                            if(p && p.id && !allResultsMap.has(p.id)) {
                                allResultsMap.set(p.id, p);
                            }
                        });
                    }
                }
            });
        }

        let combinedData = Array.from(allResultsMap.values());
        
        // Relevance sorting: rank by how many search words appear in the product title
        combinedData.sort((a, b) => {
            const titleA = (a.title || a.name || "").toLowerCase();
            const titleB = (b.title || b.name || "").toLowerCase();
            const scoreA = words.reduce((acc, word) => acc + (titleA.includes(word.toLowerCase()) ? 1 : 0), 0);
            const scoreB = words.reduce((acc, word) => acc + (titleB.includes(word.toLowerCase()) ? 1 : 0), 0);
            return scoreB - scoreA;
        });

        setProducts(combinedData);

        // Fetch and filter categories as fallback or additional info
        const catRes = await getCategories();
        const allCats = catRes.data.data || catRes.data || [];
        const filteredCats = allCats.filter(cat => 
          cat.name.toLowerCase().includes(query.toLowerCase())
        );
        setMatchingCategories(filteredCats);

      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    result = result.filter(p => (p.active_price?.price || p.price || 0) <= priceRange);
    if (sortBy === "priceLow") {
        result.sort((a, b) => (a.active_price?.price || a.price || 0) - (b.active_price?.price || b.price || 0));
    } else if (sortBy === "priceHigh") {
        result.sort((a, b) => (b.active_price?.price || b.price || 0) - (a.active_price?.price || a.price || 0));
    }
    return result;
  }, [products, sortBy, priceRange]);

  return (
    <div className="bg-[#fcfcfc] min-h-screen relative overflow-x-hidden font-sans">
      <FilterSidebar 
        showFilters={showFilters} 
        setShowFilters={setShowFilters} 
        sortBy={sortBy} 
        setSortBy={setSortBy} 
        priceRange={priceRange} 
        setPriceRange={setPriceRange} 
      />

      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#FFF5F6] to-transparent pointer-events-none -z-10" />

      <div className="max-w-[1200px] mx-auto py-12 px-5">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <button 
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-gray-100 bg-gray-50/50 cursor-pointer text-gray-600 hover:text-[#E60023]"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
                Search Results
              </h1>
              <p className="text-gray-500 font-bold mt-1">
                {loading ? "Searching..." : `Results for "${query}"`}
              </p>
            </div>
          </div>

          {!loading && products.length > 0 && (
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-3 px-6 py-3.5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-gray-700 active:scale-95 border-none cursor-pointer"
               >
                 <SlidersHorizontal size={18} className="text-[#E60023]" />
                 <span>Filters</span>
               </button>
               <div className="hidden md:flex items-center gap-3 px-6 py-3.5 bg-gray-900 text-white rounded-2xl shadow-lg font-bold">
                 <Package size={18} />
                 <span>{filteredProducts.length} Products</span>
               </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-5">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#E60023] rounded-full animate-spin" />
            <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-xs">Scouring MegaMart...</p>
          </div>
        ) : error ? (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <SearchIcon size={32} className="text-[#E60023]" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Search Interrupted</h3>
            <p className="text-gray-500 max-w-md mx-auto">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="space-y-12">
            {/* Empty State */}
            <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <SearchIcon size={40} className="text-gray-300" />
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-3">No direct matches</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                We couldn't find any products named "{query}". Try checking your spelling or using different keywords like "Kitchen" or "Tools".
              </p>
              <button 
                onClick={() => navigate("/")}
                className="px-10 py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#E60023] transition-all hover:shadow-2xl hover:shadow-red-200 active:scale-95 border-none cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            {/* Category Fallback */}
            {matchingCategories.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="flex items-center gap-3 mb-8 px-2">
                  <LayoutGrid size={24} className="text-[#E60023]" />
                  <h3 className="text-2xl font-black text-gray-900">Matching Collections</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
                   {matchingCategories.map(cat => (
                     <div 
                      key={cat.id}
                      onClick={() => navigate(`/category/${cat.id}`)}
                      className="group cursor-pointer bg-white p-6 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl hover:shadow-red-50 transition-all hover:-translate-y-2 text-center"
                     >
                       <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-5 bg-gray-50">
                         <img 
                          src={cat.image ? `https://project.varietymegastore.com/uploads/mainCategory/${cat.image}` : "https://via.placeholder.com/150"} 
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                         />
                       </div>
                       <h4 className="font-black text-gray-800 group-hover:text-[#E60023] transition-colors">{cat.name}</h4>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            <ProductGrid 
              products={filteredProducts} 
              setPriceRange={setPriceRange} 
              setSortBy={setSortBy} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
