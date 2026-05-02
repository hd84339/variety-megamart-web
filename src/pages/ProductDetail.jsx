import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingCart,
  Share2,
  Heart,
  RefreshCw
} from "lucide-react";
import { getProductDetail } from "../services/productService";
import { addToCartAPI } from "../services/cartService";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

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
      const res = await addToCartAPI(product.product_id, product.id, quantity);
      console.log("AddToCart response:", res.data);
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

  // Extremely robust image detection
  const rawImage = product.image ||
    (product.images && product.images.length > 0 ? (product.images[0].image || product.images[0].file) : null) ||
    product.latest_image?.image ||
    product.product?.image ||
    product.product?.latest_image?.image ||
    product.variation?.image ||
    product.variation?.latest_image?.image;

  console.log("PRODUCT DETAIL DATA:", product);
  console.log("DETECTED IMAGE PATH:", rawImage);

  const imageUrl = rawImage
    ? (rawImage.startsWith('http') ? rawImage : `${IMAGE_BASE_URL}${rawImage}`)
    : PLACEHOLDER_IMAGE;

  const price = product.active_price?.price || product.price || 0;
  const mrp = product.active_price?.mrp || product.mrp || price;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left: Sticky Image Showcase */}
        <div className="md:sticky md:top-[100px] bg-white p-5 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <img
            src={imageUrl}
            alt={title}
            className="w-full aspect-square object-contain rounded-2xl"
          />
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-block bg-[#E60023]/10 text-[#E60023] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              Special Offer
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="flex items-center gap-1">
                ⭐ 4.5
              </span>
              <span>•</span>
              <span>120 Reviews</span>
              <span>•</span>
              <span className="text-green-600 font-medium">In Stock</span>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-black text-[#E60023]">₹{price}</span>
              {mrp > price && (
                <span className="text-lg text-gray-400 line-through">₹{mrp}</span>
              )}
            </div>
            {discount > 0 && (
              <div className="text-green-600 font-bold text-sm mb-4">
                You save ₹{mrp - price} ({discount}% OFF)
              </div>
            )}
            <p className="text-gray-500 text-sm leading-relaxed">
              Inclusive of all taxes. Free shipping on orders over ₹500.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-700">Quantity</h4>
            <div className="flex items-center gap-4 bg-white border border-gray-200 w-fit p-1 rounded-xl shadow-sm">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                <Minus size={18} />
              </button>
              <span className="text-lg font-bold min-w-[30px] text-center">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              className="flex-1 bg-[#E60023] text-white h-14 rounded-2xl font-bold text-lg transition-all hover:bg-[#cc001f] hover:-translate-y-0.5 active:scale-95 shadow-md border-none cursor-pointer flex items-center justify-center gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={22} />
              Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-6 border-t border-gray-100">
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
              <Truck size={24} className="text-blue-500 mb-2" />
              <span className="text-[0.7rem] font-bold text-gray-700 uppercase">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
              <ShieldCheck size={24} className="text-green-500 mb-2" />
              <span className="text-[0.7rem] font-bold text-gray-700 uppercase">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50">
              <RefreshCw size={24} className="text-orange-500 mb-2" />
              <span className="text-[0.7rem] font-bold text-gray-700 uppercase">Easy Returns</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-bold mb-3">Product Description</h3>
            <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-line p-5 bg-white rounded-2xl border border-gray-100">
              {product.description || product.product?.description || "No description available for this product."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;