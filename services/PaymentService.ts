import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { PaymentResponse } from "./Commerce";

const BASE_URL = "http://localhost:8080/rest/payment";
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const PaymentService = {
  submit(paymentId: string, transactionId: string, screenshot: File) {
    const body = new FormData();
    body.append("request", new Blob([JSON.stringify({ transactionId })], { type: "application/json" }));
    body.append("screenshot", screenshot);
    return axios.post<ApiResponse<PaymentResponse>>(`${BASE_URL}/submit`, body, { ...auth(), params: { paymentId } });
  },
  getPending() {
    return axios.get<ApiResponse<PaymentResponse[]>>(`${BASE_URL}/admin/pending`, auth());
  },
  verify(paymentId: string) {
    return axios.patch<ApiResponse<PaymentResponse>>(`${BASE_URL}/admin/verify`, {}, { ...auth(), params: { paymentId } });
  },
  reject(paymentId: string, reason: string) {
    return axios.patch<ApiResponse<PaymentResponse>>(`${BASE_URL}/admin/reject`, { rejectionReason: reason }, { ...auth(), params: { paymentId } });
  },
};

export default PaymentService;
