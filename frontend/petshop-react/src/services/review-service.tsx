import axios from "axios";
import type { AxiosInstance } from "axios";
import { toast } from "react-toastify";

interface User {
  token: string;
  [key: string]: any;
}

interface ReviewResponse {
  status: number;
  data: {
    data: any;
    message?: string;
  };
}

class ReviewService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/reviews",
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

  async getReviewsByProductId(productId: string): Promise<any | undefined> {
    try {
      const response: ReviewResponse = await this.api.get(`/product/${productId}`);
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

  async createReview(reviewData: any): Promise<any> {
    try {
      const response: ReviewResponse = await this.api.post("/", reviewData);
      return response.data.data;
    } catch (error: any) {
      console.error("Error creating review:", error);
      throw error;
    }
  }
}

export default new ReviewService();