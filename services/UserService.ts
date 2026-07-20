import axios from "axios";

const BASE_URL = "http://localhost:8080/rest/auth";

const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };
};

class UserService {

    // Get All Users
    getAllUsers() {
        return axios.get(
            `${BASE_URL}/get-all`,
            getHeaders()
        );
    }

    // Get User By Id
    getUserById(userId: number) {
        return axios.get(
            `${BASE_URL}/get?userId=${userId}`,
            getHeaders()
        );
    }

    // Update User
    updateUser(userId: number, data: any) {
        return axios.put(
            `${BASE_URL}/update?userId=${userId}`,
            data,
            getHeaders()
        );
    }

    // Delete User
    deleteUser(userId: number) {
        return axios.delete(
            `${BASE_URL}/delete?userId=${userId}`,
            getHeaders()
        );
    }

    // Update Role & Status
    updateUserRoleAndStatus(
        userId: number,
        role: string,
        status: string
    ) {
        return axios.patch(
            `${BASE_URL}/update-role-status?userId=${userId}&role=${role}&status=${status}`,
            {},
            getHeaders()
        );
    }
    
    // updateUserRoleAndStatus(userId: number, role: string, status: string) {
    //     return axios.put(
    //         `${BASE_URL}/update-role-status?userId=${userId}&role=${role}&status=${status}`,
    //         {},
    //         getHeaders()
    //     );
    // }
}

export default new UserService();