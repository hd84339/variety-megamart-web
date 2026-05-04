import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail } from "../../services/productService";
import { addToCartAPI } from "../../services/cartService";
import ImageShowcase from "./components/ImageShowcase";
import ProductInfo from "./components/ProductInfo";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductDetail(id);
        setProduct(res.data.data || res.data);
      } catch (error) {
        console.log("Fetch product detail failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const title = product.title || product.product?.title || "Product";
      await addToCartAPI(product.product_id, product.id, quantity);
      alert(`${title} added to cart.`);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.log("Add to cart failed:", error);
      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
      } else {
        alert("Failed to add to cart. Please try again.");
      }
    }
  };

  if (loading) return (
    <div className="max-w-[1200px] mx-auto p-10 text-center animate-pulse text-gray-500 font-sans">
      Loading product details...
    </div>
  );

  if (!product) return (
    <div className="max-w-[1200px] mx-auto p-10 text-center text-gray-500 font-sans">
      Product not found.
    </div>
  );

  const title = product.title || product.product?.title || product.name || "Product";

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        <ImageShowcase product={product} title={title} />
        <ProductInfo 
          product={product} 
          title={title} 
          quantity={quantity} 
          setQuantity={setQuantity} 
          handleAddToCart={handleAddToCart} 
        />
      </div>
    </div>
  );
};

export default ProductDetail;
