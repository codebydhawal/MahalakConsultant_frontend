// src/config/api.ts

// export const API_BASE_URL = "http://localhost:8080";
export const API_BASE_URL =
    "https://mahalak-consultant-backend.onrender.com";

export const API_ENDPOINTS = {
    AUTH: `${API_BASE_URL}/rest/auth`,
    BLOG: `${API_BASE_URL}/rest/blog`,
    COMMERCE: `${API_BASE_URL}/rest/commerce`,
    CART: `${API_BASE_URL}/rest/cart`,
    PRODUCT: `${API_BASE_URL}/rest/product`,
    PROJECT: `${API_BASE_URL}/rest/project`,
    ADDRESS:`${API_BASE_URL}/rest/address`,
    MEDIA: `${API_BASE_URL}/rest/media`,
    ORDER: `${API_BASE_URL}/rest/order`,
    PAYMENT: `${API_BASE_URL}/rest/payment`,
    TEAM: `${API_BASE_URL}/rest/team`,
    PRICING_RULES: {
        "tax-rule": `${API_BASE_URL}/rest/pricing-rules/tax`,
        "discount-rule": `${API_BASE_URL}/rest/pricing-rules/discount`,
        "shipping-rule": `${API_BASE_URL}/rest/pricing-rules/shipping`,
    },
    // Add other endpoints as needed
};