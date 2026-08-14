import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { CheckoutPreviewRequest, CheckoutPreviewResponse } from "./Commerce";
import { API_ENDPOINTS } from "../config/api";

const BASE_URL =API_ENDPOINTS.COMMERCE;
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const CommerceService = {
  previewCheckout(request: CheckoutPreviewRequest) {
    return axios.post<ApiResponse<CheckoutPreviewResponse>>(`${BASE_URL}/checkout/preview`, request, auth());
  },
};

export default CommerceService;
