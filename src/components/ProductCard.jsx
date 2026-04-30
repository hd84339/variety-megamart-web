import React from "react";
import { useNavigate } from "react-router-dom";
import { addToCartAPI } from "../services/cartService";

const IMAGE_BASE_URL = "https://project.varietymegastore.com/uploads/variations/";
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const imageUrl = product.latest_image?.image
    ? `${IMAGE_BASE_URL}${product.latest_image.image}`
    : product.image || PLACEHOLDER_IMAGE;

  const title =
    product.title ||
    product.product?.title ||
    product.name ||
    product.product?.name ||
    "Product";
  const price = product.active_price?.price || product.price || 0;
  const mrp = product.active_price?.mrp || product.mrp || 0;

  const variationId = product.id;
  const productId = product.product_id ?? product.product?.id ?? product.id;

  const handleAddToCart = async (event) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login before adding items to cart.");
      navigate("/login");
      return;
    }

    if (!productId) {
      console.log("Missing product_id for add to cart", product);
      alert("Unable to add this product to cart.");
      return;
    }

    try {
      const res = await addToCartAPI(productId, 1);
      console.log("AddToCart response:", res.data);
      alert(`${title} added to cart.`);
    } catch (error) {
      console.log("Add to cart failed:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert("Could not add to cart. Please try again.");
      }
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${variationId}`)}
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        borderRadius: "8px",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <img
        src={imageUrl}
        alt={title}
        width="100%"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />

      <h3>{title}</h3>
      <p>
        ₹{price}{" "}
        <span style={{ textDecoration: "line-through", color: "gray" }}>
          ₹{mrp}
        </span>
      </p>
      <button
        onClick={handleAddToCart}
        style={{
          padding: "8px 12px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;