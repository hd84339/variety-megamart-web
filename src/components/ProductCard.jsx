import toast from "react-hot-toast";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { addToCartAPI } from "../services/cartService";
import { addToWishlistAPI } from "../services/wishlistService";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const handleWishlist = async (e) => {
    e.stopPropagation();
    const productId = product.product_id ?? product.product?.id ?? product.id;

    try {
      await addToWishlistAPI(productId);
      toast.success("Added to wishlist ❤️");
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error("Failed to add to wishlist.");
      }
    }
  };

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
      await addToCartAPI(productId, variationId, qty);
      toast.success(`${title} added to cart.`);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error("Failed to add to cart.");
      }
    }
  };

  const handleDecreaseQty = (e) => {
    e.stopPropagation();
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncreaseQty = (e) => {
    e.stopPropagation();
    setQty(qty + 1);
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col border border-[#ECECEC] shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Showcase */}
      <div className="relative h-40 bg-gray-50 p-3">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-contain mix-blend-multiply"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#E60023] text-white text-xs font-bold px-2 py-1 rounded shadow-sm tracking-wide">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-md border-none cursor-pointer hover:text-[#E60023] transition-colors"
          onClick={handleWishlist}
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-1 bg-white">
        <div className="mb-1">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-1 uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] text-gray-400 font-medium uppercase mt-0.5 line-clamp-1">
            {title}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1 mb-3">
          <span className="text-xl font-bold text-[#E60023]">₹{price}</span>
          {mrp > price && (
            <span className="text-sm text-gray-500 line-through font-medium">₹{mrp}</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2">
          {/* Quantity Selector */}
          <div className="flex items-center border border-gray-200 rounded text-gray-700 h-9 w-[80px] flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button 
              className="flex-1 flex items-center justify-center hover:bg-gray-50 h-full rounded-l border-r border-gray-200"
              onClick={handleDecreaseQty}
            >
              <Minus size={14} />
            </button>
            <span className="flex-1 text-center font-medium text-sm">{qty}</span>
            <button 
              className="flex-1 flex items-center justify-center hover:bg-gray-50 h-full rounded-r border-l border-gray-200"
              onClick={handleIncreaseQty}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            className="flex-1 h-9 bg-[#E60023] text-white rounded flex items-center justify-center gap-1.5 font-medium text-xs hover:bg-red-700 transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;