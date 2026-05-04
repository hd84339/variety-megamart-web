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
    <div className="bg-gray-50 min-h-screen font-sans">
      <HomeHero banners={banners} />
      <HomeProducts products={products} />
      
      {/* DYNAMIC FEATURED CATEGORIES (Scrollable) - Show first 4 for performance */}
      {categories
        .filter(cat => cat.id)
        .slice(0, 4)
        .map((cat) => (
          <HomeFeaturedCategory 
            key={cat.id}
            categoryId={cat.id} 
            title={cat.name} 
            subtitle={`Explore our handpicked ${cat.name} collection`} 
          />
        ))
      }

      <HomeCategories categories={categories} />
    </div>
  );
};

export default Home;
