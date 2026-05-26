import React, { useEffect, useState } from "react";
import { getHomeData } from "../../services/productService";
import { getSubCategories } from "../../services/categoryService";
import HomeHero from "./components/HomeHero";
import HomeCategories from "./components/HomeCategories";
import HomeProducts from "./components/HomeProducts";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sidebarCategories, setSidebarCategories] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD HOME DATA
  const fetchData = async () => {
    try {
      const res = await getHomeData();

      const productsData =
        res.data.data?.products || res.data.products || [];

      const sliderData =
        res.data.data?.slider ||
        res.data.slider ||
        res.data.banners ||
        [];

      const categoriesData =
        res.data.data?.categories || res.data.categories || [];

      const bestSellersData =
        res.data.data?.best_seller_product || res.data.best_seller_product || [];

      setProducts(productsData);
      setBanners(sliderData);
      setCategories(categoriesData);
      setBestSellers(bestSellersData);

      // Fetch ALL subcategories for the right sidebar by mapping through all main categories
      try {
        const subCatPromises = categoriesData.map(cat => getSubCategories(cat.id));
        const subCatResults = await Promise.all(subCatPromises);
        
        let allSubCats = [];
        subCatResults.forEach(res => {
          if (res.data && res.data.data) {
            allSubCats = [...allSubCats, ...res.data.data];
          } else if (res.data && Array.isArray(res.data)) {
            allSubCats = [...allSubCats, ...res.data];
          }
        });
        
        setSidebarCategories(allSubCats);
      } catch (err) {
        console.log("Subcategory fetch error:", err);
      }

    } catch (err) {
      console.log("Home error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-xl font-bold text-gray-400">
          Loading MegaMart...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F5F7] min-h-screen font-sans overflow-x-hidden relative">
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#FFF5F6] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] -right-20 w-[500px] h-[500px] bg-red-50/50 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[60%] -left-20 w-[400px] h-[400px] bg-blue-50/30 blur-[100px] rounded-full pointer-events-none -z-10" />
      {/* 1. Hero Banner */}
      <HomeHero banners={banners} />
      
      {/* 2. Shop By Category */}
      <HomeCategories categories={categories} />
      {/* 3. Featured / Trending Products */}
      <HomeProducts products={products} title="Featured / Trending Products" categories={sidebarCategories} />
      
      {/* 6. Best Sellers */}
      {bestSellers.length > 0 && (
        <HomeProducts products={bestSellers} title="Best Sellers" categories={sidebarCategories} sidebarPosition="left" />
      )}
    </div>
  );
};

export default Home;
