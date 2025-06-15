import axios, {AxiosError } from "axios";
import type { AxiosInstance,AxiosResponse} from "axios";
import { toast } from "react-toastify";

// Define interfaces for API response data
interface Category {
    id?: number;
    name: string;
    // Add other category properties as needed
}

interface PaginatedResponse {
    elements: Category[];
    currentPage: number;
    totalElements: number;
    totalPages: number;
}

interface ApiResponse<T> {
    code: number;
    message?: string;
    data: T;
}

interface User {
    token?: string;
}

// Define interface for the response of getAllCategories
interface CategoriesResult {
    content: Category[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

class CategoryService {
    private api: AxiosInstance;

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
                const user: User | null = JSON.parse(localStorage.getItem("user") || "null");
                const token = user?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    console.log("Request Headers:", config.headers); // Debug
                } else {
                    console.warn("No token found in localStorage");
                }
                return config;
            },
            (error: AxiosError) => {
                console.error("Interceptor Error:", error);
                return Promise.reject(error);
            }
        );

        this.api.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", {
                        position: "top-right",
                    });
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                } else if (error.response?.status === 403) {
                    window.location.href = "/403";
                }
                return Promise.reject(error);
            }
        );
    }

    async getAllCategories(page: number = 1, size: number = 10, keyword: string = ""): Promise<CategoriesResult> {
        try {
            const response: AxiosResponse<ApiResponse<PaginatedResponse>> = await this.api.get("", {
                params: { page, size, keyword },
            });
            console.log("Get Categories Response:", response); // Debug
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && Array.isArray(data.elements)) {
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
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error("Get Categories Failed:", axiosError.response?.data || error); // Debug
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async createCategory(name: string): Promise<Category | null> {
        try {
            const response: AxiosResponse<ApiResponse<Category>> = await this.api.post("", { name });
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
        } catch (error: unknown) {
            const axiosError = error as AxiosError;
            console.error("Create Category Failed:", axiosError.response?.data || error); // Debug
            return null;
        }
    }

    logout(): void {
        localStorage.removeItem("user");
        window.location.href = "/login";
    }
}

const categoriesService = new CategoryService();
export default categoriesService;