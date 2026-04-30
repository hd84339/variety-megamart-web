import API from "./api";

// ➕ ADD TO CART
export const addToCartAPI = (product_id, variation_id, quantity = 1) => {
  return API.post("/auth/addToCart", {
    product_id,
    variation_id,
    quantity,
  });
};

// 📦 GET CART PRODUCTS
export const getCartAPI = () => {
  return API.get("/auth/getCartProducts");
};

// ❌ REMOVE ITEM FROM CART
export const deleteCartAPI = (data) => {
  // Trying both data (body) and params (query string) to ensure compatibility
  return API.delete("/auth/deleteFromCart", {
    data: typeof data === 'object' ? data : { variation_id: data },
    params: typeof data === 'object' ? data : { variation_id: data },
  });
};