import axios from "axios";
import { toast } from "react-toastify";

class ProductService {
    constructor(navigate) {
        this.navigate = navigate;
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/products/admin",
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });

        this.api.interceptors.request.use(
            (config) => {
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const token = user.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 403) {
                    toast.error("Bạn không có quyền truy cập tài nguyên này!", {
                        position: "top-right",
                    });

                    window.location.href = "/403";
                }
                return Promise.reject(error);
            }
        );
    }

    // Updated getAllProducts to include searchTerm
    async getAllProducts(page = 1, size = 10, searchTerm = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, keyword: searchTerm }, // Pass searchTerm as keyword
            });
            console.log("Get Products Response:", response);
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
                    toast.error("Dữ liệu sản phẩm không hợp lệ", { position: "top-right" });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không lấy được danh sách sản phẩm", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            console.error("Get Products Failed:", error.response?.data || error);
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async getProductById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            console.log("Get Product By ID Response:", response);
            if (response.status === 200 && response.data.code === 0) {
                const product = response.data.data;
                return product || null;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không lấy được thông tin sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            console.error("Get Product By ID Failed:", error.response?.data || error);
            return null;
        }
    }

    async createProduct({ productData, file }) {
        try {
            if (!productData || !file) {
                throw new Error("productData and file are required");
            }
            const formData = new FormData();
            formData.append("request", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            formData.append("file", file);

            const response = await this.api.post("/", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Create Product Response:", response);
            if (response.status === 200 || response.status === 201) {
                toast.success("Tạo sản phẩm thành công", { position: "top-right" });
                const product = response.data.data;
                return product || null;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không tạo được sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            console.error("Create Product Failed:", error.response?.data || error);
            return null;
        }
    }

    async updateProduct(id, { productData, file }) {
        try {
            if (!productData) {
                throw new Error("productData is required");
            }
            const formData = new FormData();
            formData.append("request", new Blob([JSON.stringify(productData)], { type: "application/json" }));
            if (file) {
                formData.append("file", file);
            }

            const response = await this.api.put(`/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Update Product Response:", response);
            if (response.status === 200) {
                toast.success("Cập nhật sản phẩm thành công", { position: "top-right" });
                const product = response.data.data;
                return product || null;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không cập nhật được sản phẩm", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            console.error("Update Product Failed:", error.response?.data || error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await this.api.delete(`/${id}`);
            console.log("Delete Product Response:", response);
            if (response.status === 200) {
                const message = response.data.message || "Xóa sản phẩm thành công";
                toast.success(message, { position: "top-right" });
                return true;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không xóa được sản phẩm", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            console.error("Delete Product Failed:", error.response?.data || error);
            return false;
        }
    }

    async restoreProduct(id) {
        try {
            const response = await this.api.post(`/${id}/restore`);
            console.log("Restore Product Response:", response);
            if (response.status === 200 && response.data.code === 0) {
                const message = response.data.message || "Khôi phục sản phẩm thành công";
                toast.success(message, { position: "top-right" });
                return true;
            } else {
                console.error("API Error:", response.data);
                toast.error(response.data.message || "Không khôi phục được sản phẩm", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            console.error("Restore Product Failed:", error.response?.data || error);
            return false;
        }
    }


}

export default ProductService;