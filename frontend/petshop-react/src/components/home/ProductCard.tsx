import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
    id: String;
    title: string;
    imageSrc: string;
    imageAlt: string;
    rating: number;
    price: number;
    description?: string;
    brand?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
                                                     id,
                                                     title,
                                                     imageSrc,
                                                     imageAlt,
                                                     rating,
                                                     price,
                                                     description,
                                                     brand,
                                                 }) => {
    const navigate = useNavigate();

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    const formatPrice = (value: number): string =>
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    const handleClick = () => {
        navigate(`/product-detail/${id}`);
    };

    return (
        <div
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={handleClick}
        >
            <div className="h-48 overflow-hidden">
                <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover object-top" />
            </div>
            <div className="p-4">
                <h3 className="font-medium text-lg">{title}</h3>
                {description && <p className="text-sm text-gray-600 truncate">{description}</p>}
                {brand && <p className="text-sm text-gray-500 mt-1">Thương hiệu: {brand}</p>}
                <div className="flex items-center mt-1 mb-2">
                    {rating > 0 ? (
                        <>
                            {Array.from({ length: fullStars }).map((_, i) => (
                                <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                            ))}
                            {hasHalfStar && <i className="fas fa-star-half-alt text-yellow-400 text-xs"></i>}
                            {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
                                <i key={i} className="far fa-star text-yellow-400 text-xs"></i>
                            ))}
                            <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
                        </>
                    ) : (
                        <span className="text-xs text-gray-500">Chưa có đánh giá</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-orange-500">{formatPrice(price)}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
