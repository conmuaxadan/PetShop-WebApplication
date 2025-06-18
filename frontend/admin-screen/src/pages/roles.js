import React, { useState, useEffect } from 'react';
import { Shield, PlusCircle, Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle, X, RotateCcw } from 'lucide-react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import RoleModal from '../components/RoleModal';
import RoleService from '../service/role-service';
import { formatDate } from '../utils/formatters';
import Badge from '../ui/badge';
import { toast } from 'react-toastify';

const Roles = () => {
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
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await RoleService.getAllRoles(pageResponse.page, pageResponse.size, searchTerm);
      if (response && typeof response === 'object' && Array.isArray(response.content)) {
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
        toast.error('Dữ liệu vai trò không hợp lệ', { position: 'top-right' });
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách vai trò: ' + (error.response?.data?.message || error.message), {
        position: 'top-right',
      });
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

  useEffect(() => {
    fetchRoles();
  }, [pageResponse.page, pageResponse.size, searchTerm]);

  const filteredRoles = (Array.isArray(pageResponse.content) ? pageResponse.content : []).filter((role) => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? role.active : !role.active);
    return matchesStatus;
  });

  const openModal = (mode, role = null) => {
    setSelectedRole(role);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const openDeleteModal = (role) => {
    if (!role || !role.name) {
      toast.error('Vai trò không hợp lệ', { position: 'top-right' });
      return;
    }
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = async (role) => {
    if (!modalMode) return;
    setLoading(true);
    try {
      if (modalMode === 'add') {
        await RoleService.createRole(role);
      } else if (modalMode === 'edit') {
        await RoleService.updateRole(role.name, role);
      }
      await fetchRoles();
      setIsModalOpen(false);
      setSelectedRole(null);
      setModalMode('add');
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole || !selectedRole.name) {
      toast.error('Vai trò không hợp lệ', { position: 'top-right' });
      setIsDeleteModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      await RoleService.deleteRole(selectedRole.name);
      // Update local state to set active: false
      setPageResponse((prev) => ({
        ...prev,
        content: prev.content.map((role) =>
            role.name === selectedRole.name ? { ...role, active: false } : role
        ),
      }));
      setIsDeleteModalOpen(false);
      setSelectedRole(null);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const handleRestoreRole = async (role) => {
    if (!role || !role.name) {
      toast.error('Vai trò không hợp lệ', { position: 'top-right' });
      return;
    }
    setLoading(true);
    try {
      await RoleService.restoreRole(role.name);
      // Update local state to set active: true
      setPageResponse((prev) => ({
        ...prev,
        content: prev.content.map((r) =>
            r.name === role.name ? { ...r, active: true } : r
        ),
      }));
    } catch (error) {

    } finally {
      setLoading(false);
    }
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
    columnHelper.accessor('name', {
      header: 'Tên vai trò',
      cell: (info) => <div className="font-medium text-gray-900">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('description', {
      header: 'Mô tả',
      cell: (info) => <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('permissions', {
      header: 'Quyền hạn',
      cell: (info) => {
        const permissions = info.getValue() || [];
        const permissionNames = permissions
            .filter((p) => p && p.name)
            .map((p) => p.name)
            .join(', ');
        return <div className="text-sm text-gray-600">{permissionNames || '-'}</div>;
      },
    }),
    columnHelper.accessor('active', {
      header: 'Trạng thái',
      cell: (info) => (
          <Badge
              variant={info.getValue() ? 'success' : 'error'}
              label={info.getValue() ? 'Hoạt động' : 'Không hoạt động'}
          />
      ),
    }),
    columnHelper.accessor('createAt', { // Fixed typo: createAt -> createdAt
      header: 'Ngày tạo',
      cell: (info) => <div className="text-sm text-gray-600">{formatDate(info.getValue()) || '-'}</div>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => {
        const role = row.original;
        return (
            <div className="flex justify-end gap-2">
              <button
                  onClick={() => openModal('view', role)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                  onClick={() => openModal('edit', role)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              {role.active ? (
                  <button
                      onClick={() => openDeleteModal(role)}
                      className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xóa"
                      disabled={role.name === 'Admin'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              ) : (
                  <button
                      onClick={() => handleRestoreRole(role)}
                      className="p-1 text-green-600 hover:text-green-800"
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
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Quản lý vai trò</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm vai trò..."
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

              <button
                  onClick={() => openModal('add')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  disabled={loading}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Thêm vai trò
              </button>
            </div>
          </div>

          {loading && pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>
          ) : pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                Không có dữ liệu vai trò.
                <button
                    onClick={fetchRoles}
                    className="ml-2 text-blue-600 hover:underline"
                >
                  Thử lại
                </button>
              </div>
          ) : (
              <>
                <DataTable data={filteredRoles} columns={columns} />
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Hiển thị {filteredRoles.length} / {pageResponse.totalElements} vai trò
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

        <RoleModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedRole(null);
              setModalMode('add');
            }}
            mode={modalMode}
            role={selectedRole}
            onSave={handleSaveRole}
        />

        {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-xl font-semibold">Xác nhận xóa vai trò</h2>
                  </div>
                  <button
                      onClick={closeDeleteModal}
                      className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa vai trò "{selectedRole?.name || 'Không xác định'}" không?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                      onClick={closeDeleteModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleDeleteRole}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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

export default Roles;