import API from "./api";

export const loginUser = (mobile, password) => {
  return API.post("/login", {
    mobile: mobile,
    password: password,
  });
};