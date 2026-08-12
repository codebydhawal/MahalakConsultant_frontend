import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { TeamRequest, TeamResponse } from "./Team";

const API_URL = "http://localhost:8080/rest/team";

class TeamService {

    private getAuthHeaders() {

        const token = localStorage.getItem("token");

        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    }

    addTeam(
        request: TeamRequest,
        file: File
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                { type: "application/json" }
            )
        );

        formData.append("file", file);

        return axios.post<ApiResponse<TeamResponse>>(
            `${API_URL}/add`,
            formData,
            {
                headers: {
                    ...this.getAuthHeaders().headers,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    getTeamById(teamId: string) {

        return axios.get<ApiResponse<TeamResponse>>(
            `${API_URL}/get`,
            {
                params: {
                    teamId,
                },
            }
        );
    }

    getAllTeams() {

        return axios.get<ApiResponse<TeamResponse[]>>(
            `${API_URL}/get-all`
        );
    }

    updateTeam(
        teamId: string,
        request: TeamRequest,
        file?: File
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                { type: "application/json" }
            )
        );

        if (file) {
            formData.append("file", file);
        }

        return axios.put<ApiResponse<TeamResponse>>(
            `${API_URL}/update?teamId=${teamId}`,
            formData,
            {
                headers: {
                    ...this.getAuthHeaders().headers,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    deleteTeam(teamId: string) {

        return axios.delete<ApiResponse<TeamResponse>>(
            `${API_URL}/delete`,
            {
                ...this.getAuthHeaders(),
                params: {
                    teamId,
                },
            }
        );
    }

    searchTeam(keyword: string) {

        return axios.get<ApiResponse<TeamResponse[]>>(
            `${API_URL}/search`,
            {
                params: {
                    keyword,
                },
            }
        );
    }
}

export default new TeamService();