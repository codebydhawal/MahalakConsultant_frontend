import axios, { AxiosResponse } from "axios";
import { MediaRequest, MediaResponse } from "./Media";
import { ApiResponse } from "./ApiResponse";

const API_URL = "http://localhost:8080/rest/media";

class MediaService {

    private getAuthHeaders() {

        const token = localStorage.getItem("token");

        return {
            Authorization: `Bearer ${token}`,
        };
    }

    /**
     * Add Media
     */
    addMedia(
        request: MediaRequest,
        file: File
    ): Promise<AxiosResponse<ApiResponse<MediaResponse>>> {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                {
                    type: "application/json",
                }
            )
        );

        formData.append("file", file);

        return axios.post(
            `${API_URL}/add`,
            formData,
            {
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    /**
     * Get Media By Id
     */
    getMediaById(
        mediaId: string
    ): Promise<AxiosResponse<ApiResponse<MediaResponse>>> {

        return axios.get(
            `${API_URL}/get`,
            {
                params: {
                    mediaId,
                }
            }
        );
    }

    /**
     * Get All Media
     */
    getAllMedia(): Promise<AxiosResponse<ApiResponse<MediaResponse[]>>> {

        return axios.get(
            `${API_URL}/get-all`
        );

    }

    /**
     * Update Media
     */
    updateMedia(
        mediaId: string,
        request: MediaRequest,
        file?: File
    ): Promise<AxiosResponse<ApiResponse<MediaResponse>>> {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob(
                [JSON.stringify(request)],
                {
                    type: "application/json",
                }
            )
        );

        if (file) {
            formData.append("file", file);
        }

        return axios.put(
            `${API_URL}/update`,
            formData,
            {
                params: {
                    mediaId,
                },
                headers: {
                    ...this.getAuthHeaders(),
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    /**
     * Delete Media
     */
    deleteMedia(
        mediaId: string
    ): Promise<AxiosResponse<ApiResponse<MediaResponse>>> {

        return axios.delete(
            `${API_URL}/delete`,
            {
                params: {
                    mediaId,
                },
                headers: this.getAuthHeaders(),
            }
        );
    }

    /**
     * Search Media
     */
    searchMedia(
        keyword: string
    ): Promise<AxiosResponse<ApiResponse<MediaResponse[]>>> {

        return axios.get(
            `${API_URL}/search`,
            {
                params: {
                    keyword,
                }
            }
        );
    }
}

export default new MediaService();