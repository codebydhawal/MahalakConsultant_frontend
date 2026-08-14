import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { OrderRequest, OrderResponse } from "./Commerce";
import { API_ENDPOINTS } from "../config/api";

const BASE_URL = API_ENDPOINTS.ORDER;
const auth = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });

const OrderService = {
  createOrder(request: OrderRequest) {
    return axios.post<ApiResponse<OrderResponse>>(`${BASE_URL}/create`, request, auth());
  },
  getMyOrders() {
    return axios.get<ApiResponse<OrderResponse[]>>(`${BASE_URL}/get-all`, auth());
  },
  cancelOrder(orderId: string) {
    return axios.patch<ApiResponse<OrderResponse>>(`${BASE_URL}/cancel`, {}, { ...auth(), params: { orderId } });
  },
  getAllOrders() {
    return axios.get<ApiResponse<OrderResponse[]>>(`${BASE_URL}/admin/get-all`, auth());
  },
  updateStatus(orderId: string, status: string) {
    return axios.patch<ApiResponse<OrderResponse>>(`${BASE_URL}/admin/update-status`, {}, { ...auth(), params: { orderId, status } });
  },
  reorder(orderId: string) {
    return axios.post<ApiResponse<unknown>>(`${BASE_URL}/reorder`, {}, { ...auth(), params: { orderId } });
  },
  getOrderById(orderId: string) {
    return axios.get<ApiResponse<OrderResponse>>(
      `${BASE_URL}/get`,
      {
        ...auth(),
        params: { orderId },
      }
    );
  },
  getOrderForAdmin(orderId: string) {
    return axios.get<ApiResponse<OrderResponse>>(
      `${BASE_URL}/admin/get`,
      {
        ...auth(),
        params: { orderId },
      }
    );
  },
};

export default OrderService;
