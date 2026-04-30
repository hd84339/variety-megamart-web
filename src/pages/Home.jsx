import React, { useEffect, useState } from "react";
import { getHomeData } from "../services/productService";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
const fetchData = async () => {
  try {
    const res = await getHomeData();

    console.log("FULL RESPONSE:", res.data);
    
    // Debug: Log first product to see structure
    const productsData = res.data.data?.products || res.data.products || res.data.data || [];
    if (productsData.length > 0) {
      const product = productsData[0];
      console.log("FIRST PRODUCT STRUCTURE:", product);
      console.log("IMAGE FIELD:", product.latest_image);
      console.log("PRODUCT OBJECT:", product.product);
      
      // Check if API response contains image URLs
      console.log("All image-related fields:", {
        image: product.image,
        featured_image: product.featured_image,
        latest_image: product.latest_image,
        images: product.images,
      });
    }

    setProducts(productsData);
  } catch (err) {
    console.log(err);
  }
};
const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";

  return (
    <div style={{ padding: "20px" }}>
      <h2>Products</h2>
      <p>Total Products: {products.length}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((item, index) => (
          <ProductCard key={index} product={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;