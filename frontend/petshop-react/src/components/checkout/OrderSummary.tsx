import React from 'react';
import { Package, Truck, Loader2 } from 'lucide-react';

// Define the shape of cart item
// interface CartItem {
//     id: string | number;
//     name: string;
//     quantity: number;
//     price: number;
// }

// Define the shape of formData
interface FormData {
    notes: string;
}

// Define component props interface
interface OrderSummaryProps {
    cart: any;
    subtotal: number;
    shippingFee: number;
    loading: boolean;
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, subtotal, shippingFee, loading, formData, handleChange }) => {
    const total = subtotal + shippingFee;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Package className="w-5 h-5" />
            Order Summary
    </h2>

    <div className="space-y-4">
        {cart.length === 0 ? (
                <p>Your cart is empty.</p>
) : (
        <>
            {cart.map((item:any) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
    </div>
    <p className="font-medium">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
        </p>
        </div>
))}

    <div className="space-y-2 pt-4">
    <div className="flex justify-between text-sm">
        <span>Subtotal</span>
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm items-center">
    <span className="flex items-center gap-1">
    <Truck className="w-4 h-4" />
        Shipping Fee
    </span>
    {loading ? (
        <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
        <span className="text-sm text-gray-500">Calculating...</span>
    </div>
    ) : (
        <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
    )}
    </div>
    <div className="border-t pt-2 mt-2">
    <div className="flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span className="text-green-600">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
        </span>
        </div>
        </div>
        </div>
        </>
)}

    <textarea
        name="notes"
    placeholder="Order notes (optional)"
    value={formData.notes}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded-md mt-4"
    rows={3}
    />

    <button
    type="submit"
    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    disabled={cart.length === 0 || loading}
        >
        {loading ? (
                <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Calculating shipping fee...</span>
            </div>
) : (
        'Confirm Order'
    )}
    </button>
    </div>
    </div>
);
};

export default OrderSummary;