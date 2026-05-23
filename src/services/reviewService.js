import api from "./api";

const REVIEW_POST_ROUTE_CANDIDATES = [
    "/reviews/add",
    "/addReview",
    "/auth/addReview",
    "/auth/reviews/add",
];

// Get reviews by product Id and variation Id
export const getReviews = async (productId, variationId) => {
    try {
        const response = await api.get(`/review?product_id=${productId}&variation_id=${variationId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error;
    }
};

// Add new review 
export const addReview = async (reviewData) => {
    try {
        const response = await api.post("/auth/review", reviewData);
        return response.data;
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};