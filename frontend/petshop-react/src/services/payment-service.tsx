import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface PaymentResponse {
  status: number;
  data: {
    data: {
      paymentUrl: string;
    };
    message?: string;
  };
}

interface PaymentCallbackResponse {
  success: boolean;
  message: string;
}

class PaymentService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/payment",
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

  async createPaymentVNPay(amount: number): Promise<string | undefined> {
    try {
      const response: PaymentResponse = await this.api.get("/vnpay/pay", { params: { amount } });
      if (response.status === 200) {
        return response.data.data.paymentUrl;
      } else {
        toast.error(response.data.message, { position: "top-right" });
        return undefined;
      }
    } catch (error: any) {
      toast.error("Lỗi khi lấy danh sách đơn hàng", { position: "top-right" });
      return undefined;
    }
  }

  handlePaymentCallback(): PaymentCallbackResponse {
    const urlParams = new URLSearchParams(window.location.search);
    const responseCode = urlParams.get("vnp_ResponseCode");

    if (responseCode === "00") {
      toast.success("Thanh toán thành công!", { position: "top-right" });
      window.location.href = "/payment-result";
      return { success: true, message: "Thanh toán thành công!" };
    } else {
      toast.error("Thanh toán thất bại!", { position: "top-right" });
      return { success: false, message: "Thanh toán thất bại!" };
    }
  }
}

export default new PaymentService();