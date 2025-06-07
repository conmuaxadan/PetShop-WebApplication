import React from 'react';
import { CreditCard } from 'lucide-react';

// Define the shape of formData
interface FormData {
    paymentMethod: string;
}

// Define component props interface
interface PaymentMethodProps {
    formData: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({ formData, handleChange }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
            </h2>
            <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="ml-3">Cash on Delivery (COD)</span>
                </label>
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                        type="radio"
                        name="paymentMethod"
                        value="Vnpay"
                        checked={formData.paymentMethod === "Vnpay"}
                        onChange={handleChange}
                        className="w-4 h-4 accent-green-600"
                    />
                    <span className="ml-3">Bank Transfer</span>
                </label>
            </div>
        </div>
    );
};

export default PaymentMethod;