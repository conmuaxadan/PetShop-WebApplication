import axios from "axios";
import { toast } from "react-toastify";

class OrderService {
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
                const user = JSON.parse(localStorage.getItem("user")) || {};
                const token = user.token;
                console.log(token);

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        // this.api.interceptors.response.use(
        //     (response) => response,
        //     (error) => {
        //         if (error.response?.status === 403) {
        //             toast.error("Bạn không có quyền truy cập tài nguyên này!", {
        //                 position: "top-right",
        //             });
        //
        //             window.location.href = "/403";
        //         }
        //         return Promise.reject(error);
        //     }
        // );
    }


    async searchOrders(page = 1, size = 10, query = "") {
        try {
            const response = await this.api.get("", {
                params: {
                    page,
                    size,
                    query,
                },
            });
            if (response.status === 200) {
                return response.data.data; // { currentPage, totalPages, totalElements, elements }
            } else {
                toast.error(response.data.message || "Tìm kiếm thất bại", { position: "top-right" });
            }
        } catch (error) {
            toast.error("Không thể tải danh sách đơn hàng", { position: "top-right" });
            throw error;
        }
    }
    // huy don hang
    async cancelOrder(orderId) {
        try {
            const response = await this.api.put(`cancel/${orderId}`);
            if (response.status === 200) {
                toast.success(response.data.message, {position: "top-right"});
            } else {
                toast.error(response.data.message, {position: "top-right"});
            }
        } catch (error) {
            toast.error("Không tìm thấy đơn hàng", {position: "top-right"});
        }
    }
    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId, status) {
        try {
            const response = await this.api.put(`/${orderId}/update-status`, null, {
                params: { status }
            });
                toast.success("Cập nhật trạng thái thành công", { position: "top-right" });
                return response.data.data;
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại"+error, { position: "top-right" });
            throw error;
        }
    }

}
const orderService = new OrderService();
export default orderService;

