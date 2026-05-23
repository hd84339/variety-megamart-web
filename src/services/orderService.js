import API from "./api";

// CREATE ORDER (legacy - may not exist on this backend)
export const createOrderAPI = (data) => {
  return API.post("/auth/createUserOrder", data);
};

// ORDER CART PRODUCTS - The correct endpoint for placing orders from cart
// Sends an array of variation_ids from the cart items
export const orderCartProductAPI = (variationIds) => {
  return API.post("/auth/orderCartProduct", {
    variation_id: variationIds,
  });
};

// GET ORDERS
export const getOrdersAPI = () => {
  return API.get("/auth/getUserOrder");
};


// GET ALL ORDERS
export const getPartnerOrders = (offset = 1, limit = 20) => {
  return API.get(`/auth/getPartnerOrder?offset=${offset}&limit=${limit}`);
};

// GET ORDER DETAIL
export const getOrderReceipt = (id, title = "") => {
  const url = title ? `/auth/orderReciept/${id}/${title}` : `/auth/orderReciept/${id}`;
  return API.get(url);
};