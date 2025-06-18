import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg relative">
                {children}
            </div>
        </div>
    );
};

const ProfileModal = ({ isOpen, onClose, mode, profile, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            province: '',
            district: '',
            ward: '',
            hamlet: '',
            postalCode: '',
        },
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profile && mode !== 'add') {
            setFormData({
                id_user: profile.id_user || '',
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: {
                    province: profile.address?.province || '',
                    district: profile.address?.district || '',
                    ward: profile.address?.ward || '',
                    hamlet: profile.address?.hamlet || '',
                    postalCode: profile.address?.postalCode || '',
                },
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: {
                    province: '',
                    district: '',
                    ward: '',
                    hamlet: '',
                    postalCode: '',
                },
            });
        }
        setErrors({});
    }, [profile, isOpen, mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData((prevData) => ({
                ...prevData,
                address: {
                    ...prevData.address,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Họ là bắt buộc';
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Tên là bắt buộc';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else {
            // Chuẩn hóa số điện thoại: loại bỏ ký tự không phải số
            const cleanedPhone = formData.phone.replace(/[^\d]/g, '');
            // Nếu bắt đầu bằng +84, bỏ +84 để kiểm tra
            const phoneToValidate = formData.phone.startsWith('+84')
                ? cleanedPhone.slice(2)
                : cleanedPhone;
            if (!/^\d{9,15}$/.test(phoneToValidate)) {
                newErrors.phone = 'Số điện thoại phải có 9-15 chữ số (không tính mã quốc gia)';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (mode === 'view') return;
        if (!validateForm()) return;
        // Chuẩn hóa số điện thoại trước khi lưu (tùy thuộc vào yêu cầu backend)
        const cleanedPhone = formData.phone.startsWith('+84')
            ? formData.phone
            : `+84${formData.phone.replace(/[^\d]/g, '')}`;
        onSave({ ...formData, phone: cleanedPhone });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6 w-[600px] space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {mode === 'add' ? 'Thêm hồ sơ' : mode === 'edit' ? 'Chỉnh sửa hồ sơ' : 'Xem hồ sơ'}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Họ</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                            } rounded`}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tên</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                            } rounded`}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            } rounded`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Số điện thoại</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            } rounded`}
                            placeholder="+84xxxxxxxxx"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Tỉnh/Thành phố</label>
                        <input
                            type="text"
                            name="address.province"
                            value={formData.address.province}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Quận/Huyện</label>
                        <input
                            type="text"
                            name="address.district"
                            value={formData.address.district}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Phường/Xã</label>
                        <input
                            type="text"
                            name="address.ward"
                            value={formData.address.ward}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Thôn/Xóm</label>
                        <input
                            type="text"
                            name="address.hamlet"
                            value={formData.address.hamlet}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium">Mã bưu điện</label>
                        <input
                            type="text"
                            name="address.postalCode"
                            value={formData.address.postalCode}
                            onChange={handleChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border border-gray-300 rounded"
                        />
                    </div>
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

export default ProfileModal;