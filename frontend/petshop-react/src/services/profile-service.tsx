import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface ProfileResponse {
  status: number;
  data: {
    data: any;
    message?: string;
  };
}

class ProfileService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/profiles",
      headers: {
        "Content-Type": "application/json",
      },
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

  async getMyProfile(): Promise<any | undefined> {
    try {
      const response: ProfileResponse = await this.api.get("/my-profile");
      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error(response.data.message, { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      toast.error("Lỗi khi lấy thông tin", { position: "top-right" });
      return undefined;
    }
  }

  async updateAddress(idUser: string, profileData: any): Promise<any | null> {
    try {
      const response: ProfileResponse = await this.api.post(`address/${idUser}`, profileData);
      if (response.status === 200) {
        toast.success("Cập nhật thành công", { position: "top-right" });
        return response.data;
      } else {
        toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
        return null;
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật profile:", error);
      toast.error("Cập nhật thất bại, vui lòng thử lại!", { position: "top-right" });
      return null;
    }
  }

  async updateProfile(idUser: string, profileData: any): Promise<void | null> {
    try {
      const response: ProfileResponse = await this.api.put(`/${idUser}`, profileData);
      if (response.status === 200) {
        toast.success("Cập nhật thành công", { position: "top-right" });
      } else {
        toast.error(response.data?.message || "Có lỗi xảy ra!", { position: "top-right" });
        return null;
      }
    } catch (error: any) {
      toast.error("Cập nhật thất bại, vui lòng thử lại!", { position: "top-right" });
      return null;
    }
  }
}

export default new ProfileService();