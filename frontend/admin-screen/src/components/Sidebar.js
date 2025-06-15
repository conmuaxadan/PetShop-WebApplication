// src/components/Sidebar.js
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Package, Shield, User, Settings, LogOut, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Trang chủ', path: '/dashboard' },
    { icon: Users, label: 'Quản lý gười dùng', path: '/users-management' },
    { icon: Shield, label: 'Quản lý phân quyền', path: '/roles-management' },
    { icon: ShoppingBag, label: 'Quản lý sản phẩm', path: '/products-management' },
    { icon: Package, label: 'Quản lý đơn hàng', path: '/orders-management' },
    { icon: User, label: 'Quản lý hồ sơ', path: '/profile-management' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Đăng xuất thành công', { position: 'top-right' });
      navigate('/login');
    } catch (error) {
      toast.error('Lỗi đăng xuất', { position: 'top-right' });
    }
  };

  const handleLogin = () => {
    navigate('/login');
    setIsSettingsOpen(false); // Đóng dropdown sau khi chuyển hướng
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
      <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-600">AgriFruit</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
              <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                      `flex items-center p-3 rounded-lg mb-2 transition-colors ${
                          isActive ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
                      }`
                  }
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
          ))}
          <div className="relative">
            <button
                onClick={toggleSettingsDropdown}
                className={`flex items-center p-3 rounded-lg mb-2 w-full text-left transition-colors ${
                    isSettingsOpen ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span>Cài đặt</span>
            </button>
            {isSettingsOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white rounded-lg shadow-lg border z-10">
                  {user ? (
                      <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="w-5 h-5 mr-2" />
                        Đăng xuất
                      </button>
                  ) : (
                      <button
                          onClick={handleLogin}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <LogIn className="w-5 h-5 mr-2" />
                        Đăng nhập
                      </button>
                  )}
                </div>
            )}
          </div>
        </nav>
      </div>
  );
};

export default Sidebar;