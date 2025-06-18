
import {
    CheckCircle2,
    Ban,
    Clock,
    Truck,
    RotateCcw,
    Check
} from "lucide-react";

export const getStatusColor = (status) => {
    const statusColors = {
        PENDING_CONFIRMATION: {
            bgStatus: 'bg-yellow-100',
            textStatus: 'text-yellow-800'
        },
        WAITING_FOR_SHIPMENT: {
            bgStatus: 'bg-blue-100',
            textStatus: 'text-blue-800'
        },
        SHIPPING: {
            bgStatus: 'bg-purple-100',
            textStatus: 'text-purple-800'
        },
        DELIVERED: {
            bgStatus: 'bg-green-100',
            textStatus: 'text-green-800'
        },
        CANCELED: {
            bgStatus: 'bg-red-100',
            textStatus: 'text-red-800'
        },
        CONFIRMED_BY_CUSTOMER: {
            bgStatus: 'bg-teal-100',
            textStatus: 'text-teal-800'
        },
        RETURN_REQUESTED: {
            bgStatus: 'bg-orange-100',
            textStatus: 'text-orange-800'
        },
        RETURN_APPROVED: {
            bgStatus: 'bg-indigo-100',
            textStatus: 'text-indigo-800'
        },
        WAITING_FOR_PICKUP: {
            bgStatus: 'bg-cyan-100',
            textStatus: 'text-cyan-800'
        },
        RETURNED: {
            bgStatus: 'bg-gray-100',
            textStatus: 'text-gray-800'
        }
    };

    return statusColors[status] || { bgStatus: 'bg-gray-100', textStatus: 'text-gray-600' };
};

export const canCancelOrder = (status) => {
    return ['PENDING_CONFIRMATION'].includes(status);
};

export const canReturnOrder = (status) => {
    return ['DELIVERED', 'CONFIRMED_BY_CUSTOMER'].includes(status);
};

export const getStatusIcon = (status) => {
    switch (status) {
        case "PENDING_CONFIRMATION":
            return <Clock className="w-5 h-5 text-yellow-500" />;
        case "WAITING_FOR_SHIPMENT":
            return <Truck className="w-5 h-5 text-blue-500" />;
        case "SHIPPING":
            return <Truck className="w-5 h-5 text-purple-500" />;
        case "DELIVERED":
            return <CheckCircle2 className="w-5 h-5 text-green-500" />;
        case "CANCELED":
            return <Ban className="w-5 h-5 text-red-500" />;
        case "CONFIRMED_BY_CUSTOMER":
            return <Check className="w-5 h-5 text-teal-500" />;
        case "RETURN_REQUESTED":
            return <RotateCcw className="w-5 h-5 text-orange-500" />;
        case "RETURN_APPROVED":
            return <CheckCircle2 className="w-5 h-5 text-indigo-500" />;
        case "WAITING_FOR_PICKUP":
            return <Clock className="w-5 h-5 text-cyan-500" />;
        case "RETURNED":
            return <RotateCcw className="w-5 h-5 text-gray-500" />;
        default:
            return null;
    }
};

export const getStatusLabel = (status) => {
    const statusLabels = {
        PENDING_CONFIRMATION: 'Đang chờ xác nhận',
        WAITING_FOR_SHIPMENT: 'Chờ giao hàng',
        SHIPPING: 'Đang giao hàng',
        DELIVERED: 'Giao hàng thành công',
        CANCELED: 'Đơn hàng bị hủy',
        CONFIRMED_BY_CUSTOMER: 'Khách hàng đã xác nhận',
        RETURN_REQUESTED: 'Đang yêu cầu trả hàng',
        RETURN_APPROVED: 'Yêu cầu trả hàng đã được duyệt',
        WAITING_FOR_PICKUP: 'Chờ nhân viên tới lấy hàng',
        RETURNED: 'Trả hàng'
    };

    return statusLabels[status] || status;
};
