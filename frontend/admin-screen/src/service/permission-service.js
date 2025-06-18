import axios from "axios";
import { toast } from "react-toastify";

class PermissionService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/permissions",
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
                }
                return config;
            },
            (error) => Promise.reject(error)
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

    async getAllPermissions(page = 1, size = 10) {
        try {
            const response = await this.api.get("", {
                params: { page, size },
            });
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && typeof data === 'object' && Array.isArray(data.elements)) {
                    return {
                        content: data.elements,
                        page: data.currentPage || page,
                        size: size,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1,
                    };
                } else {
                    toast.error('Dữ liệu quyền không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách quyền", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async searchPermissions(query = "", page = 1, size = 10) {
        try {
            const response = await this.api.get("/search", {
                params: { q: query, page, size },
            });
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && typeof data === 'object' && Array.isArray(data.elements)) {
                    return {
                        content: data.elements,
                        page: data.currentPage || page,
                        size: size,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1,
                    };
                } else {
                    toast.error('Dữ liệu quyền không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không tìm kiếm được quyền", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async getPermissionById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            if (response.status === 200 && response.data.code === 0) {
                const permission = response.data.data;
                return permission || null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin quyền", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async createPermission(permissionData) {
        try {
            const response = await this.api.post("", permissionData);
            if (response.status === 201 || response.status === 200) {
                toast.success("Tạo quyền thành công", { position: "top-right" });
                const permission = response.data.data;
                return permission || null;
            } else {
                toast.error(response.data.message || "Không tạo được quyền", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi tạo quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async updatePermission(id, permissionData) {
        try {
            const response = await this.api.put(`/${id}`, permissionData);
            if (response.status === 200) {
                toast.success("Cập nhật quyền thành công", { position: "top-right" });
                const permission = response.data.data;
                return permission || null;
            } else {
                toast.error(response.data.message || "Không cập nhật được quyền", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async deletePermission(id) {
        try {
            const response = await this.api.delete(`/${id}`);
            if (response.status === 200) {
                toast.success("Xóa quyền thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được quyền", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa quyền: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
}

const permissionService = new PermissionService();
export default permissionService;