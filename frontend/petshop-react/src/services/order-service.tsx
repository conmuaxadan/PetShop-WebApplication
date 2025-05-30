import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface OrderResponse {
  status: number;
  data: {
    data: any;
    message?: string;
  };
}

class OrderService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/orders",
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

  async createOrder(orderData: any): Promise<any | undefined> {
    try {
      const response: OrderResponse = await this.api.post("/", orderData);
      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error(response.data.message, { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      toast.error("Đặt hàng thất bại, vui lòng thử lại", { position: "top-right" });
      return undefined;
    }
  }

  async getMyOrders(page: number = 1, size: number = 5): Promise<any | undefined> {
    try {
      const response: OrderResponse = await this.api.get("/my-orders", {
        params: { page, size },
      });
      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error(response.data.message, { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      return undefined;
    }
  }

  async getOrderById(orderId: string): Promise<any | undefined> {
    try {
      const response: OrderResponse = await this.api.get(`/${orderId}`);
      if (response.status === 200) {
        return response.data.data;
      } else {
        toast.error(response.data.message, { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      toast.error("Không tìm thấy đơn hàng", { position: "top-right" });
      return undefined;
    }
  }

  async cancelOrder(orderId: string): Promise<void> {
    try {
      const response: OrderResponse = await this.api.put(`cancel/${orderId}`);
      if (response.status === 200) {
        toast.success(response.data.message, { position: "top-right" });
      } else {
        toast.error(response.data.message, { position: "top-right" });
      }
    } catch (error: any) {
      toast.error("Không tìm thấy đơn hàng", { position: "top-right" });
    }
  }
}

export default new OrderService();