import axios from "axios";
import { ApiResponse } from "../services/ApiResponse";
import { ProductRequest } from "../services/ProductRequest";
import { ProductResponse } from "../services/ProductResponse";

const BASE_URL = "http://localhost:8080/rest/product";

const getHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

const ProductService = {

    addProduct(product: ProductRequest, file: File) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(product)],
                { type: "application/json" }
            )
        );

        formData.append("file", file);

        return axios.post<ApiResponse<ProductResponse>>(
            `${BASE_URL}/add`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
    },

    getAllProducts() {
        return axios.get<ApiResponse<ProductResponse[]>>(
            `${BASE_URL}/get-all`,
            getHeaders()
        );
    },

    getProductById(productId: string) {
        return axios.get<ApiResponse<ProductResponse>>(
            `${BASE_URL}/get`,
            {
                params: { productId },
                ...getHeaders(),
            }
        );
    },

    updateProduct(
        productId: string,
        product: ProductRequest,
        file: File | null
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(product)],
                {
                    type: "application/json",
                }
            )
        );

        if (file) {
            formData.append("file", file);
        }

        return axios.patch<ApiResponse<ProductResponse>>(
            `${BASE_URL}/update`,
            formData,
            {
                params: { productId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

    },

    deleteProduct(productId: string) {
        return axios.delete<ApiResponse<ProductResponse>>(
            `${BASE_URL}/delete`,
            {
                params: { productId },
                ...getHeaders(),
            }
        );
    },
};

export default ProductService;