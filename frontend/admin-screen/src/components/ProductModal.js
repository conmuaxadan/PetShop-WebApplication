import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductModal = ({ isOpen, onClose, mode, product, onSave, categories }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        oldPrice: 0,
        description: '',
        category: { id_category: '' },
        images: [],
        typeOptions: [],
        forPet: '',
        organic: false,
        origin: '',
        packaging: '',
        brand: '',
        howToUse: '',
        howToPreserve: '',
        isActive: true,
        weight: 0,
    });
    const [files, setFiles] = useState([]);
    const [filePreviews, setFilePreviews] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mode === 'edit' || mode === 'view') {
            setFormData({
                ...product,
                category: product.category || { id_category: '' },
                typeOptions: product.typeOptions || [],
                images: product.images || [],
            });
        } else {
            setFormData({
                name: '',
                price: 0,
                oldPrice: 0,
                description: '',
                category: { id_category: '' },
                images: [],
                typeOptions: [],
                forPet: '',
                organic: false,
                origin: '',
                packaging: '',
                brand: '',
                howToUse: '',
                howToPreserve: '',
                isActive: true,
                weight: 0,
            });
            setFiles([]);
            setFilePreviews([]);
        }
        setErrors({});
    }, [product, mode]);

    // Clean up file previews to prevent memory leaks
    useEffect(() => {
        return () => {
            filePreviews.forEach((preview) => URL.revokeObjectURL(preview));
        };
    }, [filePreviews]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        console.log('Selected files:', selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
        })));
        setFiles((prev) => [...prev, ...selectedFiles]);
        const previews = selectedFiles.map((file) => URL.createObjectURL(file));
        setFilePreviews((prev) => [...prev, ...previews]);
    };

    const removePreview = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
        setFilePreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const addTypeOption = () => {
        setFormData((prev) => ({
            ...prev,
            typeOptions: [...prev.typeOptions, { title: '', options: [{ value: '', price: 0, stock: 0 }] }],
        }));
    };

    const updateTypeOption = (index, field, value) => {
        setFormData((prev) => {
            const newTypeOptions = [...prev.typeOptions];
            newTypeOptions[index] = { ...newTypeOptions[index], [field]: value };
            return { ...prev, typeOptions: newTypeOptions };
        });
        setErrors((prev) => ({ ...prev, [`typeOption${index}`]: '' }));
    };

    const addOption = (typeIndex) => {
        setFormData((prev) => {
            const newTypeOptions = [...prev.typeOptions];
            newTypeOptions[typeIndex].options = [
                ...newTypeOptions[typeIndex].options,
                { value: '', price: 0, stock: 0 },
            ];
            return { ...prev, typeOptions: newTypeOptions };
        });
    };

    const updateOption = (typeIndex, optionIndex, field, value) => {
        setFormData((prev) => {
            const newTypeOptions = [...prev.typeOptions];
            newTypeOptions[typeIndex].options[optionIndex] = {
                ...newTypeOptions[typeIndex].options[optionIndex],
                [field]: field === 'price' || field === 'stock' ? Number(value) : value,
            };
            return { ...prev, typeOptions: newTypeOptions };
        });
        setErrors((prev) => ({ ...prev, [`option${typeIndex}-${optionIndex}`]: '' }));
    };

    const removeTypeOption = (index) => {
        setFormData((prev) => ({
            ...prev,
            typeOptions: prev.typeOptions.filter((_, i) => i !== index),
        }));
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`typeOption${index}`];
            prev.typeOptions[index].options.forEach((_, i) => {
                delete newErrors[`option${index}-${i}`];
            });
            return newErrors;
        });
    };

    const removeOption = (typeIndex, optionIndex) => {
        setFormData((prev) => {
            const newTypeOptions = [...prev.typeOptions];
            newTypeOptions[typeIndex].options = newTypeOptions[typeIndex].options.filter((_, i) => i !== optionIndex);
            return { ...prev, typeOptions: newTypeOptions };
        });
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[`option${typeIndex}-${optionIndex}`];
            return newErrors;
        });
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Tên sản phẩm là bắt buộc';
        if (formData.price < 0) newErrors.price = 'Giá phải lớn hơn hoặc bằng 0';
        if (!formData.category.id_category) newErrors.category = 'Danh mục là bắt buộc';
        formData.typeOptions.forEach((typeOption, typeIndex) => {
            if (!typeOption.title.trim()) {
                newErrors[`typeOption${typeIndex}`] = 'Tên loại tùy chọn là bắt buộc';
            }
            typeOption.options.forEach((option, optionIndex) => {
                if (!option.value.trim()) {
                    newErrors[`option${typeIndex}-${optionIndex}`] = 'Giá trị tùy chọn là bắt buộc';
                }
                if (option.price < 0) {
                    newErrors[`option${typeIndex}-${optionIndex}`] = 'Giá phải lớn hơn hoặc bằng 0';
                }
                if (option.stock < 0) {
                    newErrors[`option${typeIndex}-${optionIndex}`] = 'Tồn kho phải lớn hơn hoặc bằng 0';
                }
            });
        });
        // Validate files
        files.forEach((file, index) => {
            if (file.size > 5 * 1024 * 1024) {
                newErrors[`file${index}`] = `Hình ảnh ${file.name} vượt quá 5MB`;
            }
            if (!file.type.startsWith('image/')) {
                newErrors[`file${index}`] = `Hình ảnh ${file.name} không phải định dạng ảnh hợp lệ`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Vui lòng kiểm tra lại các trường thông tin', { position: 'top-right' });
            return;
        }
        try {
            const productData = {
                ...formData,
                categoryId: formData.category.id_category,
            };
            await onSave({ productData, files });
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Lỗi khi lưu sản phẩm', { position: 'top-right' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {mode === 'add' ? 'Thêm sản phẩm' : mode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Xem sản phẩm'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Nhập tên sản phẩm"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border rounded-md ${errors.price ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                placeholder="Nhập giá"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Giá cũ</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={formData.oldPrice}
                                onChange={handleInputChange}
                                disabled={mode === 'view'}
                                className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập giá cũ"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mô tả"
                            rows={4}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                        <select
                            name="category.id_category"
                            value={formData.category.id_category}
                            onChange={(e) => {
                                setFormData((prev) => ({ ...prev, category: { id_category: e.target.value } }));
                                setErrors((prev) => ({ ...prev, category: '' }));
                            }}
                            disabled={mode === 'view'}
                            className={`w-full mt-1 p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((cat) => (
                                <option key={cat.id_category} value={cat.id_category}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hình ảnh</label>
                        <p className="text-sm text-gray-500 mb-2">Giữ Ctrl/Cmd hoặc kéo thả để chọn nhiều hình ảnh (tối đa 5MB mỗi ảnh)</p>
                        {formData.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded-md"
                                            onError={(e) => (e.target.src = 'https://placehold.co/64x64')}
                                        />
                                        {mode !== 'view' && (
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                title="Xóa hình ảnh"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {files.length > 0 && (
                            <div className="flex flex-wrap gap-4 mb-4">
                                {files.map((file, index) => (
                                    <div key={index} className="relative flex flex-col items-center">
                                        <img
                                            src={filePreviews[index]}
                                            alt={`Preview ${file.name}`}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <p className="text-xs text-gray-600 mt-1 truncate w-16" title={file.name}>
                                            {file.name}
                                        </p>
                                        {mode !== 'view' && (
                                            <button
                                                type="button"
                                                onClick={() => removePreview(index)}
                                                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                title="Xóa hình ảnh xem trước"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                        {errors[`file${index}`] && (
                                            <p className="text-red-500 text-xs mt-1">{errors[`file${index}`]}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                        {mode !== 'view' && (
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                        )}
                        {files.length > 0 && (
                            <p className="mt-2 text-sm text-gray-600">Đã chọn: {files.length} hình ảnh</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Loại tùy chọn</label>
                        {formData.typeOptions.map((typeOption, typeIndex) => (
                            <div key={typeIndex} className="border p-4 rounded-md mb-4 bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={typeOption.title}
                                        onChange={(e) => updateTypeOption(typeIndex, 'title', e.target.value)}
                                        disabled={mode === 'view'}
                                        className={`flex-1 p-2 border rounded-md ${errors[`typeOption${typeIndex}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        placeholder="Tên loại tùy chọn (e.g., Màu sắc, Kích thước)"
                                    />
                                    {mode !== 'view' && (
                                        <button
                                            type="button"
                                            onClick={() => removeTypeOption(typeIndex)}
                                            className="p-1 text-red-500 hover:text-red-600"
                                            title="Xóa loại tùy chọn"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                {errors[`typeOption${typeIndex}`] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[`typeOption${typeIndex}`]}</p>
                                )}
                                <div className="mt-4 space-y-2">
                                    {typeOption.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={option.value}
                                                onChange={(e) => updateOption(typeIndex, optionIndex, 'value', e.target.value)}
                                                disabled={mode === 'view'}
                                                className={`w-1/3 p-2 border rounded-md ${errors[`option${typeIndex}-${optionIndex}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Giá trị (e.g., Đỏ, Nhỏ)"
                                            />
                                            <input
                                                type="number"
                                                value={option.price}
                                                onChange={(e) => updateOption(typeIndex, optionIndex, 'price', e.target.value)}
                                                disabled={mode === 'view'}
                                                className={`w-1/3 p-2 border rounded-md ${errors[`option${typeIndex}-${optionIndex}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Giá"
                                            />
                                            <input
                                                type="number"
                                                value={option.stock}
                                                onChange={(e) => updateOption(typeIndex, optionIndex, 'stock', e.target.value)}
                                                disabled={mode === 'view'}
                                                className={`w-1/3 p-2 border rounded-md ${errors[`option${typeIndex}-${optionIndex}`] ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                placeholder="Tồn kho"
                                            />
                                            {mode !== 'view' && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(typeIndex, optionIndex)}
                                                    className="p-1 text-red-500 hover:text-red-600"
                                                    title="Xóa tùy chọn"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {errors[`option${typeIndex}-${typeOption.options.length - 1}`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`option${typeIndex}-${typeOption.options.length - 1}`]}</p>
                                    )}
                                    {mode !== 'view' && (
                                        <button
                                            type="button"
                                            onClick={() => addOption(typeIndex)}
                                            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-1" /> Thêm tùy chọn
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {mode !== 'view' && (
                            <button
                                type="button"
                                onClick={addTypeOption}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center text-sm"
                            >
                                <PlusCircle className="w-4 h-4 mr-1" /> Thêm loại tùy chọn
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dành cho thú cưng</label>
                            <input
                                type="text"
                                name="forPet"
                                value={formData.forPet}
                                onChange={handleInputChange}
                                disabled={mode === 'view'}
                                className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập loại thú cưng (e.g., Chó, Mèo)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hữu cơ</label>
                            <div className="mt-2">
                                <input
                                    type="checkbox"
                                    name="organic"
                                    checked={formData.organic}
                                    onChange={handleInputChange}
                                    disabled={mode === 'view'}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">{formData.organic ? 'Có' : 'Không'}</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nguồn gốc</label>
                        <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập nguồn gốc"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Đóng gói</label>
                        <input
                            type="text"
                            name="packaging"
                            value={formData.packaging}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập thông tin đóng gói"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Thương hiệu</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập thương hiệu"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cách sử dụng</label>
                        <textarea
                            name="howToUse"
                            value={formData.howToUse}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập cách sử dụng"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cách bảo quản</label>
                        <textarea
                            name="howToPreserve"
                            value={formData.howToPreserve}
                            onChange={handleInputChange}
                            disabled={mode === 'view'}
                            className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập cách bảo quản"
                            rows={3}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trọng lượng</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                disabled={mode === 'view'}
                                className="w-full mt-1 p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập trọng lượng (kg)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                            <div className="mt-2">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    disabled={mode === 'view'}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">{formData.isActive ? 'Hoạt động' : 'Không hoạt động'}</span>
                            </div>
                        </div>
                    </div>
                    {mode !== 'view' && (
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Lưu
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProductModal;