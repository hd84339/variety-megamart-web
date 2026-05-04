import API from "./api";

// CREATE ORDER
export const createOrderAPI = (data) => {
  return API.post("/auth/createUserOrder", data);
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