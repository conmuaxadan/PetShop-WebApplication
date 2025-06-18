import React, { useState, useEffect } from "react";
import DataTable from "../components/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import {
  Package, Search, Filter, Ban, Clock, MoreHorizontal, X, RotateCcw, AlertCircle, Eye, CheckCircle2
} from "lucide-react";
import OrderService from "../service/order-service";
import { getStatusColor, getStatusIcon, canCancelOrder, canReturnOrder, getStatusLabel } from "../utils/status";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [modalMode, setModalMode] = useState("details");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);

  const validStatusTransitions = {
    PENDING_CONFIRMATION: ["WAITING_FOR_SHIPMENT", "CANCELED"],
    WAITING_FOR_PICKUP: ["SHIPPING", "CANCELED"],
    SHIPPING: ["DELIVERED"],
    DELIVERED: ["RETURN_APPROVED"],
    RETURN_APPROVED: ["RETURNED"],
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await OrderService.searchOrders(page, size, searchTerm);
        setOrders(data.elements.map(order => ({
          ...order,
          user: { id: order.id, name: order.customerName || "Unknown" },
          orderItems: order.orderItems.map(item => ({
            productId: item.productCode,
            quantity: item.quantity,
            price: item.price,
          })),
        })));
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [searchTerm, page]);

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  const handleOpenModal = (order, mode) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setModalMode(mode);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
    setNewStatus("");
    setModalMode("details");
  };

  const handleOpenConfirmModal = (order, mode) => {
    setSelectedOrder(order);
    setModalMode(mode);
    if (mode === "approve") setNewStatus("WAITING_FOR_SHIPMENT");
    if (mode === "return") setNewStatus("RETURN_APPROVED");
    if (mode === "cancel") setNewStatus("CANCELED");
    setIsConfirmModalOpen(true);
    setActiveDropdown(null);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
    setModalMode("details");
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      setLoading(true);
      let updatedOrder;
      if (modalMode === "status" || modalMode === "approve" || modalMode === "return" || modalMode === "cancel") {
        updatedOrder = await OrderService.updateOrderStatus(selectedOrder.id, newStatus);
      }

      setOrders((prevOrders) =>
          prevOrders.map((order) =>
              order.id === selectedOrder.id ? { ...order, ...updatedOrder, status: newStatus } : order
          )
      );
      setIsConfirmModalOpen(false);
      handleCloseModal();
    } catch (error) {
      console.error("Update failed:", error);
      setIsConfirmModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (modalMode) {
      case "details": return "Chi tiết đơn hàng";
      default: return "Cập nhật trạng thái đơn hàng";
    }
  };

  const getAvailableStatuses = (currentStatus) => {
    return validStatusTransitions[currentStatus] || [];
  };

  const getConfirmMessage = () => {
    if (modalMode === "status") {
      return `Bạn có chắc muốn thay đổi trạng thái đơn hàng ${selectedOrder.id} từ "${getStatusLabel(selectedOrder.status)}" sang "${getStatusLabel(newStatus)}"?`;
    } else if (modalMode === "approve") {
      return `Bạn có chắc muốn chấp thuận đơn hàng ${selectedOrder.id} và chuyển sang "${getStatusLabel("WAITING_FOR_SHIPMENT")}"?`;
    } else if (modalMode === "return") {
      return `Bạn có chắc muốn yêu cầu trả hàng cho đơn hàng ${selectedOrder.id}?`;
    } else if (modalMode === "cancel") {
      return `Bạn có chắc muốn hủy đơn hàng ${selectedOrder.id}?`;
    }
    return "";
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", { header: "Mã đơn hàng", cell: (info) => info.getValue() }),
    columnHelper.accessor("user", { header: "Khách hàng", cell: (info) => info.getValue().name }),
    columnHelper.accessor("orderDate", {
      header: "Ngày đặt",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.accessor("totalPrice", {
      header: "Tổng tiền",
      cell: (info) => `${info.getValue().toFixed(2)} VND`,
    }),
    columnHelper.accessor("status", {
      header: "Trạng thái",
      cell: (info) => {
        const status = info.getValue();
        const { bgStatus, textStatus } = getStatusColor(status);
        return (
            <div className="flex items-center">
              {getStatusIcon(status)}
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgStatus} ${textStatus}`}>
              {getStatusLabel(status)}
            </span>
            </div>
        );
      },
    }),
    columnHelper.accessor("orderItems", {
      header: "Sản phẩm",
      cell: (info) => `${info.getValue().length} sản phẩm`,
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => (
          <div className="relative text-right">
            <button
                onClick={() => setActiveDropdown(activeDropdown === row.original.id ? null : row.original.id)}
                className="text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {activeDropdown === row.original.id && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                        onClick={() => handleOpenModal(row.original, "details")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 mr-2" /> Xem chi tiết
                    </button>
                    <button
                        onClick={() => handleOpenModal(row.original, "status")}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        disabled={row.original.status === "CANCELED" || row.original.status === "RETURNED"}
                    >
                      <Clock className="h-4 w-4 mr-2" /> Cập nhật trạng thái
                    </button>
                    <button
                        onClick={() => handleOpenConfirmModal(row.original, "approve")}
                        className="flex items-center w-full px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                        disabled={row.original.status !== "PENDING_CONFIRMATION" || loading}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Chấp thuận
                    </button>
                    <button
                        onClick={() => handleOpenConfirmModal(row.original, "return")}
                        className="flex items-center w-full px-4 py-2 text-sm text-purple-700 hover:bg-gray-100"
                        disabled={!canReturnOrder(row.original.status) || loading}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" /> Yêu cầu trả hàng
                    </button>
                    <button
                        onClick={() => handleOpenConfirmModal(row.original, "cancel")}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                        disabled={!canCancelOrder(row.original.status) || loading}
                    >
                      <Ban className="h-4 w-4 mr-2" /> Hủy đơn hàng
                    </button>
                  </div>
                </div>
            )}
          </div>
      ),
    }),
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-48">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="PENDING_CONFIRMATION">{getStatusLabel("PENDING_CONFIRMATION")}</option>
                    <option value="WAITING_FOR_SHIPMENT">{getStatusLabel("WAITING_FOR_SHIPMENT")}</option>
                    <option value="SHIPPING">{getStatusLabel("SHIPPING")}</option>
                    <option value="DELIVERED">{getStatusLabel("DELIVERED")}</option>
                    <option value="CANCELED">{getStatusLabel("CANCELED")}</option>
                    <option value="RETURN_REQUESTED">{getStatusLabel("RETURN_REQUESTED")}</option>
                    <option value="RETURN_APPROVED">{getStatusLabel("RETURN_APPROVED")}</option>
                    <option value="WAITING_FOR_PICKUP">{getStatusLabel("WAITING_FOR_PICKUP")}</option>
                    <option value="RETURNED">{getStatusLabel("RETURNED")}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
              <div className="text-center py-4">Đang tải...</div>
          ) : (
              <>
                <DataTable data={filteredOrders} columns={columns} />
                <div className="flex justify-between mt-4">
                  <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                  >
                    Trang trước
                  </button>
                  <span>Trang {page} / {totalPages}</span>
                  <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
                  >
                    Trang sau
                  </button>
                </div>
              </>
          )}
        </div>

        {isModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-lg w-full">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getModalTitle()} - {selectedOrder.id}
                  </h2>
                  <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {modalMode === "status" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật trạng thái</label>
                          <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={selectedOrder.status}>
                              {getStatusLabel(selectedOrder.status)}
                            </option>
                            {getAvailableStatuses(selectedOrder.status).map((status) => (
                                <option key={status} value={status}>
                                  {getStatusLabel(status)}
                                </option>
                            ))}
                          </select>
                        </div>
                    )}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Chi tiết đơn hàng</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <p className="text-sm text-gray-600"><span className="font-medium">Khách hàng:</span> {selectedOrder.user.name} (ID: {selectedOrder.user.id})</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Ngày đặt:</span> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Tổng tiền:</span> {selectedOrder.totalPrice.toFixed(2)} VND</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Trạng thái:</span> {getStatusLabel(selectedOrder.status)}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Ghi chú:</span> {selectedOrder.note || "Không có"}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Địa chỉ:</span> {selectedOrder.address}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Số điện thoại:</span> {selectedOrder.tel}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Tiền COD:</span> {selectedOrder.pick_money} VND</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Giá trị đơn:</span> {selectedOrder.value} VND</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Miễn phí vận chuyển:</span> {selectedOrder.is_freeship === 0 ? "Không" : "Có"}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Hình thức vận chuyển:</span> {selectedOrder.pick_option}</p>
                        <p className="text-sm text-gray-600"><span className="font-medium">Sản phẩm:</span> {selectedOrder.orderItems.length} sản phẩm</p>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          {selectedOrder.orderItems.map((item, index) => (
                              <li key={index}>Mã SP: {item.productId}, SL: {item.quantity}, Giá: {item.price.toFixed(2)} VND</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t">
                  <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    {modalMode === "details" ? "Đóng" : "Hủy"}
                  </button>
                  {modalMode === "status" && (
                      <button
                          onClick={handleOpenConfirmModal}
                          disabled={newStatus === selectedOrder.status}
                          className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                              newStatus !== selectedOrder.status ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                          }`}
                      >
                        Cập nhật trạng thái
                      </button>
                  )}
                </div>
              </div>
            </div>
        )}

        {isConfirmModalOpen && selectedOrder && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-sm w-full">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Xác nhận hành động</h3>
                  <p className="mt-2 text-sm text-gray-600">{getConfirmMessage()}</p>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t">
                  <button
                      onClick={handleCloseConfirmModal}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleUpdateOrder}
                      disabled={loading}
                      className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                          modalMode === "cancel" ? "bg-red-600 hover:bg-red-700" :
                              modalMode === "return" ? "bg-purple-600 hover:bg-purple-700" :
                                  modalMode === "approve" ? "bg-green-600 hover:bg-green-700" :
                                      "bg-blue-600 hover:bg-blue-700"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default Orders;