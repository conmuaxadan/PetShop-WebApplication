import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <img
                                src="https://readdy.ai/api/search-image?query=simple%20minimalist%20pet%20shop%20logo%20with%20orange%20color%20theme%2C%20professional%20design%2C%20clean%20background%2C%20modern%20typography&width=120&height=40&seq=logo2&orientation=landscape"
                                alt="Pet Shop Logo"
                                className="h-10"
                            />
                            <span className="ml-2 font-bold text-orange-500">PET SHOP</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Cửa hàng thú cưng uy tín hàng đầu Việt Nam. Cung cấp đầy đủ sản phẩm và dịch vụ chăm sóc thú cưng chất lượng cao.
                        </p>
                        <div className="flex space-x-3">
                            {[
                                { icon: 'fab fa-facebook-f', href: '#' },
                                { icon: 'fab fa-instagram', href: '#' },
                                { icon: 'fab fa-youtube', href: '#' },
                                { icon: 'fab fa-tiktok', href: '#' },
                            ].map((link) => (
                                <a
                                    key={link.icon}
                                    href={link.href}
                                    className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white transition cursor-pointer"
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Liên hệ</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start">
                                <i className="fas fa-map-marker-alt mt-1 mr-3 text-orange-500"></i>
                                <span>123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-phone-alt mr-3 text-orange-500"></i>
                                <span>+84 123 456 789</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-envelope mr-3 text-orange-500"></i>
                                <span>info@petshop.vn</span>
                            </li>
                            <li className="flex items-center">
                                <i className="fas fa-clock mr-3 text-orange-500"></i>
                                <span>Mở cửa: 8:00 - 22:00 hàng ngày</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Thông tin</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Về chúng tôi', href: '#' },
                                { label: 'Chính sách giao hàng', href: '#' },
                                { label: 'Chính sách bảo mật', href: '#' },
                                { label: 'Điều khoản dịch vụ', href: '#' },
                                { label: 'Chính sách đổi trả', href: '#' },
                                { label: 'Câu hỏi thường gặp', href: '#' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-600 hover:text-orange-500 transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2 text-sm">
                            {[
                                { label: 'Trung tâm hỗ trợ', href: '#' },
                                { label: 'Liên hệ', href: '#' },
                                { label: 'Đặt lịch dịch vụ', href: '#' },
                                { label: 'Theo dõi đơn hàng', href: '#' },
                            ].map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-gray-600 hover:text-orange-500 transition">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <h3 className="font-bold text-gray-800 mt-6 mb-4">Phương thức thanh toán</h3>
                        <div className="flex space-x-3">
                            <i className="fab fa-cc-visa text-2xl text-gray-600"></i>
                            <i className="fab fa-cc-mastercard text-2xl text-gray-600"></i>
                            <i className="fab fa-cc-paypal text-2xl text-gray-600"></i>
                            <i className="fas fa-money-bill-wave text-2xl text-gray-600"></i>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                    <p className="text-center text-sm text-gray-500">
                        © 2025 Pet Shop. Tất cả quyền được bảo lưu.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;