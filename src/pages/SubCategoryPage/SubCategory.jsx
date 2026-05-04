import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../../services/productService";
import SubCategoryHeader from "./components/SubCategoryHeader";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";

const SubCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(10000);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductsByCategory(id);
        setProducts(res.data.data || res.data || []);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [id]);

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

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center font-sans">
       <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full" />
          <p className="text-gray-400 font-bold">Discovering Products...</p>
       </div>
    </div>
  );

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

      <div className="max-w-[1200px] mx-auto py-10 px-5">
        <SubCategoryHeader 
          productCount={filteredProducts.length} 
          setShowFilters={setShowFilters} 
        />
        <ProductGrid 
          products={filteredProducts} 
          setPriceRange={setPriceRange} 
          setSortBy={setSortBy} 
        />
      </div>
    </div>
  );
};

export default SubCategory;
