import axios from "axios";
import { BlogRequest } from "./BlogRequest";
import { API_ENDPOINTS } from "../config/api";

const BASE_URL = API_ENDPOINTS.BLOG;

class BlogService {

    private getHeaders() {
        return {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        };
    }

    getAllBlogs() {
        return axios.get(`${BASE_URL}/get-all`);
    }

    getBlogById(blogId: string) {
        return axios.get(
            `${BASE_URL}/get?blogId=${blogId}`
        );
    }

    searchBlogs(keyword: string) {
        return axios.get(
            `${BASE_URL}/search?keyword=${keyword}`
        );
    }

    getBlogsByCategory(category: string) {
        return axios.get(
            `${BASE_URL}/category?category=${category}`
        );
    }

    getBlogsByStatus(status: string) {
        return axios.get(
            `${BASE_URL}/status?status=${status}`
        );
    }

    addBlog(
        request: BlogRequest,
        featuredImage: File,
        blogDocument: File,
        authorImage?: File
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob([JSON.stringify(request)], {
                type: "application/json",
            })
        );

        formData.append("featuredImage", featuredImage);

        formData.append("blogDocument", blogDocument);

        if (authorImage) {
            formData.append("authorImage", authorImage);
        }

        return axios.post(
            `${BASE_URL}/add`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    updateBlog(
        blogId: string,
        request: BlogRequest,
        featuredImage?: File,
        blogDocument?: File,
        authorImage?: File
    ) {

        const formData = new FormData();

        formData.append(
            "request",
            new Blob([JSON.stringify(request)], {
                type: "application/json",
            })
        );

        if (featuredImage) {
            formData.append("featuredImage", featuredImage);
        }

        if (blogDocument) {
            formData.append("blogDocument", blogDocument);
        }

        if (authorImage) {
            formData.append("authorImage", authorImage);
        }

        return axios.put(
            `${BASE_URL}/update?blogId=${blogId}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    }

    updateBlogStatus(
        blogId: string,
        status: string
    ) {
        return axios.patch(
            `${BASE_URL}/update-status?blogId=${blogId}&status=${status}`,
            {},
            this.getHeaders()
        );
    }

    incrementView(blogId: string) {
        return axios.post(
            `${BASE_URL}/view?blogId=${blogId}`,
            {},
            this.getHeaders()
        );
    }

    deleteBlog(blogId: string) {
        return axios.delete(
            `${BASE_URL}/delete?blogId=${blogId}`,
            this.getHeaders()
        );
    }
}

export default new BlogService();