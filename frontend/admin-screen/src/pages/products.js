import React, { useState, useEffect } from 'react';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  X,
  RotateCcw,
} from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import DataTable from '../components/DataTable';
import ProductModal from '../components/ProductModal';
import categoryService from '../service/category-service';
import productServiceClass from '../service/product-service';
import weightTypeService from '../service/weightType-service';
import Badge from '../ui/badge';
import {useNavigate} from "react-router-dom";

const CategoryModal = ({ isOpen, onClose, onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        setLoading(true);
        try {
          const response = await categoryService.getAllCategories(1, 99999, '');
          setCategories(response.content || []);
        } catch (error) {
          toast.error('Lỗi khi tải danh mục', { position: 'top-right' });
        }
        setLoading(false);
      };
      fetchCategories();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Tên danh mục là bắt buộc');
      return;
    }
    setLoading(true);
    try {
      const newCategory = await categoryService.createCategory(name);
      if (newCategory) {
        setCategories([...categories, newCategory]);
        setName('');
        setError('');
        onCategoryCreated(newCategory);
      }
    } catch (error) {
      setError('Lỗi khi tạo danh mục');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quản lý danh mục</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Tên danh mục</label>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className={`w-full mt-1 p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded`}
                  placeholder="Nhập tên danh mục"
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Thêm danh mục
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Danh sách danh mục</h3>
            {loading ? (
                <p>Đang tải...</p>
            ) : categories.length === 0 ? (
                <p>Không có danh mục</p>
            ) : (
                <table className="w-full border-collapse">
                  <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Tên danh mục</th>
                  </tr>
                  </thead>
                  <tbody>
                  {categories.map((category) => (
                      <tr key={category.id_category} className="border-b">
                        <td className="border p-2">{category.id_category}</td>
                        <td className="border p-2">{category.name}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
  );
};

const WeightTypeModal = ({ isOpen, onClose, onWeightTypeCreated }) => {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [errors, setErrors] = useState({});
  const [weightTypes, setWeightTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchWeightTypes = async () => {
        setLoading(true);
        try {
          const response = await weightTypeService.getAllWeightTypes(1, 99999, '');
          setWeightTypes(response.content || []);
        } catch (error) {
          toast.error('Lỗi khi tải loại trọng lượng', { position: 'top-right' });
        }
        setLoading(false);
      };
      fetchWeightTypes();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const newErrors = {};
    if (!value || isNaN(value) || value <= 0) {
      newErrors.value = 'Giá trị phải là số lớn hơn 0';
    }
    if (!unit.trim()) {
      newErrors.unit = 'Đơn vị là bắt buộc';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const newWeightType = await weightTypeService.createWeightType(parseFloat(value), unit);
      if (newWeightType) {
        setWeightTypes([...weightTypes, newWeightType]);
        setValue('');
        setUnit('');
        setErrors({});
        onWeightTypeCreated(newWeightType);
      }
    } catch (error) {
      setErrors({ general: 'Lỗi khi tạo loại trọng lượng' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-[800px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Quản lý loại trọng lượng</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Giá trị</label>
                <input
                    type="number"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setErrors((prev) => ({ ...prev, value: '' }));
                    }}
                    className={`w-full mt-1 p-2 border ${errors.value ? 'border-red-500' : 'border-gray-300'} rounded`}
                    placeholder="Nhập giá trị (e.g., 1)"
                    min="0"
                    step="0.01"
                />
                {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">Đơn vị</label>
                <input
                    type="text"
                    value={unit}
                    onChange={(e) => {
                      setUnit(e.target.value);
                      setErrors((prev) => ({ ...prev, unit: '' }));
                    }}
                    className={`w-full mt-1 p-2 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded`}
                    placeholder="Nhập đơn vị (e.g., kg)"
                />
                {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
              </div>
            </div>
            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Thêm loại trọng lượng
            </button>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Danh sách loại trọng lượng</h3>
            {loading ? (
                <p>Đang tải...</p>
            ) : weightTypes.length === 0 ? (
                <p>Không có loại trọng lượng</p>
            ) : (
                <table className="w-full border-collapse">
                  <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Giá trị</th>
                    <th className="border p-2 text-left">Đơn vị</th>
                  </tr>
                  </thead>
                  <tbody>
                  {weightTypes.map((wt) => (
                      <tr key={wt.id_weight_type} className="border-b">
                        <td className="border p-2">{wt.id_weight_type}</td>
                        <td className="border p-2">{wt.value}</td>
                        <td className="border p-2">{wt.unit}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>
      </div>
  );
};

const Products = () => {
  const navigate = useNavigate();
  const productService = new productServiceClass(navigate);
  const [pageResponse, setPageResponse] = useState({
    content: [],
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isWeightTypeModalOpen, setIsWeightTypeModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [weightTypes, setWeightTypes] = useState([]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getAllProducts(pageResponse.page, pageResponse.size, searchTerm);
      console.log(response)
      if (response && typeof response === 'object' && Array.isArray(response.content)) {
        console.log('Fetched products:', response.content);
        setPageResponse({
          content: response.content,
          page: response.page,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
        });
      } else {
        setPageResponse({
          content: [],
          page: pageResponse.page,
          size: pageResponse.size,
          totalElements: 0,
          totalPages: 1,
        });
      }
    } catch (error) {
      setPageResponse({
        content: [],
        page: pageResponse.page,
        size: pageResponse.size,
        totalElements: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories(1, 99999, '');
      setCategories(response.content || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh mục', { position: 'top-right' });
    }
  };

  const fetchWeightTypes = async () => {
    try {
      const response = await weightTypeService.getAllWeightTypes(1, 99999, '');
      setWeightTypes(response.content || []);
    } catch (error) {
      toast.error('Lỗi khi tải loại trọng lượng', { position: 'top-right' });
    }
  };

  useEffect(() => {
     fetchProducts();
    fetchCategories();
    fetchWeightTypes();
  }, [pageResponse.page, pageResponse.size, searchTerm]);

  const filteredProducts = (Array.isArray(pageResponse.content) ? pageResponse.content : []).filter((product) => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? product.active : !product.active);
    return matchesStatus;
  });

  const openModal = async (mode, product = null) => {
    if (mode === 'view' || mode === 'edit') {
      if (!product || !product.id_product) {
        toast.error('Sản phẩm không hợp lệ', { position: 'top-right' });
        return;
      }
      try {
        const fetchedProduct = await productService.getProductById(product.id_product);
        console.log('Fetched product for modal:', fetchedProduct);
        if (!fetchedProduct || !fetchedProduct.id_product) {
          toast.error('Không thể tải thông tin sản phẩm', { position: 'top-right' });
          return;
        }
        setSelectedProduct(fetchedProduct);
      } catch (error) {
        toast.error('Lỗi khi tải thông tin sản phẩm: ' + (error.response?.data?.message || error.message), {
          position: 'top-right',
        });
        return;
      }
    } else {
      setSelectedProduct(null);
    }
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const openDeleteModal = (product) => {
    if (!product || !product.id_product) {
      toast.error('Sản phẩm không hợp lệ', { position: 'top-right' });
      return;
    }
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async ({ productData, file }) => {
    if (!modalMode) return;
    setLoading(true);
    try {
      console.log('Saving product:', JSON.stringify(productData, null, 2), 'File:', file);
      if (modalMode === 'add') {
        await productService.createProduct({ productData, file });
        toast.success('Tạo sản phẩm thành công', { position: 'top-right' });
      } else if (modalMode === 'edit') {
        await productService.updateProduct(selectedProduct.id_product, { productData, file });
        toast.success('Cập nhật sản phẩm thành công', { position: 'top-right' });
      }
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
      setModalMode('add');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(
          `Lỗi khi ${modalMode === 'add' ? 'tạo' : 'cập nhật'} sản phẩm: ` +
          (error.response?.data?.message || error.message),
          { position: 'top-right' }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct || !selectedProduct.id_product) {
      toast.error('Sản phẩm không hợp lệ', { position: 'top-right' });
      setIsDeleteModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      await productService.deleteProduct(selectedProduct.id_product);
      toast.success('Xóa sản phẩm thành công', { position: 'top-right' });
      await fetchProducts();
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Lỗi khi xóa sản phẩm: ' + (error.response?.data?.message || error.message), {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreProduct = async (product) => {
    if (!product || !product.id_product) {
      toast.error('Sản phẩm không hợp lệ', { position: 'top-right' });
      return;
    }
    setLoading(true);
    try {
      await productService.restoreProduct(product.id_product);
      toast.success('Khôi phục sản phẩm thành công', { position: 'top-right' });
      await fetchProducts();
    } catch (error) {
      console.error('Error restoring product:', error);
      toast.error('Lỗi khi khôi phục sản phẩm: ' + (error.response?.data?.message || error.message), {
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryCreated = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleWeightTypeCreated = (newWeightType) => {
    setWeightTypes((prev) => [...prev, newWeightType]);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pageResponse.totalPages) {
      setPageResponse((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSizeChange = (newSize) => {
    setPageResponse((prev) => ({ ...prev, size: newSize, page: 1 }));
  };

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor('image', {
      header: 'Hình ảnh',
      cell: (info) => (
          <div className="flex items-center">
            {info.getValue() ? (
                <img
                    src={info.getValue()}
                    alt="Product"
                    className="w-10 h-10 object-cover rounded"
                    onError={(e) => (e.target.src = 'https://placehold.co/40x40')}
                />
            ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-xs">No Image</span>
                </div>
            )}
          </div>
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Tên sản phẩm',
      cell: (info) => <div className="font-medium text-gray-900">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('price', {
      header: 'Giá',
      cell: (info) => (
          <div className="text-sm text-gray-600">
            {info.getValue() ? `${info.getValue().toLocaleString('vi-VN')} VNĐ` : '-'}
          </div>
      ),
    }),
    columnHelper.accessor('category.name', {
      header: 'Danh mục',
      cell: (info) => <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('active', {
      header: 'Trạng thái',
      cell: (info) => (
          <Badge variant={info.getValue() ? 'success' : 'error'} label={info.getValue() ? 'Hoạt động' : 'Không hoạt động'} />
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
            <div className="flex justify-end gap-2">
              <button
                  onClick={() => openModal('view', product)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                  onClick={() => openModal('edit', product)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              {product.active ? (
                  <button
                      onClick={() => openDeleteModal(product)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Xóa"
                      disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              ) : (
                  <button
                      onClick={() => handleRestoreProduct(product)}
                      className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Khôi phục"
                      disabled={loading}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
              )}
            </div>
        );
      },
    }),
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6 flex items-center">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="sm:w-48 relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                    disabled={loading}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm danh mục
                </button>
                <button
                    onClick={() => setIsWeightTypeModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                    disabled={loading}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm loại trọng lượng
                </button>
                <button
                    onClick={() => openModal('add')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                    disabled={loading}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </button>
              </div>
            </div>
          </div>

          {loading && pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>
          ) : pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                Không có dữ liệu sản phẩm.
                <button onClick={fetchProducts} className="ml-2 text-blue-600 hover:underline">
                  Thử lại
                </button>
              </div>
          ) : (
              <>
                <DataTable data={filteredProducts} columns={columns} />
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Hiển thị {filteredProducts.length} / {pageResponse.totalElements} sản phẩm
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <select
                        value={pageResponse.size}
                        onChange={(e) => handleSizeChange(Number(e.target.value))}
                        className="p-2 border border-gray-300 rounded-lg"
                    >
                      <option value={10}>10 / trang</option>
                      <option value={20}>20 / trang</option>
                      <option value={50}>50 / trang</option>
                    </select>
                    <button
                        onClick={() => handlePageChange(pageResponse.page - 1)}
                        disabled={pageResponse.page === 1}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-gray-600">
                  Trang {pageResponse.page} / {pageResponse.totalPages}
                </span>
                    <button
                        onClick={() => handlePageChange(pageResponse.page + 1)}
                        disabled={pageResponse.page === pageResponse.totalPages}
                        className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
          )}
        </div>

        <ProductModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
              setModalMode('add');
            }}
            mode={modalMode}
            product={selectedProduct}
            onSave={handleSaveProduct}
            categories={categories}
            weightTypes={weightTypes}
        />

        <CategoryModal
            isOpen={isCategoryModalOpen}
            onClose={() => setIsCategoryModalOpen(false)}
            onCategoryCreated={handleCategoryCreated}
        />

        <WeightTypeModal
            isOpen={isWeightTypeModalOpen}
            onClose={() => setIsWeightTypeModalOpen(false)}
            onWeightTypeCreated={handleWeightTypeCreated}
        />

        {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-xl font-semibold">Xác nhận xóa sản phẩm</h2>
                  </div>
                  <button onClick={closeDeleteModal} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa sản phẩm "{selectedProduct?.name || 'Không xác định'}" không?
                </p>
                <div className="flex justify-end gap-2">
                  <button onClick={closeDeleteModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                    Hủy
                  </button>
                  <button
                      onClick={handleDeleteProduct}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      disabled={loading}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Products;