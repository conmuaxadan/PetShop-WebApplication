import React from 'react';

interface Review {
  id: number;
  id_product: number;
  id_user: number;
  rating: number;
  content: string;
  create_date: string;
  reviewerResponse?: {
    username: string;
    avatar?: string;
  };
}

interface RatingSectionProps {
  reviews: Review[];
  averageRating: number;
}

const RatingSection: React.FC<RatingSectionProps> = ({ reviews, averageRating }) => {
  return (
      <div className="bg-white p-6 rounded-lg mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Đánh giá sản phẩm ({reviews.length})
        </h3>
        <div className="mb-4">
        <span className="text-lg font-semibold text-gray-700">
          Đánh giá trung bình: {averageRating.toFixed(1)} / 5
        </span>
        </div>
        {reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-gray-700">Người dùng</th>
                  <th className="px-4 py-2 text-left text-gray-700">Đánh giá</th>
                  <th className="px-4 py-2 text-left text-gray-700">Nội dung</th>
                  <th className="px-4 py-2 text-left text-gray-700">Ngày</th>
                </tr>
                </thead>
                <tbody>
                {reviews.map((review) => (
                    <tr key={review.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <img
                            src={
                                review.reviewerResponse?.avatar ||
                                'https://tse4.mm.bing.net/th?id=OIP.ggX8e6U3YzyhPvp8qGZtQwHaHa&pid=Api&P=0&h=180'
                            }
                            alt={`${review.reviewerResponse?.username || 'Khách'} avatar`}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{review.reviewerResponse?.username || 'Khách'}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          {[...Array(review.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400" aria-label="Star">
                          ★
                        </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2">{review.content}</td>
                      <td className="px-4 py-2 text-gray-500">
                        {(() => {
                          try {
                            const [datePart, timePart] = review.create_date.split(' ');
                            const [day, month, year] = datePart.split('/');
                            const formattedDate = `${year}-${month}-${day}T${timePart}`;
                            return new Date(formattedDate).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            });
                          } catch {
                            return 'Không có ngày';
                          }
                        })()}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        ) : (
            <div className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </div>
        )}
      </div>
  );
};

export default RatingSection;