import React, { useEffect, useState } from "react";
import { getHomeData } from "../services/productService";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getHomeData();
      console.log("HOME API RESPONSE:", res.data);

      const productsData = res.data.data?.products || res.data.products || res.data.data || [];
      const sliderData = res.data.data?.slider || 
                        res.data.slider || 
                        res.data.data?.banners || 
                        res.data.banners || 
                        [];
      
      console.log("SLIDER DATA FOUND:", sliderData);
      setProducts(productsData);
      setBanners(sliderData);
    } catch (err) {
      console.log("Fetch Home Data Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto p-10 text-center animate-pulse text-gray-500">
        Loading MegaMart...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <HeroSlider banners={banners} />
      
      <div className="max-w-[1200px] mx-auto py-10 px-5">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">
              Featured Products
            </h2>
            <p className="text-gray-500 text-sm mt-1">Showing {products.length} handpicked items for you</p>
          </div>
          <button className="text-[#E60023] font-bold text-sm hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((item, index) => (
            <ProductCard key={index} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;