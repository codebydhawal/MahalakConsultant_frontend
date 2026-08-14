import axios from "axios";
import { AddressRequest, type AddressResponse } from "./Address";
import { ApiResponse } from "./ApiResponse";
import { API_ENDPOINTS } from "../config/api";

const BASE_URL = API_ENDPOINTS.ADDRESS;

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

class AddressService {
  addAddress(request: AddressRequest) {
    return axios.post<ApiResponse<AddressResponse>>(
      `${BASE_URL}/add`,
      request,
      {
        headers: {
          ...getHeaders().headers,
          "Content-Type": "application/json",
        },
      },
    );
  }

  getAddressById(addressId: string) {
    return axios.get<ApiResponse<AddressResponse>>(
      `${BASE_URL}/get?addressId=${encodeURIComponent(addressId)}`,
      getHeaders(),
    );
  }

  getAllAddresses() {
    return axios.get<ApiResponse<AddressResponse[]>>(
      `${BASE_URL}/get-all`,
      getHeaders(),
    );
  }

  getAddressesByUser() {
    return axios.get<ApiResponse<AddressResponse[]>>(
      `${BASE_URL}/get-by-user`,
      getHeaders(),
    );
  }

  updateAddress(addressId: string, request: AddressRequest) {
    return axios.put<ApiResponse<AddressResponse>>(
      `${BASE_URL}/update?addressId=${encodeURIComponent(addressId)}`,
      request,
      {
        headers: {
          ...getHeaders().headers,
          "Content-Type": "application/json",
        },
      },
    );
  }

  deleteAddress(addressId: string) {
    return axios.delete<ApiResponse<AddressResponse>>(
      `${BASE_URL}/delete?addressId=${encodeURIComponent(addressId)}`,
      getHeaders(),
    );
  }

  setDefaultAddress(addressId: string) {
    return axios.put<ApiResponse<AddressResponse>>(
      `${BASE_URL}/set-default?addressId=${encodeURIComponent(addressId)}`,
      {},
      getHeaders(),
    );
  }
}

export default new AddressService();