import axios from "axios";
import {
    RegisterUserRequest,
    UpdateUserRequest,
    UserResponse
} from "./User";
import { ApiResponse } from "./ApiResponse";
import { API_ENDPOINTS } from "../config/api";

const BASE_URL = API_ENDPOINTS.AUTH;

const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

class UserService {

    /**
     * Register User
     */
    register(request: RegisterUserRequest) {

        return axios.post<ApiResponse<UserResponse>>(
            `${BASE_URL}/register`,
            request,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    /**
     * Get All Users
     */
    getAllUsers() {

        return axios.get<ApiResponse<UserResponse[]>>(
            `${BASE_URL}/get-all`,
            getHeaders()
        );
    }

    /**
     * Get User By Id
     */
    getUserById(userId: number) {

        return axios.get<ApiResponse<UserResponse>>(
            `${BASE_URL}/get?userId=${userId}`,
            getHeaders()
        );
    }

    /**
     * Update User
     */
    updateUser(
        userId: number,
        request: UpdateUserRequest,
        profileImage?: File
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                { type: "application/json" }
            )
        );

        if (profileImage) {
            formData.append("profileImage", profileImage);
        }

        return axios.put<ApiResponse<UserResponse>>(
            `${BASE_URL}/update?userId=${userId}`,
            formData,
            {
                headers: {
                    ...getHeaders().headers,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    /**
     * Delete User
     */
    deleteUser(userId: number) {

        return axios.delete<ApiResponse<UserResponse>>(
            `${BASE_URL}/delete?userId=${userId}`,
            getHeaders()
        );
    }

    /**
     * Update User Role & Status
     */
    updateUserRoleAndStatus(
        userId: number,
        role: string,
        status: string
    ) {

        return axios.patch<ApiResponse<UserResponse>>(
            `${BASE_URL}/update-role-status?userId=${userId}&role=${role}&status=${status}`,
            {},
            getHeaders()
        );
    }
}

export default new UserService();