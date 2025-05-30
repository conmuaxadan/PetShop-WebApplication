import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";


interface SuccessResponse {
  data: any;
}

interface ErrorResponse {
  message: string;
}

interface LoginResponse {
  data?: SuccessResponse | ErrorResponse;
  status: number;
  message?: string;
}

interface RefreshTokenResponse {
  data?: {
    data: {
      token: string;
    };
  };
}

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/identity/auth",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  }

  async loginSocial(user: any): Promise<any | undefined> {
    try {
      const response: LoginResponse = await this.api.post("/log-in-social", user);
      return response.data && "data" in response.data ? response.data.data : undefined;
    } catch (error: any) {
      toast.error(error.message, { position: "top-right" });
      return undefined;
    }
  }

  async refreshToken(token: string): Promise<string | undefined> {
    try {
      const response: RefreshTokenResponse = await this.api.post("/refresh", { token });
      return response.data?.data.token;
    } catch (error: any) {
      toast.error(error.message, { position: "top-right" });
      return undefined;
    }
  }

  async login(email: string, password: string): Promise<any | false> {
    try {
      const response: LoginResponse = await this.api.post("/log-in", { email, password });
      if (response.status !== 200) {
        toast.error(
            response.data && "message" in response.data ? response.data.message : "Lỗi không xác định",
            { position: "top-right" }
        );
        return false;
      }
      return response.data && "data" in response.data ? response.data.data : false;
    } catch (error: any) {
      const axiosError = error as AxiosErrorResponse;
      if (axiosError.response?.data?.message) {
        toast.error(axiosError.response.data.message, { position: "top-right" });
      } else {
        toast.error("Lỗi server. Vui lòng thử lại sau.", { position: "top-right" });
      }
      return false;
    }
  }

  checkExpiredToken(token: { exp: number } | null): boolean {
    if (token) {
      return new Date(token.exp * 1000) < new Date();
    }
    return true;
  }

  async logout(token: string): Promise<void> {
    try {
      await this.api.post("/log-out", { token });
      localStorage.removeItem("user");
    } catch (error: any) {
      console.error("Error logging out:", error);
      throw error;
    }
  }
}

export default new AuthService();