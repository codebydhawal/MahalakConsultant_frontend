import axios from "axios";
import { ApiResponse } from "./ApiResponse";
import { ProjectRequest, ProjectResponse } from "./project";

const API_URL = "http://localhost:8080/rest/project";

class ProjectService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  getAllProjects() {
    return axios.get<ApiResponse<ProjectResponse[]>>(
      `${API_URL}/get-all`
    );
  }

  getProjectById(projectId: string) {
    return axios.get<ApiResponse<ProjectResponse>>(
      `${API_URL}/get?projectId=${projectId}`,
      this.getAuthHeaders()
    );
  }

  searchProjects(keyword: string) {
    return axios.get<ApiResponse<ProjectResponse[]>>(
      `${API_URL}/search?keyword=${keyword}`
    );
  }

  addProject(
    request: ProjectRequest,
    thumbnail: File,
    document?: File
  ) {
    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], {
        type: "application/json",
      })
    );

    formData.append("file", thumbnail);

    if (document) {
      formData.append("document", document);
    }

    return axios.post<ApiResponse<ProjectResponse>>(
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

  updateProject(
    projectId: string,
    request: ProjectRequest,
    thumbnail?: File,
    document?: File
  ) {
    const formData = new FormData();

    formData.append(
      "request",
      new Blob([JSON.stringify(request)], {
        type: "application/json",
      })
    );

    if (thumbnail) {
      formData.append("file", thumbnail);
    }

    if (document) {
      formData.append("document", document);
    }

    return axios.patch<ApiResponse<ProjectResponse>>(
      `${API_URL}/update?projectId=${projectId}`,
      formData,
      {
        headers: {
          ...this.getAuthHeaders().headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  deleteProject(projectId: string) {
    return axios.delete<ApiResponse<ProjectResponse>>(
      `${API_URL}/delete?projectId=${projectId}`,
      this.getAuthHeaders()
    );
  }

  getProjectDocumentContent(projectId: string) {
    return axios.get<{ html: string }>(
      `${API_URL}/document-content`,
      {
        params: {
          projectId,
        },
        headers: {
          ...this.getAuthHeaders().headers,
        },
      }
    );
  }

  getRandomProjects() {
    return axios.get<ApiResponse<ProjectResponse[]>>(
      `${API_URL}/random`
    );
  }
}

export default new ProjectService();