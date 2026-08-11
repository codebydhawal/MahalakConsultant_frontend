import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { CheckoutPreviewRequest, CheckoutPreviewResponse } from "./Commerce";

const BASE_URL = "http://localhost:8080/rest/commerce";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const CommerceService = {
  previewCheckout(request: CheckoutPreviewRequest) {
    return axios.post<ApiResponse<CheckoutPreviewResponse>>(`${BASE_URL}/checkout/preview`, request, auth());
  },
};

export default CommerceService;
