import API from "./api";

// LOGIN USER
export const loginUser = (mobile, password) => {
  const formData = new FormData();
  formData.append("mobile", mobile);
  formData.append("password", password);
  return API.post("/login", formData);
};

// REGISTER USER
export const registerAPI = (data) => {
  const formData = new FormData();
  formData.append("name", data.username);
  formData.append("email", data.email);
  formData.append("mobile", data.mobile);
  formData.append("password", data.password);
  // Add other fields if needed, like confirm_password or otp
  if (data.confirm_password) formData.append("password_confirmation", data.confirm_password);
  
  return API.post("/register", formData);
};