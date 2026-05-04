import API from "./api";

// Main Categoies
export const getCategories = () => {
    return API.get("/getMainCategories");
    console.log("CATEGORIES API RESPONSE:", res.data);
};

//Sub Categories
export const getSubCategories = (categoryId) => {
    return API.get(`/getSubCategory?categoryId=${categoryId}`);
}