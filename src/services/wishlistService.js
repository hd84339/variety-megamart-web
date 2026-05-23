import API from "./api";

// GET WISHLIST
export const getWishlistAPI = () => {
  return API.get("/auth/getWishlist"); 
};




// ADD TO WISHLIST
export const addToWishlistAPI = (product_id) => {
  return API.post("/auth/addToWishlist", 
    { product_id },
    { params: { product_id } }
  );
};


// REMOVE FROM WISHLIST
export const deleteWishlistAPI = (product_id) => {
  return API.delete("/auth/deleteFromWishlist", {
    data: { product_id },
    params: { product_id },
  });
};




