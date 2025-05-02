import React from 'react';

interface Option {
    idOption: string;
    value: string;
    price: number;
    stock: number;
}

interface TypeOption {
    idType: string;
    title: string;
    options: Option[];
}

interface ProductOptionsProps {
    stock: number;
    quantity: number;
    onQuantityChange: (change: number) => void;
    onClick: () => void;
    typeOptions: TypeOption[];
    selectedOptions: { [key: string]: string };
    onOptionChange: (title: string, value: string) => void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
                                                           stock,
                                                           quantity,
                                                           onQuantityChange,
                                                           onClick,
                                                           typeOptions,
                                                           selectedOptions,
                                                           onOptionChange,
                                                       }) => {
    // Check if all required options are selected
    const isAddToCartDisabled =
        stock === 0 ||
        quantity === 0 ||
        !typeOptions.every((typeOption) => selectedOptions[typeOption.title]);

    return (
        <div>
            {/* Variant Options */}
            {typeOptions.map((typeOption) => (
                <div key={typeOption.idType} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{typeOption.title}</h3>
                    <select
                        value={selectedOptions[typeOption.title] || ''}
                        onChange={(e) => onOptionChange(typeOption.title, e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={`Chọn ${typeOption.title}`}
                    >
                        <option value="" disabled>
                            Chọn {typeOption.title}
                        </option>
                        {typeOption.options.map((option) => (
                            <option key={option.idOption} value={option.value}>
                                {option.value} (Còn: {option.stock})
                            </option>
                        ))}
                    </select>
                </div>
            ))}

            {/* Quantity Selector */}
            <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Số lượng</h3>
                <div className="flex items-center">
                    <button
                        className="w-10 h-10 rounded-l-full bg-gray-200 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onQuantityChange(-1)}
                        disabled={quantity <= 1}
                        aria-label="Giảm số lượng"
                    >
                        <i className="fas fa-minus text-gray-600"></i>
                    </button>
                    <input
                        type="text"
                        className="w-16 h-10 border-none text-center bg-gray-100 text-gray-900"
                        value={quantity}
                        readOnly
                        aria-label={`Số lượng: ${quantity}`}
                    />
                    <button
                        className="w-10 h-10 rounded-r-full bg-gray-200 flex items-center justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onQuantityChange(1)}
                        disabled={quantity >= stock}
                        aria-label="Tăng số lượng"
                    >
                        <i className="fas fa-plus text-gray-600"></i>
                    </button>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                    {stock > 0 ? `Còn ${stock} sản phẩm` : 'Hết hàng'}
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mb-6">
                <button
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onClick}
                    disabled={isAddToCartDisabled}
                    aria-label={`Thêm ${quantity} sản phẩm vào giỏ hàng`}
                >
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Thêm vào giỏ hàng
                </button>
            </div>
        </div>
    );
};

export default ProductOptions;