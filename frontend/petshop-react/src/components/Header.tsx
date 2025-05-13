import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DropdownAccount from '../components/other/DropdownAccount';
import { useCart } from '../context/CartContext'; // Import useCart

const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { getTotalQuantity } = useCart(); // Access getTotalQuantity

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
                    <div className="flex items-center">
                        <i className="fas fa-phone-alt text-gray-600 mr-2"></i>
                        <span>+84 123 456 789</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-map-marker-alt text-gray-600 mr-2"></i>
                        <span>Tìm cửa hàng gần bạn</span>
                    </div>
                </div>
                <div className="flex items-center justify-between py-4">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold text-orange-500 flex items-center">
                            <img
                                src="https://readdy.ai/api/search-image?query=simple%20minimalist%20pet%20shop%20logo%20with%20orange%20color%20theme%2C%20professional%20design%2C%20clean%20background%2C%20modern%20typography&width=120&height=40&seq=logo1&orientation=landscape"
                                alt="Pet Shop Logo"
                                className="h-10"
                            />
                            <span className="ml-2">PET SHOP</span>
                        </Link>
                    </div>
                    <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                        <Link to="/productList" className="hover:text-orange-500 whitespace-nowrap">
                            SẢN PHẨM
                        </Link>
                        {['ĐIỄN DÀN', 'BÀI ĐĂNG', 'GIỚI THIỆU', 'LIÊN HỆ'].map((item) => (
                            <a key={item} href="#" className="hover:text-orange-500 whitespace-nowrap">
                                {item}
                            </a>
                        ))}
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition cursor-pointer">
                            KHUYẾN MÃI
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm w-48 focus:outline-none focus:border-orange-500"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div ref={dropdownRef} className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="text-gray-700 hover:text-orange-500 cursor-pointer"
                                >
                                    <i className="far fa-user text-xl"></i>
                                </button>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 z-50">
                                        <DropdownAccount />
                                    </div>
                                )}
                            </div>
                            <Link to="/wishlist" className="text-gray-700 hover:text-orange-500 cursor-pointer">
                                <i className="far fa-heart text-xl"></i>
                            </Link>
                            <Link to="/cart" className="text-gray-700 hover:text-orange-500 relative cursor-pointer">
                                <i className="fas fa-shopping-cart text-xl"></i>
                                {getTotalQuantity() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {getTotalQuantity()}
                  </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;