import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getWishlistAPI, deleteWishlistAPI } from "../../services/wishlistService";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";

const IMAGE_BASE = "https://project.varietymegastore.com/uploads/variations/";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await getWishlistAPI();
      console.log("🔍 WISHLIST RESPONSE:", res.data);

      let items = [];
      const d = res.data;
      
      if (Array.isArray(d)) {
        items = d;
      } else if (d?.data && Array.isArray(d.data)) {
        items = d.data;
      } else if (d?.wishlist && Array.isArray(d.wishlist)) {
        items = d.wishlist;
      } else if (d?.data?.wishlist && Array.isArray(d.data.wishlist)) {
        items = d.data.wishlist;
      } else if (d?.data?.data && Array.isArray(d.data.data)) {
        items = d.data.data;
      } else if (d?.wishlist?.items && Array.isArray(d.wishlist.items)) {
        items = d.wishlist.items;
      } else if (d?.data?.items && Array.isArray(d.data.items)) {
        items = d.data.items;
      } else if (d?.products && Array.isArray(d.products)) {
        items = d.products;
      } else if (d?.items && Array.isArray(d.items)) {
        items = d.items;
      }

      setWishlist(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("❌ Wishlist page fetch error:", err);
      setWishlist([]); 
      if (err.response?.status >= 500) {
        setErrorMsg("Your wishlist cannot be loaded due to a server error. A corrupted item in your account's database is causing the backend to crash.");
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteWishlistAPI(id);
      setWishlist(prev => prev.filter(item => item.product_id !== id && item.id !== id));
      window.dispatchEvent(new Event("wishlistUpdated"));
    } catch (err) {
      console.log("Remove wishlist error:", err);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-xl font-bold text-gray-400">Loading Watchlist...</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <Heart size={40} className="text-[#E60023] opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Server Error</h2>
        <p className="text-red-600 max-w-md text-center font-bold bg-red-50 p-4 rounded-xl border border-red-100">{errorMsg}</p>
        <p className="text-gray-500 max-w-md text-center">To fix this, please open the Mobile App and remove ALL items from your wishlist. This will delete the corrupted entry from the database.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-[#111] text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
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
          const productId = item.product_id || item.product?.id || item.variation?.product_id || item.id;

          const title = item.title ||
            item.name ||
            item.product?.title ||
            item.product?.name ||
            item.variation?.title ||
            item.variation?.product?.title ||
            "Product";

          const image =
            item.image ||
            item.latest_image?.image ||
            item.product?.image ||
            item.product?.latest_image?.image ||
            item.variation?.image ||
            item.variation?.latest_image?.image ||
            "https://via.placeholder.com/150";

          const price =
            item.price ||
            item.active_price?.price ||
            item.product?.price ||
            item.product?.active_price?.price ||
            item.variation?.price ||
            item.variation?.active_price?.price ||
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
                  src={typeof image === 'string' && image.startsWith("http") ? image : IMAGE_BASE + (typeof image === 'string' ? image : '')}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug min-h-[40px] group-hover:text-[#E60023] transition-colors">
                  {title}
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
