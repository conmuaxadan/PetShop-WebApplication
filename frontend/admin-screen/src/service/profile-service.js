import axios from "axios";
import { toast } from "react-toastify";

class ProfileService {
    constructor() {
        this.api = axios.create({
            baseURL: "http://localhost:8888/api/v1/profiles/admin",
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

    async getAllProfiles(page = 1, size = 10, query = "") {
        try {
            const response = await this.api.get("", {
                params: { page, size, query },
            });
            console.log('getAllProfiles raw response:', JSON.stringify(response.data, null, 2));
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
                    toast.error('Dữ liệu hồ sơ không hợp lệ', { position: 'top-right' });
                    return { content: [], page, size, totalElements: 0, totalPages: 1 };
                }
            } else {
                toast.error(response.data.message || "Không lấy được danh sách hồ sơ", {
                    position: "top-right",
                });
                return { content: [], page, size, totalElements: 0, totalPages: 1 };
            }
        } catch (error) {
            toast.error("Lỗi khi lấy danh sách hồ sơ: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return { content: [], page, size, totalElements: 0, totalPages: 1 };
        }
    }

    async getMyProfile() {
        try {
            const response = await this.api.get("/me");
            if (response.status === 200 && response.data.code === 0) {
                const profile = response.data.data;
                return profile || null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin hồ sơ cá nhân", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin hồ sơ cá nhân: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async getProfileById(id) {
        try {
            const response = await this.api.get(`/${id}`);
            if (response.status === 200 && response.data.code === 0) {
                const profile = response.data.data;
                return profile || null;
            } else {
                toast.error(response.data.message || "Không lấy được thông tin hồ sơ", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin hồ sơ: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return null;
        }
    }

    async createProfile(profileData) {
        try {
            const response = await this.api.post("", profileData);
            console.log('createProfile response:', response);
            if (response.status === 201 || response.status === 200) {
                toast.success("Tạo hồ sơ thành công", { position: "top-right" });
                const profile = response.data.data;
                return profile || null;
            } else {
                toast.error(response.data.message || "Không tạo được hồ sơ", {
                    position: "top-right",
                });
                return null;
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            toast.error(`Lỗi khi tạo hồ sơ: ${message}`, {
                position: "top-right",
            });
            console.error('Error creating profile:', error);
            return null;
        }
    }

    async updateProfile(id, profileData) {
        try {
            const response = await this.api.put(`/${id}`, profileData);
            if (response.status === 200) {
                toast.success("Cập nhật hồ sơ thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không cập nhật được hồ sơ", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi cập nhật hồ sơ: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }

    async deleteProfile(id) {
        try {
            const response = await this.api.patch(`/delete/${id}`);
            if (response.status === 200) {
                toast.success("Xóa hồ sơ thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không xóa được hồ sơ", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi xóa hồ sơ: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }

    async restoreProfile(id) {
        try {
            const response = await this.api.patch(`/restore/${id}`);
            if (response.status === 200) {
                toast.success("Khôi phục hồ sơ thành công", { position: "top-right" });
                return true;
            } else {
                toast.error(response.data.message || "Không khôi phục được hồ sơ", {
                    position: "top-right",
                });
                return false;
            }
        } catch (error) {
            toast.error("Lỗi khi khôi phục hồ sơ: " + (error.response?.data?.message || error.message), {
                position: "top-right",
            });
            return false;
        }
    }
}

const profileService = new ProfileService();
export default profileService;