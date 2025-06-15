import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ProductImages from '../components/product-detail/ProductImages';
import ProductOptions from '../components/product-detail/ProductOptions';
import PriceAndRating from '../components/product-detail/PriceAndRating';
import ReviewForm from '../components/product-detail/ReviewForm';
import Description from '../components/product-detail/Description';
import ProductService from '../services/product-service';
import ReviewService from '../services/review-service';
import { useCart, CartActionTypes } from '../context/CartContext';
import { useUser } from '../context/UserContext'; // Import UserContext
import { toast } from 'react-toastify';
import RatingSection from "../components/product-detail/RatingSection.tsx";

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

interface Category {
  id_category: number;
  name: string;
  image: string | null;
  description: string | null;
}

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

interface Product {
  id_product: number;
  name: string;
  price: number;
  oldPrice: number | null;
  description: string;
  average_rating: number;
  category: Category;
  images: string[];
  organic: boolean;
  origin: string;
  packaging: string;
  brand: string;
  howToUse: string;
  howToPreserve: string;
  weight: number;
  stock: number | null;
  active: boolean;
  forPet: string;
  typeOptions: TypeOption[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const { user } = useUser(); // Get user from UserContext
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState<string>('description');
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>('');
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize selectedOptions with the first option for each type
  useEffect(() => {
    if (product && product.typeOptions) {
      const initialOptions: { [key: string]: string } = {};
      product.typeOptions.forEach((typeOption) => {
        if (typeOption.options.length > 0) {
          initialOptions[typeOption.title] = typeOption.options[0].value;
        }
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // Fetch product and reviews data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError('Product ID is missing.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [productData, reviewsData] = await Promise.all([
          ProductService.getProductById(id),
          ReviewService.getReviewsByProductId(id),
        ]);
        setProduct(productData);
        setReviews(reviewsData || []);
      } catch (err) {
        setError('Failed to fetch product or reviews data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle loading and error states
  if (loading) {
    return (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto" />
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
    );
  }
  if (error || !product) return <div>{error || 'Product not found'}</div>;

  // Calculate variant price and stock
  const getVariantPriceAndStock = () => {
    if (!product.typeOptions || product.typeOptions.length === 0) {
      return { price: product.price, stock: product.stock || 0 };
    }

    let variantPrice = product.price;
    let minStock = Infinity;

    for (const typeOption of product.typeOptions) {
      const selectedValue = selectedOptions[typeOption.title];
      if (!selectedValue) {
        return { price: product.price, stock: 0 };
      }
      const option = typeOption.options.find((opt) => opt.value === selectedValue);
      if (!option) {
        return { price: product.price, stock: 0 };
      }
      variantPrice = option.price > 0 ? option.price : product.price;
      minStock = Math.min(minStock, option.stock);
    }

    return { price: variantPrice, stock: minStock === Infinity ? 0 : minStock };
  };

  const { price: currentPrice, stock: availableStock } = getVariantPriceAndStock();

  // Generate variantId and variantName
  const getVariantId = () => {
    if (!product.typeOptions || product.typeOptions.length === 0) {
      return product.id_product.toString();
    }
    const variantParts = [product.id_product.toString()];
    product.typeOptions.forEach((typeOption) => {
      const selectedValue = selectedOptions[typeOption.title];
      if (selectedValue) {
        variantParts.push(`${typeOption.title}-${selectedValue}`);
      }
    });
    return variantParts.join('-');
  };

  const getVariantName = () => {
    if (!product.typeOptions || product.typeOptions.length === 0) {
      return product.name;
    }
    const variantDetails = product.typeOptions
        .map((typeOption) => {
          const selectedValue = selectedOptions[typeOption.title];
          return selectedValue ? `${typeOption.title}: ${selectedValue}` : null;
        })
        .filter(Boolean)
        .join(', ');
    return `${product.name} (${variantDetails})`;
  };

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= availableStock) {
      setQuantity(newQuantity);
    }
  };

  // Handle option change
  const handleOptionChange = (title: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [title]: value }));
    setQuantity(1);
  };

  // Handle review submission
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.warn('Vui lòng đăng nhập để gửi đánh giá!', { position: 'top-right' });
      return;
    }

    if (rating === 0 || !reviewText.trim()) {
      toast.warn('Vui lòng chọn số sao và nhập nội dung đánh giá!', { position: 'top-right' });
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        id_product: id,
        id_user: user.id_user,
        rating,
        content: reviewText,
      };
      await ReviewService.createReview(reviewData);
      toast.success('Đánh giá đã được gửi thành công!', { position: 'top-right' });
      setRating(0);
      setReviewText('');

      // Refresh reviews
      const reviewsData = await ReviewService.getReviewsByProductId(id as string);
      setReviews(reviewsData || []);
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.', { position: 'top-right' });
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle image change
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || availableStock < quantity) {
      toast.error('Không đủ hàng trong kho.', { position: 'top-right' });
      return;
    }

    const cartItem = {
      id: getVariantId(),
      name: getVariantName(),
      price: currentPrice,
      quantity,
      weight: product.weight,
      image: product.images[0] || 'https://via.placeholder.com/300x300?text=No+Image',
    };

    dispatch({
      type: CartActionTypes.ADD_ITEM,
      payload: cartItem,
    });

    toast.success('Đã thêm sản phẩm vào giỏ hàng!', { position: 'top-right' });
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button className="flex items-center text-gray-600 hover:text-gray-900 whitespace-nowrap cursor-pointer">
                <i className="fas fa-arrow-left mr-2"></i>
                Quay lại
              </button>
              <div className="text-sm text-gray-500">
              <span className="breadcrumbs">
                Trang chủ {'>'} {product.category.name} {'>'} {product.name}
              </span>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              <ProductImages
                  images={product.images}
                  currentImageIndex={currentImageIndex}
                  isOrganic={product.organic}
                  productName={product.name}
                  onImageChange={handleImageChange}
              />
              <div className="product-details">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <PriceAndRating
                    currentPrice={currentPrice}
                    averageRating={product.average_rating || 0}
                    reviewCount={reviews.length}
                />
                <ProductOptions
                    stock={availableStock}
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    onClick={handleAddToCart}
                    typeOptions={product.typeOptions}
                    selectedOptions={selectedOptions}
                    onOptionChange={handleOptionChange}
                />
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full text-primary mr-3">
                      <i className="fas fa-box"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Đóng gói</h4>
                      <p className="text-gray-600">{product.packaging}</p>
                    </div>
                  </div>
                  <div className="flex items-start mb-4">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full text-primary mr-3">
                      <i className="fas fa-tag"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Thương hiệu</h4>
                      <p className="text-gray-600">{product.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-full text-primary mr-3">
                      <i className="fas fa-globe"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Xuất xứ</h4>
                      <p className="text-gray-600">{product.origin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Description
                product={product}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />
          </div>
          <br/>
          <RatingSection reviews={reviews} averageRating={product.average_rating || 0} />
          <div className="mt-12">
            <ReviewForm
                rating={rating}
                reviewText={reviewText}
                onRatingChange={setRating}
                onReviewTextChange={setReviewText}
                onSubmit={handleReviewSubmit}
                isSubmitting={isSubmitting} // Pass isSubmitting to ReviewForm
            />
          </div>
        </main>
      </div>
  );
};

export default ProductDetail;