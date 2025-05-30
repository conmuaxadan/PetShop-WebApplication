import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface UserResponse {
  status: number;
  data: {
    data: any;
    message?: string;
  };
}

class UserService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/identity/users",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use(
      (config) => {
        const user: User = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }

  async register(userData: any): Promise<boolean> {
    try {
      const response: UserResponse = await this.api.post("/registration", userData);
      if (response.status === 200) {
        toast.success("Đăng ký thành công!", { position: "top-right" });
        return true;
      }
      toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
      return false;
    } catch (error: any) {
      console.error("Lỗi khi đăng ký:", error.message);
      if (error.response) {
        toast.error(error.response.data?.message || "Lỗi từ server!", { position: "top-right" });
      } else {
        toast.error("Lỗi kết nối đến server!", { position: "top-right" });
      }
      return false;
    }
  }

  async getUserById(userId: string): Promise<any> {
    try {
      const response: UserResponse = await this.api.get(`/${userId}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  }

  async getMyInfo(): Promise<any> {
    try {
      const response: UserResponse = await this.api.get("/my-info");
      return response.data.data;
    } catch (error: any) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return undefined;
    }
  }

  async updateUsername(userId: string, updatedData: any): Promise<boolean> {
    try {
      const response: UserResponse = await this.api.put(`username/${userId}`, updatedData);
      return response.status === 200;
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  }

  async changePassword(userId: string, request: any): Promise<void> {
    try {
      await this.api.put(`username/${userId}`, request);
      toast.success("Thay đổi mật khẩu thành công!");
    } catch (error: any) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      throw error;
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("file", file);

      const response: UserResponse = await this.api.post("/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật ảnh đại diện thành công!");
      return response.data.data;
    } catch (error: any) {
      console.error("Lỗi khi upload avatar:", error);
      const errorMessage = error.response?.data?.message || "Lỗi khi upload ảnh!";
      toast.error(errorMessage);
      return undefined;
    }
  }
}

export default new UserService();