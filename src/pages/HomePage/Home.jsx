import React, { useEffect, useState } from "react";
import { getHomeData } from "../../services/productService";
import HomeHero from "./components/HomeHero";
import HomeProducts from "./components/HomeProducts";
import HomeCategories from "./components/HomeCategories";
import HomeFeaturedCategory from "./components/HomeFeaturedCategory";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
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

      setProducts(productsData);
      setBanners(sliderData);
      setCategories(categoriesData);
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
    <div className="bg-[#fcfcfc] min-h-screen font-sans overflow-x-hidden relative">
      {/* Premium Background Accents */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-[#FFF5F6] to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[20%] -right-20 w-[500px] h-[500px] bg-red-50/50 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[60%] -left-20 w-[400px] h-[400px] bg-blue-50/30 blur-[100px] rounded-full pointer-events-none -z-10" />

      <HomeHero banners={banners} />
      <HomeProducts products={products} />
      
      {/* DYNAMIC FEATURED CATEGORIES (Scrollable) - Show first 4 for performance */}
      {categories
        .filter(cat => cat.id)
        .slice(0, 4)
        .map((cat, index) => {
          // Assign themes based on category name or index
          let theme = "light";
          if (cat.name.toUpperCase().includes("MIXED MEDIA")) theme = "mixed";
          else if (cat.name.toUpperCase().includes("STATIONERY")) theme = "office";
          else if (cat.name.toUpperCase().includes("TEAKWOOD")) theme = "teak";
          else if (index % 2 !== 0) theme = "alternate";

          return (
            <HomeFeaturedCategory 
              key={cat.id}
              categoryId={cat.id} 
              title={cat.name} 
              subtitle={`Explore our handpicked ${cat.name} collection`} 
              theme={theme}
            />
          );
        })
      }

      <HomeCategories categories={categories} />
    </div>
  );
};

export default Home;
