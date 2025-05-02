import React, { useState, useEffect } from 'react';
import ProductService from '../services/product-service.tsx';
import { useCart} from '../context/CartContext';
import type { CartItem} from '../context/CartContext';
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  petType: string;
  brand: string;
  images: string[];
  weight?: number;
}

const DEFAULT_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

const Toast: React.FC<{ message: string; isVisible: boolean; onClose: () => void }> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
          <i className="fas fa-times"></i>
        </button>
      </div>
  );
};

const ProductList: React.FC = () => {
  const { cart, dispatch, getTotalQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPetType, setSelectedPetType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({ message: '', isVisible: false });

  const brands = [
    'Royal Canin', 'Whiskas', 'Pedigree', 'Purina', "Hill's",
    'Kong', 'Furminator', 'PetWell', 'Petstages', 'Hartz',
  ];

  const petTypes = [
    { value: 'Chó', label: 'Chó' },
    { value: 'Mèo', label: 'Mèo' },
    { value: 'Other', label: 'Khác' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: any = await ProductService.getFilteredProducts({
          category: selectedCategory,

            petTypes: selectedPetType,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            brands: selectedBrands,
            sort: sortOption,
            page: currentPage,
            limit: itemsPerPage,
      });
        console.log(response.elements)
        setProducts(response.elements);
        setTotal(response.total);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError('Không thể tải sản phẩm. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedPetType, priceRange, selectedBrands, sortOption, currentPage, itemsPerPage]);

  const addToCart = (product: Product) => {
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ,
      weight: product.weight || 0,
    };

    dispatch({
      type: 'ADD_ITEM',
      payload: cartItem,
    });

    setToast({ message: `${product.name} đã được thêm vào giỏ hàng!`, isVisible: true });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePetTypeChange = (type: string) => {
    if (selectedPetType.includes(type)) {
      setSelectedPetType(selectedPetType.filter(item => item !== type));
    } else {
      setSelectedPetType([...selectedPetType, type]);
    }
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(item => item !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    setCurrentPage(1);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(e.target.value);
    if (index === 0) {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
    setCurrentPage(1);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  return (
      <div className="min-h-screen bg-white flex flex-col">
        <Toast message={toast.message} isVisible={toast.isVisible} onClose={closeToast} />

        <main className="pt-16">
          <div className="bg-gray-100 py-3 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="flex items-center text-sm text-gray-600">
                <a href="#" className="hover:text-orange-600 transition-colors">Trang chủ</a>
                <i className="fas fa-chevron-right text-xs mx-2"></i>
                <span className="text-orange-600">Sản phẩm</span>
              </div>
            </div>
          </div>

          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                  <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">Bộ lọc sản phẩm</h2>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Danh mục sản phẩm</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                              type="radio"
                              id="cat-all"
                              name="category"
                              checked={selectedCategory === "all"}
                              onChange={() => handleCategoryChange("all")}
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <label htmlFor="cat-all" className="ml-2 text-gray-700 cursor-pointer">Tất cả sản phẩm</label>
                        </div>
                        <div className="flex items-center">
                          <input
                              type="radio"
                              id="cat-food"
                              name="category"
                              checked={selectedCategory === "food"}
                              onChange={() => handleCategoryChange("food")}
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <label htmlFor="cat-food" className="ml-2 text-gray-700 cursor-pointer">Thức ăn</label>
                        </div>
                        <div className="flex items-center">
                          <input
                              type="radio"
                              id="cat-accessories"
                              name="category"
                              checked={selectedCategory === "accessories"}
                              onChange={() => handleCategoryChange("accessories")}
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <label htmlFor="cat-accessories" className="ml-2 text-gray-700 cursor-pointer">Phụ kiện</label>
                        </div>
                        <div className="flex items-center">
                          <input
                              type="radio"
                              id="cat-healthcare"
                              name="category"
                              checked={selectedCategory === "healthcare"}
                              onChange={() => handleCategoryChange("healthcare")}
                              className="w-4 h-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                          />
                          <label htmlFor="cat-healthcare" className="ml-2 text-gray-700 cursor-pointer">Chăm sóc sức khỏe</label>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Loại thú cưng</h3>
                      <div className="space-y-2">
                        {petTypes.map(pet => (
                            <div key={pet.value} className="flex items-center">
                              <input
                                  type="checkbox"
                                  id={`pet-${pet.value}`}
                                  checked={selectedPetType.includes(pet.value)}
                                  onChange={() => handlePetTypeChange(pet.value)}
                                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <label htmlFor={`pet-${pet.value}`} className="ml-2 text-gray-700 cursor-pointer">{pet.label}</label>
                            </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Khoảng giá</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="min-price" className="block text-sm text-gray-600 mb-1">Giá tối thiểu: {priceRange[0].toLocaleString()} ₫</label>
                          <input
                              type="range"
                              id="min-price"
                              min="0"
                              max="1000000"
                              step="10000"
                              value={priceRange[0]}
                              onChange={(e) => handlePriceChange(e, 0)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label htmlFor="max-price" className="block text-sm text-gray-600 mb-1">Giá tối đa: {priceRange[1].toLocaleString()} ₫</label>
                          <input
                              type="range"
                              id="max-price"
                              min="0"
                              max="1000000"
                              step="10000"
                              value={priceRange[1]}
                              onChange={(e) => handlePriceChange(e, 1)}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-semibold mb-3">Thương hiệu</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {brands.map(brand => (
                            <div key={brand} className="flex items-center">
                              <input
                                  type="checkbox"
                                  id={`brand-${brand}`}
                                  checked={selectedBrands.includes(brand)}
                                  onChange={() => handleBrandChange(brand)}
                                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                              />
                              <label htmlFor={`brand-${brand}`} className="ml-2 text-gray-700 cursor-pointer">{brand}</label>
                            </div>
                        ))}
                      </div>
                    </div>

                    <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedPetType([]);
                          setPriceRange([0, 1000000]);
                          setSelectedBrands([]);
                          setCurrentPage(1);
                        }}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>

                <div className="lg:w-3/4">
                  <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <span className="text-gray-600 whitespace-nowrap">Hiển thị:</span>
                      <select
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-4 w-full sm:w-auto">
                      <span className="text-gray-600 whitespace-nowrap">Sắp xếp theo:</span>
                      <select
                          value={sortOption}
                          onChange={(e) => handleSortChange(e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                      >
                        <option value="newest">Mới nhất</option>
                        <option value="price-asc">Giá tăng dần</option>
                        <option value="price-desc">Giá giảm dần</option>
                        <option value="bestseller">Bán chạy</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => handleViewModeChange('grid')}
                          className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'} cursor-pointer`}
                      >
                        <i className="fas fa-th-large"></i>
                      </button>
                      <button
                          onClick={() => handleViewModeChange('list')}
                          className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'} cursor-pointer`}
                      >
                        <i className="fas fa-list"></i>
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600">
                      Hiển thị {products ? products.length : 0} trên {total} sản phẩm
                      {' '} | Giỏ hàng: {getTotalQuantity()} sản phẩm
                    </p>
                  </div>

                  {loading ? (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <i className="fas fa-spinner fa-spin text-orange-600 text-5xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">Đang tải sản phẩm...</h3>
                      </div>
                  ) : error ? (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <i className="fas fa-exclamation-circle text-red-600 text-5xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">Lỗi</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => {
                              setSelectedCategory('all');
                              setSelectedPetType([]);
                              setPriceRange([0, 1000000]);
                              setSelectedBrands([]);
                              setCurrentPage(1);
                            }}
                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Xóa bộ lọc và thử lại
                        </button>
                      </div>
                  ) : products.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <i className="fas fa-search text-gray-400 text-5xl mb-4"></i>
                        <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                        <p className="text-gray-600 mb-4">Không có sản phẩm nào phù hợp với bộ lọc của bạn.</p>
                        <button
                            onClick={() => {
                              setSelectedCategory('all');
                              setSelectedPetType([]);
                              setPriceRange([0, 1000000]);
                              setSelectedBrands([]);
                              setCurrentPage(1);
                            }}
                            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          Xóa bộ lọc
                        </button>
                      </div>
                  ) : (
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-6'}>
                        {products.map(product => (
                            viewMode === 'grid' ? (
                                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                  <div className="h-64 overflow-hidden">
                                    <img
                                        src={product.images  ? product.images[0] : DEFAULT_IMAGE}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                    <div className="flex justify-between items-center mb-4">
                                      <span className="text-orange-600 font-bold">{product.price.toLocaleString()} ₫</span>
                                      <span className="text-gray-500 line-through text-sm">
                                {(product.price * 1.1).toLocaleString()} ₫
                              </span>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition-colors flex items-center justify-center whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-shopping-cart mr-2"></i>
                                      Thêm vào giỏ
                                    </button>
                                  </div>
                                </div>
                            ) : (
                                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row">
                                  <div className="sm:w-1/3 h-64 sm:h-auto overflow-hidden">
                                    <img
                                        src={product.images && product.images.length > 0 ? product.images[0] : DEFAULT_IMAGE}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                  <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                      <p className="text-gray-600 mb-4">Thương hiệu: {product.brand}</p>
                                      <div className="flex items-center mb-4">
                                        <span className="text-orange-600 font-bold text-xl mr-3">{product.price.toLocaleString()} ₫</span>
                                        <span className="text-gray-500 line-through">{product.originalPrice.toLocaleString()} ₫</span>
                                      </div>
                                    </div>
                                    <button
                                        onClick={() => addToCart(product)}
                                        className="bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition-colors flex items-center justify-center sm:w-1/2 whitespace-nowrap cursor-pointer"
                                    >
                                      <i className="fas fa-shopping-cart mr-2"></i>
                                      Thêm vào giỏ
                                    </button>
                                  </div>
                                </div>
                            )
                        ))}
                      </div>
                  )}

                  {totalPages > 1 && (
                      <div className="mt-8 flex justify-center">
                        <div className="flex items-center space-x-1">
                          <button
                              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                              disabled={currentPage === 1}
                              className={`px-3 py-1 rounded-l-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}`}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </button>

                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                  key={page}
                                  onClick={() => handlePageChange(page)}
                                  className={`px-3 py-1 ${currentPage === page ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} cursor-pointer`}
                              >
                                {page}
                              </button>
                          ))}

                          <button
                              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                              disabled={currentPage === totalPages}
                              className={`px-3 py-1 rounded-r-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer'}`}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
  );
};

export default ProductList;