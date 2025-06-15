import axios from "axios";
import { toast } from "react-toastify";

class CategoryService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/products/categories",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        this.api.interceptors.request.use(
            (config) => {
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const token = user.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;

                } else {
                    console.warn("No token found in localStorage");
                }
                return config;
            },
            (error) => {
                console.error("Interceptor Error:", error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
                        position: "top-right",
                    });
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                } else if (error.response?.status === 403) {
                    // Redirect to 403 page for any 403 error
                    window.location.href = "/403";
                }
                return Promise.reject(error);
            }
        );
    }

    async getAllCategories(page = 1, size = 10, keyword = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, keyword },
            });
            console.log("Get Categories Response:", response); // Debug
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && typeof data === "object" && Array.isArray(data.elements)) {
                    return {
                        content: data.elements,
                        page: data.currentPage || page,
                        size: size,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1,
                    };
                } else {
                    console.warn("Unexpected response structure:", data);
                    toast.error("Dữ liệu danh mục không hợp lệ", { position: "top-right" });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không lấy được danh sách danh mục", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            console.error("Get Categories Failed:", error.response?.data || error); // Debug
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async createCategory(name) {
        try {
            const response = await this.api.post("", { name });
            console.log("Create Category Response:", response); // Debug
            if (response.status === 200 && response.data.code === 0) {
                toast.success("Tạo danh mục thành công", { position: "top-right" });
                return response.data.data;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không thể tạo danh mục", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            console.error("Create Category Failed:", error.response?.data || error); // Debug
            return null;
        }
    }

    logout() {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
}

const categoriesService = new CategoryService();
export default categoriesService;