import React from 'react';

interface OrderItemProps {
    orderCode: string;
    orderStatus: string;
    createdAt: string;
    productImage: string;
    productName: string;
    quantity: number;
    totalPrice: number;
    onActionClick?: () => void;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'DELIVERED':
            return { text: 'Đã giao', color: 'text-green-600', bg: 'bg-green-100' };
        case 'PENDING':
            return { text: 'Chờ xác nhận', color: 'text-yellow-600', bg: 'bg-yellow-100' };
        case 'CANCELLED':
            return { text: 'Đã hủy', color: 'text-red-600', bg: 'bg-red-100' };
        default:
            return { text: status, color: 'text-gray-600', bg: 'bg-gray-100' };
    }
};

const OrderItem: React.FC<OrderItemProps> = ({
                                                 orderCode,
                                                 orderStatus,
                                                 createdAt,
                                                 productImage,
                                                 productName,
                                                 quantity,
                                                 totalPrice,
                                                 onActionClick,
                                             }) => {
    const statusStyle = getStatusStyle(orderStatus);
    const formattedDate = new Date(createdAt).toLocaleDateString('vi-VN');
    const formattedPrice = totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className="text-sm text-gray-500">Mã đơn hàng:</span>
                    <span className="ml-2 font-medium">{orderCode}</span>
                </div>
                <div className="flex items-center">
          <span className={`px-3 py-1 text-xs font-medium ${statusStyle.color} ${statusStyle.bg} rounded-full`}>
            {statusStyle.text}
          </span>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <img src={productImage} alt={productName} className="w-20 h-20 object-cover rounded-lg" />
                <div>
                    <h3 className="font-medium">{productName}</h3>
                    <p className="text-sm text-gray-500">Số lượng: {quantity}</p>
                    <p className="text-orange-500 font-medium mt-1">{formattedPrice}</p>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formattedDate}</span>
                {orderStatus === 'PENDING' && (
                    <button
                        onClick={onActionClick}
                        className="text-orange-500 hover:text-orange-600 font-medium whitespace-nowrap rounded-button cursor-pointer"
                    >
                        Hủy đơn
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderItem;