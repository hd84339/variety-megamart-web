import API from "./api";

// CREATE ORDER
export const createOrderAPI = (data) => {
  return API.post("/auth/createUserOrder", data);
};

// GET ORDERS
export const getOrdersAPI = () => {
  return API.get("/auth/getUserOrder");
};