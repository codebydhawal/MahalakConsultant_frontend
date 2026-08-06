import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { CartRequest } from "./CartRequest";
import { CartSummaryResponse } from "./CartSummaryResponse";

const API_URL = "http://localhost:8080/rest/cart";

class CartService {

  private getAuthHeaders() {

    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  addToCart(request: CartRequest) {

    return axios.post<ApiResponse<CartSummaryResponse>>(
      `${API_URL}/add`,
      request,
      this.getAuthHeaders()
    );
  }

  getCart() {

    return axios.get<ApiResponse<CartSummaryResponse>>(
      `${API_URL}/get-all`,
      this.getAuthHeaders()
    );
  }

  updateCart(cartId: string, quantity: number) {

    return axios.patch<ApiResponse<CartSummaryResponse>>(
      `${API_URL}/update?cartId=${cartId}&quantity=${quantity}`,
      {},
      this.getAuthHeaders()
    );
  }

  deleteCart(cartId: string) {

    return axios.delete<ApiResponse<CartSummaryResponse>>(
      `${API_URL}/delete?cartId=${cartId}`,
      this.getAuthHeaders()
    );
  }

  clearCart() {

    return axios.delete<ApiResponse<CartSummaryResponse>>(
      `${API_URL}/clear`,
      this.getAuthHeaders()
    );
  }
}

export default new CartService();