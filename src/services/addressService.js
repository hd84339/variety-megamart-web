import API from "./api";

export const addAddressAPI = (data) => {
  return API.post("/auth/addUserSavedAddress", data);
};

export const getAddressAPI = () => {
  return API.get("/auth/getUserSavedAddress");
};

export const deleteAddressAPI = (id) => {
  return API.post("/auth/deleteUserSavedAddress", { id, address_id: id });
};

export const editAddressAPI = (data) => {
  return API.post("/auth/editUserSavedAddress", data);
};


