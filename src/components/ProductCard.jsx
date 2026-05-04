import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import { addToCartAPI } from "../services/cartService";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const title = product.title || 
                product.product?.title || 
                product.name || 
                product.product?.name || 
                "Product";

  const rawImage = product.latest_image?.image || product.image || product.product?.image || product.product?.latest_image?.image;
  const imageUrl = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
    : PLACEHOLDER_IMAGE;

  const price = product.active_price?.price || product.price || 0;
  const mrp = product.active_price?.mrp || product.mrp || 0;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const variationId = product.id;
    const productId = product.product_id ?? product.product?.id ?? product.id;

    try {
      await addToCartAPI(productId, variationId, 1);
      alert(`${title} added to cart.`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login first");
        navigate("/login");
      } else {
        alert("Failed to add to cart.");
      }
    }
  };

  return (
    <div 
      className="group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer flex flex-col h-full border border-gray-100/50"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Showcase */}
      <div className="relative aspect-square overflow-hidden bg-[#F9F9F9]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        
        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl border-none cursor-pointer transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 hover:bg-[#E60023] hover:text-white">
                <Eye size={18} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-900 shadow-xl border-none cursor-pointer transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75 hover:bg-[#E60023] hover:text-white">
                <Heart size={18} />
            </button>
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-[#E60023] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-red-200 uppercase tracking-widest">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="mb-2">
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 mt-1 leading-snug min-h-[48px] group-hover:text-[#E60023] transition-colors">
            {title}
            </h3>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-black text-[#111]">₹{price}</span>
            {mrp > price && (
              <span className="text-[10px] text-gray-400 line-through font-bold">₹{mrp}</span>
            )}
          </div>

          <button 
            className="w-12 h-12 bg-[#111] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200 transition-all hover:bg-[#E60023] hover:shadow-red-200 active:scale-90 border-none cursor-pointer"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;