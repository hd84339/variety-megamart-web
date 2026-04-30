import API from "./api";

export const getHomeData = () => {
  return API.get("/getHomeData");
};

export const getProductDetail = (id) => {
  return API.get(`/getVariationDetail/${id}`);
};