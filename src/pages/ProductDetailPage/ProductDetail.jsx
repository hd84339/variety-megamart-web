import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductDetail } from "../../services/productService";
import { addToCartAPI } from "../../services/cartService";
import ImageShowcase from "./components/ImageShowcase";
import ProductInfo from "./components/ProductInfo";
import { getReviews } from "../../services/reviewService";
import AddReview from "./components/AddReview";
import StarRating from "./components/StarRating";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const navigate = useNavigate();

  // Fetch product data
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

  const fetchReviews = useCallback(async () => {
    if (!product?.product_id) return;
    try {
      setLoadingReviews(true);
      const data = await getReviews(product.product_id, product.id);
      setReviews(data?.data || []);
    } catch (error) {
      console.error("failed to fetch reviews", error);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [product?.product_id, product?.id]);

  // Fetch reviews when product is loaded
  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [fetchReviews, product]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const title = product.title || product.product?.title || "Product";
      await addToCartAPI(product.product_id, product.id, quantity);
      toast.success(`${title} added to cart.`);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.log("Add to cart failed:", error);
      if (error.response?.status === 401) {
        toast.error("Please login first");
        navigate("/login");
      } else {
        toast.error("Failed to add to cart. Please try again.");
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
        
        <div className="flex flex-col gap-6">
          <ProductInfo 
            product={product} 
            title={title} 
            quantity={quantity} 
            setQuantity={setQuantity} 
            handleAddToCart={handleAddToCart} 
          />
          
          {/* Add Review Section */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
            <AddReview productId={product.product_id} variationId={product.id} onReviewAdded={fetchReviews} />
            
            {/* Render reviews list */}
            <div className="mt-6 space-y-4">
              {loadingReviews ? (
                <p className="text-gray-400">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-400">No reviews yet. Be the first!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id || review._id} className="border-b pb-4">
                    <StarRating rating={review.rating} />
                    {review.title && <h4 className="font-semibold text-gray-800 mt-2">{review.title}</h4>}
                    <p className="text-gray-600 mt-1">{review.review || review.comment || review.text}</p>
                    <p className="text-xs text-gray-400 mt-1">— {review.username || review.user?.name || "Anonymous"}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
