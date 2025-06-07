import React from 'react';

interface PriceAndRatingProps {
  currentPrice: number;
  averageRating: number;
  reviewCount: number;
}

const PriceAndRating: React.FC<PriceAndRatingProps> = ({
  currentPrice,
  averageRating,
  reviewCount,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <i
        key={index}
        className={`${index < Math.round(rating) ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'} mr-1`}
      ></i>
    ));
  };

  return (
    <div>
      <div className="mb-6">
        <span className="text-3xl font-bold text-primary mr-3">
          {formatPrice(currentPrice)}
        </span>
        {currentPrice && (
          <span className="text-xl text-gray-500 line-through">
            {formatPrice(currentPrice+currentPrice*1/10)}
          </span>
        )}
      </div>

      <div className="flex items-center mb-4">
        <div className="flex items-center mr-4">
          {renderStars(averageRating)}
        </div>
        <span className="text-gray-600">({reviewCount} đánh giá)</span>
      </div>
    </div>
  );
};

export default PriceAndRating;