import React, { useState, useEffect, useCallback } from "react";
import { Search, Loader2, X } from "lucide-react";
import { toast } from "react-toastify";
import OrderService from "../services/order-service"; // Adjust path as needed
import OrderItem from "../components/order-history/OrderItem"; // Adjusted path

const ITEMS_PER_PAGE = 5;

const statusTabs = [
    { key: "All", label: "Tất cả" },
    { key: "PENDING", label: "Đang chờ xác nhận" },
    { key: "PROCESSING", label: "Chờ giao hàng" },
    { key: "SHIPPING", label: "Đang giao hàng" },
    { key: "DELIVERED", label: "Giao hàng thành công" },
    { key: "CANCELLED", label: "Đơn hàng bị hủy" },
    { key: "RETURN_REQUESTED", label: "Đang yêu cầu trả hàng" },
    { key: "RETURN_APPROVED", label: "Yêu cầu trả hàng đã được duyệt" },
    { key: "WAITING_FOR_PICKUP", label: "Chờ nhân viên tới lấy hàng" },
    { key: "RETURNED", label: "Trả hàng" },
];

interface Product {
    name: string;
    quantity: number;
    price: number;
    weight: number;
    image: string;
    productCode?: string; // Optional for fallback
}

interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: number;
    address: string;
    products: Product[];
}

const Modal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                    aria-label="Đóng"
                >
                    <X size={20} />
                </button>
                {children}
            </div>
        </div>
    );
};

const OrderHistory: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [activeStatus, setActiveStatus] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);

    const statusMap: Record<string, string> = {
        PENDING_CONFIRMATION: "PENDING",
        WAITING_FOR_SHIPMENT: "PROCESSING",
        SHIPPING: "SHIPPING",
        DELIVERED: "DELIVERED",
        CANCELED: "CANCELLED",
        RETURN_REQUESTED: "RETURN_REQUESTED",
        RETURN_APPROVED: "RETURN_APPROVED",
        WAITING_FOR_PICKUP: "WAITING_FOR_PICKUP",
        RETURNED: "RETURNED",
    };

    const translateOption: Record<string, string> = {
        FOOD: "Thức ăn",
        COLOR: "Màu sắc",
        SIZE: "Kích thước",
        // Add more translations as needed
    };

    const translateValue: Record<string, string> = {
        "500G": "500g",
        "1KG": "1kg",
        RED: "Đỏ",
        BLUE: "Xanh dương",
        // Add more translations as needed
    };

    const constructProductName = (baseName: string | undefined, productCode: string | undefined): string => {
        if (!productCode) return baseName || "Sản phẩm không xác định";
        const parts = productCode.split("-");
        if (parts.length < 3) return baseName ? `${baseName} ${productCode}` : productCode;
        const [idproduct, option, value] = parts;
        const translatedOption = translateOption[option.toUpperCase()] || option;
        const translatedValue = translateValue[value.toUpperCase()] || value.toLowerCase();
        return baseName ? `${baseName} ${translatedOption} ${translatedValue}` : `${translatedOption} ${translatedValue}`;
    };

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const response = await OrderService.getMyOrders(currentPage, ITEMS_PER_PAGE);
            console.log(response)
            if (response) {
                const allOrders = response.elements.map((order: any) => ({
                    id: order.id,
                    date: new Date(order.orderDate).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                    }).split("/").reverse().join("-"),
                    status: statusMap[order.status] || order.status,
                    total: order.totalPrice,
                    items: order.orderItems.length,
                    address: order.address,
                    products: order.orderItems.map((item: any) => ({
                        name: constructProductName(item.name, item.productCode),
                        productCode: item.productCode,
                        quantity: item.quantity,
                        price: item.price,
                        weight: item.weight,
                        image: item.image || "https://via.placeholder.com/80?text=No+Image",
                    })),
                }));
                setOrders(allOrders);
                setTotalPages(response.totalPages || 1);
            } else {
                toast.error("Không thể tải lịch sử đơn hàng", { position: "top-right" });
                setOrders([]);
                setTotalPages(1);
            }
        } catch (error) {
            toast.error("Lỗi khi tải lịch sử đơn hàng", { position: "top-right" });
            setOrders([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const openCancelModal = (orderId: string) => {
        console.log(orderId)
        setSelectedOrderId(orderId);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
        setSelectedOrderId(null);
    };

    const handleCancelOrder = async () => {
        if (!selectedOrderId) return;
        setCancelLoading(true);
        try {
            await OrderService.cancelOrder(selectedOrderId);
            toast.success("Đơn hàng đã được hủy", { position: "top-right" });
            fetchOrders();
            closeCancelModal();
        } catch (error) {
            toast.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.", { position: "top-right" });
        } finally {
            setCancelLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = activeStatus === "All" || order.status === activeStatus;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            searchQuery === "" ||
            order.id.toLowerCase().includes(searchLower) ||
            order.date.toLowerCase().includes(searchLower) ||
            order.address.toLowerCase().includes(searchLower) ||
            order.products.some((product) => product.name.toLowerCase().includes(searchLower));
        return matchesStatus && matchesSearch;
    });

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && !loading) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-orange-500">Lịch sử đơn hàng</h1>
                    <p className="mt-2 text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-96">
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo mã đơn, ngày, địa chỉ hoặc sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                aria-label="Tìm kiếm đơn hàng"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {statusTabs.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => {
                                        setActiveStatus(key);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeStatus === key ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                    aria-label={`Lọc theo trạng thái ${label}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-600">Không tìm thấy đơn hàng nào</div>
                    ) : (
                        <div className="space-y-4 p-4">
                            {filteredOrders.map((order) =>
                                order.products.map((product, index) => (
                                    <OrderItem
                                        key={`${order.id}-${index}`}
                                        orderCode={order.id}
                                        orderStatus={order.status}
                                        createdAt={order.date}
                                        productImage={product.image}
                                        productName={product.name}
                                        quantity={product.quantity}
                                        totalPrice={product.price * product.quantity}
                                        onActionClick={order.status === "PENDING" ? () => openCancelModal(order.id) : undefined}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
                <Modal isOpen={isCancelModalOpen} onClose={closeCancelModal}>
                    <h2 className="text-2xl font-bold mb-4">Xác nhận hủy đơn hàng</h2>
                    <p className="text-gray-600 mb-6">Bạn có chắc muốn hủy đơn hàng này không?</p>
                    <div className="flex gap-4 justify-end">
                        <button
                            onClick={closeCancelModal}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            aria-label="Hủy bỏ"
                        >
                            Không
                        </button>
                        <button
                            onClick={handleCancelOrder}
                            disabled={cancelLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                            aria-label="Xác nhận hủy"
                        >
                            Có, hủy đơn hàng
                        </button>
                    </div>
                </Modal>
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
                        <div className="text-sm text-gray-600">
                            Hiển thị {filteredOrders.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} đến{" "}
                            {Math.min(currentPage * ITEMS_PER_PAGE, filteredOrders.length)} trong tổng số {filteredOrders.length} đơn hàng
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || loading}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Trang trước"
                            >
                                Trước
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                            currentPage === page
                                                ? "bg-orange-600 text-white"
                                                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                                        }`}
                                        aria-current={currentPage === page ? "page" : undefined}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || loading}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-400 text-white hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Trang tiếp theo"
                            >
                                Tiếp theo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;