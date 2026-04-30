import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
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
      const res = await addToCartAPI(productId, variationId, 1);
      console.log("AddToCart response:", res.data);
      alert(`${title} added to cart.`);
      window.dispatchEvent(new Event("cartUpdated"));
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

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#E60023] text-white text-[0.65rem] font-bold px-2 py-1 rounded-md shadow-sm">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] leading-tight mb-2">
          {title}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-[#E60023]">₹{price}</span>
            {mrp > price && (
              <span className="text-[0.75rem] text-gray-400 line-through">₹{mrp}</span>
            )}
          </div>

          <button 
            className="w-full bg-[#111] text-white py-2 rounded-xl text-[0.8rem] font-bold flex items-center justify-center gap-1.5 transition-all hover:bg-[#E60023] active:scale-95 border-none cursor-pointer"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;