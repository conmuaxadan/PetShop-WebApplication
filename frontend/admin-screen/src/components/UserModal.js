import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import roleService from '../service/role-service';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded shadow-lg relative">{children}</div>
      </div>
  );
};

const UserModal = ({ isOpen, onClose, mode, user, onSave }) => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    roles: [], // Lưu trữ mảng các đối tượng Role, chỉ có name
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [roles, setRoles] = useState([]); // Lưu trữ danh sách vai trò từ API
  const [isLoadingRoles, setIsLoadingRoles] = useState(false); // Trạng thái tải vai trò

  // Lấy danh sách vai trò khi modal mở
  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        setIsLoadingRoles(true);
        try {
          const fetchedRoles = await roleService.getAllRoles(1, 99999, '');
          console.log('Danh sách vai trò từ API:', fetchedRoles); // Ghi log để kiểm tra
          // Đảm bảo roles là mảng từ content
          const roleList = Array.isArray(fetchedRoles.content) ? fetchedRoles.content : [];
          setRoles(roleList);
          console.log('Đã lưu danh sách vai trò:', roleList); // Ghi log để kiểm tra
        } catch (error) {
          console.error('Lỗi khi lấy vai trò:', error);
          setRoles([]);
        }
        setIsLoadingRoles(false);
      };
      fetchRoles();
    }
  }, [isOpen]);

  // Khởi tạo dữ liệu người dùng khi user hoặc mode thay đổi
  useEffect(() => {
    if (user && mode !== 'add') {
      const userRoles = Array.isArray(user.roles)
          ? user.roles.map((role) =>
              typeof role === 'string' ? { name: role } : { name: role.name }
          )
          : [];
      setUserData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        roles: userRoles,
      });
      setFile(null);
      setPreview(user.avatar ? `${user.avatar}` : null);
      console.log('Khởi tạo userData:', { ...userData, roles: userRoles }); // Ghi log để kiểm tra
    } else {
      setUserData({
        username: '',
        email: '',
        password: '',
        roles: [],
      });
      setFile(null);
      setPreview(null);
    }
    setErrors({});
  }, [user, isOpen, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, avatar: 'Vui lòng chọn file ảnh' }));
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, avatar: 'Kích thước ảnh không quá 5MB' }));
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setErrors((prev) => ({ ...prev, avatar: '' }));
    }
  };

  const handleRolesChange = (e) => {
    const selectedRoleNames = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log('Tên vai trò được chọn:', selectedRoleNames); // Ghi log để kiểm tra
    // Ánh xạ tên vai trò được chọn thành đối tượng Role
    const selectedRoles = roles.filter((role) => selectedRoleNames.includes(role.name));
    console.log('Vai trò được chọn:', selectedRoles); // Ghi log để kiểm tra
    setUserData((prevData) => {
      const updatedData = {
        ...prevData,
        roles: selectedRoles,
      };
      console.log('Cập nhật userData.roles:', updatedData); // Ghi log để kiểm tra
      return updatedData;
    });
    setErrors((prev) => ({ ...prev, roles: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userData.username.trim()) {
      newErrors.username = 'Tên người dùng là bắt buộc';
    } else if (userData.username.length < 4) {
      newErrors.username = 'Tên người dùng phải có ít nhất 4 ký tự';
    }
    if (!userData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/^\S+@\S+\.\S+$/.test(userData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (mode === 'add' && !userData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (mode === 'add' && userData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (userData.roles.length === 0) {
      newErrors.roles = 'Vui lòng chọn ít nhất một vai trò';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (mode === 'view') return;
    if (!validateForm()) return;

    console.log('Gửi userData:', userData); // Ghi log để kiểm tra
    onSave({
      id_user: user?.id_user || undefined,
      userData,
      file,
    });
    onClose();
  };

  return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="p-6 w-[600px] space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {mode === 'add' ? 'Thêm người dùng' : mode === 'edit' ? 'Chỉnh sửa người dùng' : 'Xem người dùng'}
            </h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tên người dùng</label>
              <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className={`w-full mt-1 p-2 border ${
                      errors.username ? 'border-red-500' : 'border-gray-300'
                  } rounded`}
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={mode === 'view'}
                  className={`w-full mt-1 p-2 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            {mode === 'add' && (
                <div>
                  <label className="block text-sm font-medium">Mật khẩu</label>
                  <input
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      className={`w-full mt-1 p-2 border ${
                          errors.password ? 'border-red-500' : 'border-gray-300'
                      } rounded`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
            )}
            <div>
              <label className="block text-sm font-medium">Avatar</label>
              <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={mode === 'view'}
                  className="w-full mt-1 p-2 border border-gray-300 rounded"
              />
              {preview && (
                  <img src={preview} alt="Avatar Preview" className="mt-2 w-24 h-24 object-cover rounded" />
              )}
              {errors.avatar && <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Vai trò</label>
              <select
                  multiple
                  name="roles"
                  value={userData.roles.map((role) => role.name)} // Bind với name của vai trò
                  onChange={handleRolesChange}
                  onClick={() => console.log('Dropdown được click, giá trị hiện tại:', userData.roles.map((role) => role.name))} // Ghi log để kiểm tra
                  disabled={mode === 'view' || isLoadingRoles}
                  className={`w-full mt-1 p-2 border ${
                      errors.roles ? 'border-red-500' : 'border-gray-300'
                  } rounded h-24`}
              >
                {isLoadingRoles ? (
                    <option disabled>Đang tải vai trò...</option>
                ) : !Array.isArray(roles) || roles.length === 0 ? (
                    <option disabled>Không có vai trò nào</option>
                ) : (
                    roles.map((role) => (
                        <option key={role.name} value={role.name}>
                          {role.name === 'USER_ROLE' ? 'Người dùng' : role.name === 'ADMIN_ROLE' ? 'Quản trị viên' : role.name}
                        </option>
                    ))
                )}
              </select>
              {errors.roles && <p className="text-red-500 text-sm mt-1">{errors.roles}</p>}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            {mode !== 'view' && (
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
            )}
          </div>
        </div>
      </Modal>
  );
};

export default UserModal;