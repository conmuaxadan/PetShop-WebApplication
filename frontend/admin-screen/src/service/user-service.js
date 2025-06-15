import axios from "axios";
import { toast } from "react-toastify";

class UserService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/identity/admin/users",
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

    // Get all users with pagination and search
    async getAllUsers(page = 1, size = 10, keyword = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, keyword },
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
                    console.warn('Unexpected response structure:', data);
                    toast.error('Dữ liệu người dùng không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách người dùng", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách người dùng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    // Get user by ID
    async getUserById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            if (response.status === 200 && response.data.code === 0) {
                const user = response.data.data;
                return user || null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin người dùng", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin người dùng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    // Create a new user
    async createUser({ userData, file }) {
        try {
            const formData = new FormData();
            const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
            formData.append('user', userBlob);
            if (file) {
                formData.append('file', file);
            }
            const response = await this.api.post("", formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('createUser response:', response);
            if (response.status === 201 || response.status === 200) {
                toast.success("Tạo người dùng thành công", { position: "top-right" });
                const user = response.data.data;
                return user || null;
            } else {
                toast.error(response.data.message || "Không tạo được người dùng", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi tạo người dùng: ${message}`, {
                position: "top-right",
            });
            console.error('Error creating user:', error);
            return null;
        }
    }

    // Update user
    async updateUser(id, { userData, file }) {
        try {
            const formData = new FormData();
            // Create a Blob with JSON content type
            const userBlob = new Blob([JSON.stringify(userData)], { type: 'application/json' });
            formData.append('user', userBlob);
            if (file) {
                formData.append('file', file);
            }
            const response = await this.api.put(`/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                toast.success("Cập nhật người dùng thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không cập nhật được người dùng", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi cập nhật người dùng: ${message}`, {
                position: "top-right",
            });
            console.error('Error updating user:', error);
            return false;
        }
    }

    // Delete user (soft delete)
    async deleteUser(id) {
        try {
            const response = await this.api.patch(`/delete/${id}`);
            if (response.status === 200) {
                toast.success("Xóa người dùng thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được người dùng", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa người dùng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }

    // Restore deleted user
    async restoreUser(id) {
        try {
            const response = await this.api.patch(`/restore/${id}`);
            if (response.status === 200) {
                toast.success("Khôi phục người dùng thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không khôi phục được người dùng", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi khôi phục người dùng: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
}

const userService = new UserService();
export default userService;