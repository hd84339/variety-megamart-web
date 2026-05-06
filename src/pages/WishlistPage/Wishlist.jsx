import React, { useEffect, useState } from "react";
import { getWishlistAPI, deleteWishlistAPI } from "../../services/wishlistService";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/variations/";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load wishlist on component mount
    loadWishlist();
    // Refresh when any wishlist update occurs elsewhere (e.g., adding from product cards)
    const refreshHandler = () => loadWishlist();
    window.addEventListener("wishlistUpdated", refreshHandler);
    return () => {
      window.removeEventListener("wishlistUpdated", refreshHandler);
    };
  }, []);

const loadWishlist = async () => {
  setLoading(true);
  try {
    const res = await getWishlistAPI();
    console.log("🔍 WISHLIST RESPONSE:", res.data);

    let items = [];
    if (Array.isArray(res.data)) {
      items = res.data;
    } else if (res.data?.data && Array.isArray(res.data.data)) {
      items = res.data.data;
    } else if (res.data?.wishlist && Array.isArray(res.data.wishlist)) {
      items = res.data.wishlist;
    } else if (res.data?.wishlist?.items && Array.isArray(res.data.wishlist.items)) {
      items = res.data.wishlist.items;
    } else if (res.data?.products && Array.isArray(res.data.products)) {
      items = res.data.products;
    } else if (res.data?.items && Array.isArray(res.data.items)) {
      items = res.data.items;
    }

    setWishlist(Array.isArray(items) ? items : []);
  } catch (err) {
    console.error("❌ Wishlist page fetch error:", err);
    setWishlist([]); 
  } finally {
    setLoading(false);
  }
};


  const handleRemove = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteWishlistAPI(id);
      setWishlist(prev => prev.filter(item => item.product_id !== id && item.id !== id));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.log("Remove wishlist error:", err);
      alert("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-xl font-bold text-gray-400">Loading Watchlist...</div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <Heart size={40} className="text-[#E60023] opacity-20" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your watchlist is empty</h2>
        <p className="text-gray-500 max-w-xs text-center">Save items you love to your watchlist and they'll show up here.</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 px-8 py-3 bg-[#111] text-white rounded-full font-bold hover:bg-[#E60023] transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto py-12 px-5">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">My Watchlist</h2>
          <p className="text-gray-500 font-medium">You have {wishlist.length} items in your list</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {wishlist.map((item) => {
          const product = item.product || item;
          const productId = product.id;

          const image =
            product.latest_image?.image ||
            product.image ||
            product?.variation?.image ||
            "https://via.placeholder.com/150";

          const price =
            product.active_price?.price ||
            product.price ||
            product?.variation?.price ||
            0;

          return (
            <div
              key={item.id}
              className="group bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 cursor-pointer flex flex-col h-full border border-gray-100/50 relative"
              onClick={() => navigate(`/product/${productId}`)}
            >
              {/* Remove Button */}
              <button 
                onClick={(e) => handleRemove(e, productId)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 shadow-sm border-none cursor-pointer transition-colors"
              >
                <Trash2 size={16} />
              </button>

              <div className="relative aspect-square overflow-hidden bg-[#F9F9F9]">
                <img
                  src={image.startsWith("http") ? image : IMAGE_BASE + image}
                  alt={product.title || product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug min-h-[40px] group-hover:text-[#E60023] transition-colors">
                  {product.title || product.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-[#111]">₹{price}</span>
                  <button 
                    className="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center transition-all hover:bg-[#111] hover:text-white active:scale-90 border-none cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${productId}`);
                    }}
                  >
                    <ShoppingCart size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
