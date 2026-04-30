import API from "./api";

// ➕ ADD TO CART
export const addToCartAPI = (product_id, quantity = 1) => {
  return API.post("/auth/addToCart", {
    product_id,
    quantity,
  });
};

// 📦 GET CART PRODUCTS
export const getCartAPI = () => {
  return API.get("/auth/getCartProducts");
};

// ❌ REMOVE ITEM FROM CART
export const deleteCartAPI = (product_id) => {
  return API.delete("/auth/deleteFromCart", {
    data: { product_id },
  });
};