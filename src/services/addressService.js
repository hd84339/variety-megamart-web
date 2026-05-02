import API from "./api";

export const addAddressAPI = (data) => {
  return API.post("/auth/addUserSavedAddress", data);
};

export const getAddressAPI = () => {
  return API.get("/auth/getUserSavedAddress");
};