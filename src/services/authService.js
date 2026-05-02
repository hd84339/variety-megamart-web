import API from "./api";

// LOGIN USER
export const loginUser = (mobile, password) => {
  return API.post("/login", {
    mobile,
    password,
  });
};

// REGISTER USER
export const registerAPI = (data) => {
  return API.post("/auth/register", data);
};