import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
    role?: string;
}

export const getDashboardBasePath = () => {
    const token = localStorage.getItem("token") || "{}";
    const decoded = jwtDecode<DecodedToken>(token);
    const role = decoded.role;

    switch (role) {
        case "ADMIN":
            return "/admin";

        case "STAFF":
            return "/staff";
    }
};