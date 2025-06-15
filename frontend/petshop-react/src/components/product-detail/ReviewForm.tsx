import React from 'react';
import { Loader2 } from 'lucide-react';

interface ReviewFormProps {
  rating: number;
  reviewText: string;
  onRatingChange: (rating: number) => void;
  onReviewTextChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean; // Add isSubmitting prop
}

const ReviewForm: React.FC<ReviewFormProps> = ({
                                                 rating,
                                                 reviewText,
                                                 onRatingChange,
                                                 onReviewTextChange,
                                                 onSubmit,
                                                 isSubmitting,
                                               }) => {
  const renderRatingSelector = () => {
    return (
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
              <button
                  key={star}
                  className={`text-2xl transition-colors duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      star <= rating ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'
                  } mr-1`}
                  onClick={() => onRatingChange(star)}
                  aria-label={`Chọn ${star} sao`}
                  disabled={isSubmitting}
              ></button>
          ))}
        </div>
    );
  };

  return (
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h3>
        <form onSubmit={onSubmit}>
          {renderRatingSelector()}
          <div className="mb-4">
          <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 resize-none"
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={reviewText}
              onChange={(e) => onReviewTextChange(e.target.value)}
              required
              disabled={isSubmitting}
              aria-label="Nội dung đánh giá"
          />
          </div>
          <button
              type="submit"
              className={`bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
              aria-label="Gửi đánh giá"
          >
            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Gửi đánh giá
          </button>
        </form>
      </div>
  );
};

export default ReviewForm;