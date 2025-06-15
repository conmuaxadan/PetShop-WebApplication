import axios from "axios";
import type { AxiosInstance } from "axios";
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  petType: string;
  brand: string;
  image: string;
}

interface PageResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FilterParams {
  category?: string;
  petTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

interface ApiResponse<T> {
  data: T;
  error?: string;
}

class ProductService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: "http://localhost:8888/api/v1/products", // Adjust to match your backend
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
  }

  async getFilteredProducts(params: FilterParams): Promise<PageResponse> {
    try {
      const response = await this.api.get<ApiResponse<PageResponse>>("/filter", {
        params: {
          category: params.category,
          petTypes: params.petTypes?.join(","),
          minPrice: params.minPrice,
          maxPrice: params.maxPrice,
          brands: params.brands?.join(","),
          sort: params.sort,
          page: params.page,
          limit: params.limit,
        },
      });
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching filtered products:", error.message);
      throw new Error("Failed to fetch filtered products");
    }
  }

  // Other methods (e.g., getProductById, getMaxPrice, getMinPrice) remain unchanged
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await this.api.get<ApiResponse<Product>>(`/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching product by id:", error.message);
      throw new Error("Failed to fetch product by id");
    }
  }

  getMaxPrice(weightProducts: { unit: string; weightType: { value: number } }[], price: number): number {
    let maxValue = 0;
    weightProducts.forEach((weightProduct) => {
      let value = 0;
      if (weightProduct.unit === "g") {
        value = (price * weightProduct.weightType.value) / 1000;
      } else {
        value = price * weightProduct.weightType.value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    });
    return maxValue;
  }

  getMinPrice(weightProducts: { unit: string; weightType: { value: number } }[], price: number): number {
    let minValue = Number.MAX_SAFE_INTEGER;
    weightProducts.forEach((weightProduct) => {
      let value = 0;
      if (weightProduct.unit === "g") {
        value = (price * weightProduct.weightType.value) / 1000;
      } else {
        value = price * weightProduct.weightType.value;
      }
      if (value < minValue) {
        minValue = value;
      }
    });
    return minValue;
  }
}

export default new ProductService();