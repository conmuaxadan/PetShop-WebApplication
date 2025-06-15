import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import categoryService from '../service/category-service';
import weightTypeService from '../service/weightType-service';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-[1000px] w-full max-h-[80vh] overflow-y-auto mx-4">
                {children}
            </div>
        </div>
    );
};

const ProductModal = ({ isOpen, onClose, mode, product, onSave }) => {
    const [productData, setProductData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        description: '',
        id_category: '',
        organic: false,
        origin: '',
        packaging: '',
        brand: '',
        howToUse: '',
        howToPreserve: '',
        weightProducts: [],
    });
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [weightTypes, setWeightTypes] = useState([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingWeightTypes, setIsLoadingWeightTypes] = useState(false);

    // Fetch categories and weight types when modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                setIsLoadingCategories(true);
                try {
                    const fetchedCategories = await categoryService.getAllCategories(1, 99999, '');
                    const categoryList = Array.isArray(fetchedCategories.content) ? fetchedCategories.content : [];
                    setCategories(categoryList);
                    console.log('Fetched categories:', categoryList);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                    setCategories([]);
                }
                setIsLoadingCategories(false);
            };

            const fetchWeightTypes = async () => {
                setIsLoadingWeightTypes(true);
                try {
                    const fetchedWeightTypes = await weightTypeService.getAllWeightTypes(1, 99999, '');
                    const weightTypeList = Array.isArray(fetchedWeightTypes.content) ? fetchedWeightTypes.content : [];
                    setWeightTypes(weightTypeList);
                    console.log('Fetched weight types:', weightTypeList);
                } catch (error) {
                    console.error('Error fetching weight types:', error);
                    setWeightTypes([]);
                }
                setIsLoadingWeightTypes(false);
            };

            fetchCategories();
            fetchWeightTypes();
        }
    }, [isOpen]);

    // Initialize product data when product or mode changes
    useEffect(() => {
        if (product && mode !== 'add') {
            setProductData({
                name: product.name || '',
                price: product.price || '',
                oldPrice: product.oldPrice || '',
                description: product.description || '',
                id_category: product.category?.id_category || '',
                organic: product.organic || false,
                origin: product.origin || '',
                packaging: product.packaging || '',
                brand: product.brand || '',
                howToUse: product.howToUse || '',
                howToPreserve: product.howToPreserve || '',
                weightProducts: Array.isArray(product.weightProducts)
                    ? product.weightProducts.map(wp => ({
                        weightType: { id_weight_type: wp.weightType.id_weight_type },
                        stock: wp.stock,
                    }))
                    : [],
            });
            setFile(null);
            setPreview(product.image || null);
            console.log('Initialized productData:', productData);
        } else {
            setProductData({
                name: '',
                price: '',
                oldPrice: '',
                description: '',
                id_category: '',
                organic: false,
                origin: '',
                packaging: '',
                brand: '',
                howToUse: '',
                howToPreserve: '',
                weightProducts: [],
            });
            setFile(null);
            setPreview(null);
        }
        setErrors({});
    }, [product, isOpen, mode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setErrors((prev) => ({ ...prev, image: 'Vui lòng chọn file ảnh' }));
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setErrors((prev) => ({ ...prev, image: 'Kích thước ảnh không quá 5MB' }));
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setErrors((prev) => ({ ...prev, image: '' }));
        }
    };

    const handleCategoryChange = (e) => {
        const id_category = e.target.value;
        setProductData((prevData) => ({
            ...prevData,
            id_category,
        }));
        setErrors((prev) => ({ ...prev, id_category: '' }));
    };

    const handleWeightTypeChange = (weightType, checked) => {
        setProductData((prevData) => {
            let updatedWeightProducts = [...prevData.weightProducts];
            if (checked) {
                if (!updatedWeightProducts.some(wp => wp.weightType.id_weight_type === weightType.id_weight_type)) {
                    updatedWeightProducts.push({
                        weightType: { id_weight_type: weightType.id_weight_type },
                        stock: 0,
                    });
                }
            } else {
                updatedWeightProducts = updatedWeightProducts.filter(
                    wp => wp.weightType.id_weight_type !== weightType.id_weight_type
                );
            }
            return { ...prevData, weightProducts: updatedWeightProducts };
        });
        setErrors((prev) => ({ ...prev, weightProducts: '' }));
    };

    const handleStockChange = (weightTypeId, value) => {
        const stock = value === '' ? '' : Math.max(0, parseInt(value) || 0);
        setProductData((prevData) => ({
            ...prevData,
            weightProducts: prevData.weightProducts.map(wp =>
                wp.weightType.id_weight_type === weightTypeId ? { ...wp, stock } : wp
            ),
        }));
        setErrors((prev) => ({ ...prev, weightProducts: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!productData.name.trim()) {
            newErrors.name = 'Tên sản phẩm là bắt buộc';
        } else if (productData.name.length < 2) {
            newErrors.name = 'Tên sản phẩm phải có ít nhất 2 ký tự';
        }
        if (!productData.price) {
            newErrors.price = 'Giá là bắt buộc';
        } else if (isNaN(productData.price) || productData.price <= 0) {
            newErrors.price = 'Giá phải là số lớn hơn 0';
        }
        if (productData.oldPrice && (isNaN(productData.oldPrice) || productData.oldPrice < 0)) {
            newErrors.oldPrice = 'Giá cũ phải là số không âm';
        }
        if (!productData.id_category) {
            newErrors.id_category = 'Vui lòng chọn danh mục';
        }
        if (productData.weightProducts.length === 0) {
            newErrors.weightProducts = 'Vui lòng chọn ít nhất một loại trọng lượng';
        } else {
            const invalidStock = productData.weightProducts.some(wp => isNaN(wp.stock) || wp.stock < 0);
            if (invalidStock) {
                newErrors.weightProducts = 'Số lượng tồn kho phải là số không âm';
            }
        }
        if (productData.description && productData.description.length > 500) {
            newErrors.description = 'Mô tả không quá 500 ký tự';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (mode === 'view') return;
        if (!validateForm()) return;

        console.log('Submitting productData:', productData, 'File:', file);
        onSave({ productData, file });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {mode === 'add' ? 'Thêm sản phẩm' : mode === 'edit' ? 'Chỉnh sửa sản phẩm' : 'Xem sản phẩm'}
                    </h2>
                    <button onClick={onClose}>
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Basic Info */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    className={`w-full mt-1 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded`}
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            <div className="w-24">
                                <label className="block text-sm font-medium">Hữu cơ</label>
                                <input
                                    type="checkbox"
                                    name="organic"
                                    checked={productData.organic}
                                    onChange={handleChange}
                                    disabled={mode === 'view'}
                                    className="mt-2 h-4 w-4"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Mô tả</label>
                            <textarea
                                name="description"
                                value={productData.description}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded`}
                                rows="3"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Giá sản phẩm</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Giá (VNĐ)</label>
                            <input
                                type="number"
                                name="price"
                                value={productData.price}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded`}
                                min="0"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Giá cũ (VNĐ)</label>
                            <input
                                type="number"
                                name="oldPrice"
                                value={productData.oldPrice}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.oldPrice ? 'border-red-500' : 'border-gray-300'} rounded`}
                                min="0"
                            />
                            {errors.oldPrice && <p className="text-red-500 text-sm mt-1">{errors.oldPrice}</p>}
                        </div>
                    </div>
                </div>

                {/* Category & Weight Types */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Danh mục & Trọng lượng</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Danh mục</label>
                            <select
                                name="id_category"
                                value={productData.id_category}
                                onChange={handleCategoryChange}
                                disabled={mode === 'view' || isLoadingCategories}
                                className={`w-full mt-1 p-2 border ${errors.id_category ? 'border-red-500' : 'border-gray-300'} rounded`}
                            >
                                <option value="">Chọn danh mục</option>
                                {isLoadingCategories ? (
                                    <option disabled>Đang tải danh mục...</option>
                                ) : categories.length === 0 ? (
                                    <option disabled>Không có danh mục</option>
                                ) : (
                                    categories.map((category) => (
                                        <option key={category.id_category} value={category.id_category}>
                                            {category.name}
                                        </option>
                                    ))
                                )}
                            </select>
                            {errors.id_category && <p className="text-red-500 text-sm mt-1">{errors.id_category}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Loại trọng lượng</label>
                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {isLoadingWeightTypes ? (
                                    <p>Đang tải loại trọng lượng...</p>
                                ) : weightTypes.length === 0 ? (
                                    <p>Không có loại trọng lượng</p>
                                ) : (
                                    weightTypes.map((wt) => (
                                        <div key={wt.id_weight_type} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={productData.weightProducts.some(
                                                    wp => wp.weightType.id_weight_type === wt.id_weight_type
                                                )}
                                                onChange={(e) => handleWeightTypeChange(wt, e.target.checked)}
                                                disabled={mode === 'view'}
                                                className="h-4 w-4"
                                            />
                                            <span>{wt.value} {wt.unit}</span>
                                            {productData.weightProducts.some(
                                                wp => wp.weightType.id_weight_type === wt.id_weight_type
                                            ) && (
                                                <input
                                                    type="number"
                                                    value={
                                                        productData.weightProducts.find(
                                                            wp => wp.weightType.id_weight_type === wt.id_weight_type
                                                        )?.stock || ''
                                                    }
                                                    onChange={(e) => handleStockChange(wt.id_weight_type, e.target.value)}
                                                    disabled={mode === 'view'}
                                                    className={`w-20 p-1 border ${errors.weightProducts ? 'border-red-500' : 'border-gray-300'} rounded`}
                                                    min="0"
                                                    placeholder="Số lượng"
                                                />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                            {errors.weightProducts && <p className="text-red-500 text-sm mt-1">{errors.weightProducts}</p>}
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-2">Hình ảnh sản phẩm</h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Hình ảnh</label>
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={mode === 'view'}
                                className="w-full mt-1 p-2 border border-gray-300 rounded"
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                        </div>
                        {preview && (
                            <img src={preview} alt="Product Preview" className="w-24 h-24 object-cover rounded" />
                        )}
                    </div>
                </div>

                {/* Additional Info */}
                <div className="pb-4">
                    <h3 className="text-lg font-semibold mb-2">Thông tin bổ sung</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Xuất xứ</label>
                            <input
                                type="text"
                                name="origin"
                                value={productData.origin}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.origin ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errors.origin && <p className="text-red-500 text-sm mt-1">{errors.origin}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Đóng gói</label>
                            <input
                                type="text"
                                name="packaging"
                                value={productData.packaging}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.packaging ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errors.packaging && <p className="text-red-500 text-sm mt-1">{errors.packaging}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Thương hiệu</label>
                            <input
                                type="text"
                                name="brand"
                                value={productData.brand}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.brand ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cách sử dụng</label>
                            <input
                                type="text"
                                name="howToUse"
                                value={productData.howToUse}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.howToUse ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errors.howToUse && <p className="text-red-500 text-sm mt-1">{errors.howToUse}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Cách bảo quản</label>
                            <input
                                type="text"
                                name="howToPreserve"
                                value={productData.howToPreserve}
                                onChange={handleChange}
                                disabled={mode === 'view'}
                                className={`w-full mt-1 p-2 border ${errors.howToPreserve ? 'border-red-500' : 'border-gray-300'} rounded`}
                            />
                            {errors.howToPreserve && <p className="text-red-500 text-sm mt-1">{errors.howToPreserve}</p>}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
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

export default ProductModal;