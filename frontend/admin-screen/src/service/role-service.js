import axios from "axios";
import { toast } from "react-toastify";

class RoleService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/roles",
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

    async getAllRoles(page = 1, size = 10, query = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, query },
            });
            console.log('getAllRoles raw response:', JSON.stringify(response.data, null, 2));
            if (response.status === 200 && response.data.code === 0) {
                const data = response.data.data;
                if (data && typeof data === 'object' && Array.isArray(data.elements)) {
                    console.log('data.elements:', JSON.stringify(data.elements, null, 2));
                    return {
                        content: data.elements,
                        page: data.currentPage || page,
                        size: size,
                        totalElements: data.totalElements || 0,
                        totalPages: data.totalPages || 1,
                    };
                } else {
                    console.warn('Unexpected response structure:', data);
                    toast.error('Dữ liệu vai trò không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách vai trò", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách vai trò: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }
    async getRoleById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            if (response.status === 200 && response.data.code === 0) {
                const role = response.data.data;
                return role ? { ...role, permissions: role.permissons || [] } : null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin vai trò", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin vai trò: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async createRole(roleData) {
        try {
            const response = await this.api.post("", roleData);
            console.log('createRole response:', response);
            if (response.status === 201 || response.status === 200) {
                toast.success("Tạo vai trò thành công", { position: "top-right" });
                const role = response.data.data;
                return role ? { ...role, permissions: role.permissions || [] } : null;
            } else {
                toast.error(response.data.message || "Không tạo được vai trò", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi tạo vai trò: ${message}`, {
                position: "top-right",
            });
            console.error('Error creating role:', error);
            return null;
        }
    }

    async updateRole(id, roleData) {
        try {
            const response = await this.api.put(`/${id}`, roleData);
            if (response.status === 200) {
                toast.success("Cập nhật vai trò thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không cập nhật được vai trò", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật vai trò: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async deleteRole(id) {
        try {
            const response = await this.api.patch(`/delete/${id}`);
            if (response.status === 200) {
                toast.success("Xóa vai trò thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được vai trò", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa vai trò: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
    async restoreRole(id) {
        try {
            const response = await this.api.patch(`/restore/${id}`);
            if (response.status === 200) {
                toast.success("Xóa vai trò thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được vai trò", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa vai trò: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
}

const roleService = new RoleService();
export default roleService;