import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductCard from '../components/home/ProductCard';
import CategoryCard from '../components/home/CategoryCard';
import categoryService from '../services/category-service';
import productService from '../services/product-service';

// Define interfaces based on API response
interface Category {
    id_category: number;
    name: string;
    image?: string;
    description?: string;
}

interface Product {
    id_product: number;
    name: string;
    price: number;
    images: string[]; // Changed to array to match API
    average_rating?: number;
    description?: string;
    forPet?: string;
}

const Home: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [petTypeSlide, setPetTypeSlide] = useState(0);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const handleSlideChange = (index: number) => {
        setCurrentSlide(index);
    };

    const handlePetTypeSlideChange = (index: number) => {
        setPetTypeSlide(index);
    };

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories
                const categoryResult = await categoryService.getAllCategories(1, 10);
                const fetchedCategories: Category[] = categoryResult.content.map((cat: any) => ({
                    id_category: cat.id_category,
                    name: cat.name,
                    image: cat.image || '/default-category.jpg', // Fallback image
                    description: cat.description || 'Danh mục sản phẩm',
                }));
                setCategories(fetchedCategories);

                // Fetch products
                const productResult: any = await productService.getFilteredProducts({ limit: 8, page: 1 });
                const fetchedProducts: Product[] = productResult.elements.map((product: any) => ({
                    id_product: product.id_product,
                    name: product.name,
                    price: product.price,
                    images: product.images || [], // Ensure images is an array
                    average_rating: product.average_rating || 0,
                    description: product.description,
                    forPet: product.forPet,
                }));
                setProducts(fetchedProducts);
            } catch (error: any) {
                console.error('Error fetching home data:', error);
                toast.error('Không thể tải dữ liệu trang chủ. Vui lòng thử lại.', {
                    position: 'top-right',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Background color mapping for Vietnamese category names
    const getCategoryBgColor = (name: string): string => {
        const bgColorMap: { [key: string]: string } = {
            'Thức ăn cho chó': 'bg-orange-50',
            'Thức ăn cho mèo': 'bg-blue-50',
            'Phụ kiện': 'bg-blue-100',
            'Vật dụng': 'bg-gray-50',
            'Sức khỏe': 'bg-green-50',
        };
        return bgColorMap[name] || 'bg-gray-50';
    };

    // Skeleton loader component
    const SkeletonCard = () => (
        <div className="animate-pulse bg-gray-100 p-4 rounded-lg">
            <div className="h-40 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-50 to-orange-100 overflow-hidden">
                <div className="container mx-auto px-4 py-16 flex items-center">
                    <div className="w-full md:w-1/2 z-10">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                            Cửa hàng thú cưng có mọi thứ bạn cần
                        </h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Chúng tôi cung cấp đầy đủ sản phẩm chất lượng cao cho thú cưng của bạn, từ thức ăn, đồ chơi đến các dịch vụ chăm sóc.
                        </p>
                        <Link to="/productList">
                            <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-600 transition cursor-pointer">
                                Mua ngay
                            </button>
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2">
                        <img
                            src="https://readdy.ai/api/search-image?query=cute%20pets%20silhouette%20on%20orange%20background%2C%20minimalist%20design%2C%20modern%20illustration%20showing%20a%20dog%20and%20cat%20silhouette%2C%20clean%20professional%20design%20for%20pet%20shop%20hero%20banner&width=700&height=500&seq=hero1&orientation=landscape"
                            alt="Pet Shop Hero"
                            className="h-full w-full object-cover object-top"
                        />
                    </div>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlideChange(index)}
                                className={`h-3 w-3 rounded-full ${currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'} cursor-pointer`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Duyệt theo danh mục</h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center text-gray-600">Không có danh mục nào để hiển thị.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id_category}
                                name={category.name}
                                description={category.description || 'Danh mục sản phẩm'}
                                image={category.image}
                                bgColor={getCategoryBgColor(category.name)} // Pass bgColor to CategoryCard
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Featured Banner */}
            <div className="bg-orange-50 py-12 my-8">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <img
                            src="https://readdy.ai/api/search-image?query=smart%20pet%20shopping%20concept%20illustration%2C%20minimalist%20design%20with%20pet%20silhouettes%20on%20orange%20background%2C%20modern%20digital%20pet%20shop%20concept%2C%20clean%20professional%20design&width=500&height=400&seq=banner1&orientation=landscape"
                            alt="Smart Shopping"
                            className="max-w-full h-auto rounded-lg"
                        />
                    </div>
                    <div className="md:w-1/2 md:pl-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Cách thông minh hơn để mua sắm cho thú cưng của bạn
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Đặt hàng dễ dàng và giao hàng nhanh chóng đến tận nhà bạn.
                        </p>
                        <button className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition cursor-pointer">
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>

            {/* Best Sellers */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Sản phẩm bán chạy</h2>
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-600">Không có sản phẩm nào để hiển thị.</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id_product}
                                id={product.id_product.toString()}
                                title={product.name}
                                imageSrc={product.images[0] || '/default-product.jpg'} // Fallback image
                                imageAlt={product.name}
                                rating={product.average_rating || 4.5}
                                price={product.price}
                                description={product.description}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Shop by Pet Type */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Mua sắm theo thú cưng</h2>
                    <div className="flex space-x-2">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePetTypeSlideChange(index)}
                                className={`h-3 w-3 rounded-full ${petTypeSlide === index ? 'bg-orange-500' : 'bg-gray-300'} cursor-pointer`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {[
                        { icon: 'fas fa-cat', label: 'Mèo' },
                        { icon: 'fas fa-paw', label: 'Hamster' },
                        { icon: 'fas fa-dog', label: 'Chó' },
                        { icon: 'fas fa-crow', label: 'Vẹt' },
                        { icon: 'fas fa-kiwi-bird', label: 'Thỏ' },
                        { icon: 'fas fa-fish', label: 'Rùa' },
                    ].map((pet) => (
                        <div key={pet.label} className="flex flex-col items-center cursor-pointer hover:text-orange-500 transition">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                                <i className={`${pet.icon} text-2xl text-orange-500`}></i>
                            </div>
                            <span className="text-sm font-medium">{pet.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;