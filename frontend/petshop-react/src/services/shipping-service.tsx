import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface ShippingResponse {
  status: number;
  data: {
    data: {
      fee: {
        fee: number;
      };
    };
    message?: string;
  };
}

class ShippingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/shipping",
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

  async getShippingFee(shippingData: any): Promise<number | undefined> {
    try {
      const response: ShippingResponse = await this.api.post("/fee", shippingData);
      if (response.status === 200) {
        return response.data.data.fee.fee;
      } else {
        toast.error(response.data.message || "Không thể lấy phí vận chuyển!", { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      console.error("Error fetching shipping fee:", error);
      throw error;
    }
  }
}

export default new ShippingService();