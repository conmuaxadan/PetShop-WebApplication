import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import permissionService from '../service/permission-service';
import { toast } from 'react-toastify';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg relative">
                <button onClick={onClose} className="absolute top-2 right-2">
                    <X className="w-5 h-5 text-gray-500" />
                </button>
                {children}
            </div>
        </div>
    );
};

const RoleModal = ({ isOpen, onClose, mode, role, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'active',
        permissions: [], // Stores [{ name }, ...]
    });
    const [errors, setErrors] = useState({});
    const [availablePermissions, setAvailablePermissions] = useState([]); // Lưu quyền từ API
    const [loading, setLoading] = useState(false); // Trạng thái tải quyền

    // Fetch permissions từ API khi modal mở
    useEffect(() => {
        if (isOpen) {
            const fetchPermissions = async () => {
                setLoading(true);
                try {
                    const response = await permissionService.getAllPermissions(1, 100); // Lấy tối đa 100 quyền
                    const permissions = response.content.map((perm) => ({ name: perm.name }));
                    setAvailablePermissions(permissions);
                } catch (error) {
                    // Lỗi đã được xử lý trong PermissionService (hiển thị toast)
                    setAvailablePermissions([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchPermissions();
        }
    }, [isOpen]);

    // Cập nhật formData khi role hoặc isOpen thay đổi
    useEffect(() => {
        if (role) {
            setFormData({
                id: role.id || '',
                name: role.name || '',
                description: role.description || '',
                status: role.status || 'active',
                permissions: role.permissions.map((p) => ({ name: p.name || p })) || [],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                status: 'active',
                permissions: [],
            });
        }
        setErrors({});
    }, [role, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handlePermissionChange = (permission) => {
        setFormData((prevData) => {
            const permissions = prevData.permissions.find((p) => p.name === permission.name)
                ? prevData.permissions.filter((p) => p.name !== permission.name)
                : [...prevData.permissions, { name: permission.name }];
            return { ...prevData, permissions };
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Tên vai trò là bắt buộc';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (mode === 'view') return;
        if (!validateForm()) return;
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 space-y-4 w-[500px]">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold">
                        {mode === 'add' ? 'Thêm vai trò' : mode === 'edit' ? 'Chỉnh sửa vai trò' : 'Xem vai trò'}
                    </h2>
                </div>
                <div>
                    <label className="block text-sm font-medium">Tên vai trò</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className={`w-full mt-2 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium">Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        disabled={mode === 'view'}
                        className="w-full mt-2 p-2 border border-gray-300 rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Quyền hạn</label>
                    {loading ? (
                        <p className="text-gray-500 mt-2">Đang tải quyền...</p>
                    ) : availablePermissions.length === 0 ? (
                        <p className="text-red-500 mt-2">Không có quyền nào khả dụng</p>
                    ) : (
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                            {availablePermissions.map((permission) => (
                                <div key={permission.name} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`permission-${permission.name}`}
                                        checked={formData.permissions.some((p) => p.name === permission.name)}
                                        onChange={() => handlePermissionChange(permission)}
                                        disabled={mode === 'view'}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={`permission-${permission.name}`}
                                           className="ml-2 text-sm text-gray-600 break-words">
                                        {permission.name}
                                    </label>
                                </div>
                            ))}
                        </div>

                    )}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    {mode !== 'view' && (
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Lưu
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default RoleModal;