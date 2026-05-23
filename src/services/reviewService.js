import api from "./api";

const REVIEW_POST_ROUTE_CANDIDATES = [
    "/reviews/add",
    "/addReview",
    "/auth/addReview",
    "/auth/reviews/add",
];

async function getVariationReviews(productId) {
    const response = await api.get(`/getVariationDetail/${productId}`);
    return response.data.data?.reviews || [];
}

async function tryPostReviewRoute(reviewData) {
    let lastError;
    for (const route of REVIEW_POST_ROUTE_CANDIDATES) {
        try {
            const response = await api.post(route, reviewData);
            return response.data;
        } catch (error) {
            lastError = error;
            if (error.response?.status !== 404) {
                throw error;
            }
        }
    }
    throw lastError;
}

// Get reviews by product Id 
export const getReviews = async (productId) => {
    try {
        return await getVariationReviews(productId);
    } catch (error) {
        console.error("Error fetching reviews from variation detail:", error);
        throw error;
    }
};

// Add new review 
export const addReview = async (reviewData) => {
    try {
        return await tryPostReviewRoute(reviewData);
    } catch (error) {
        console.error("Error adding review:", error);
        throw error;
    }
};