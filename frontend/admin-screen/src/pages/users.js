import React, { useState, useEffect } from 'react';
import { User, PlusCircle, Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle, X, RotateCcw } from 'lucide-react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import UserModal from '../components/UserModal';
import UserService from '../service/user-service';
import Badge from '../ui/badge';
import { toast } from 'react-toastify';

const Users = () => {
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers(pageResponse.page, pageResponse.size, searchTerm);
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

  useEffect(() => {
    fetchUsers();
  }, [pageResponse.page, pageResponse.size, searchTerm]);

  const filteredUsers = (Array.isArray(pageResponse.content) ? pageResponse.content : []).filter((user) => {
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.active : !user.active);
    return matchesStatus;
  });

  const openModal = async (mode, user = null) => {
    if (mode === 'view' || mode === 'edit') {
      if (!user || !user.id_user) {
        toast.error('Người dùng không hợp lệ', { position: 'top-right' });
        return;
      }
      try {
        const fetchedUser = await UserService.getUserById(user.id_user);
        console.log('Fetched user for modal:', fetchedUser); // Debug log
        if (!fetchedUser || !fetchedUser.id_user) {
          toast.error('Không thể tải thông tin người dùng', { position: 'top-right' });
          return;
        }
        setSelectedUser(fetchedUser);
      } catch (error) {
        toast.error('Lỗi khi tải thông tin người dùng: ' + (error.response?.data?.message || error.message), {
          position: 'top-right',
        });
        return;
      }
    } else {
      setSelectedUser(null);
    }
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    if (!user || !user.id_user) {
      toast.error('Người dùng không hợp lệ', { position: 'top-right' });
      return;
    }
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = async (user) => {
    if (!modalMode) return;
    setLoading(true);
    try {
      console.log('Saving user:', user); // Debug log
      if (modalMode === 'add') {
        await UserService.createUser(user);
      } else if (modalMode === 'edit') {
        await UserService.updateUser(user.id_user, user);
      }
      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
      setModalMode('add');
    } catch (error) {
      // Error handling is managed by UserService (toast notifications)
      console.error('Error saving user:', error); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !selectedUser.id_user) {
      toast.error('Người dùng không hợp lệ', { position: 'top-right' });
      setIsDeleteModalOpen(false);
      return;
    }
    setLoading(true);
    try {
      await UserService.deleteUser(selectedUser.id_user);
      await fetchUsers();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handling is managed by UserService (toast notifications)
      console.error('Error deleting user:', error); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (user) => {
    if (!user || !user.id_user) {
      toast.error('Người dùng không hợp lệ', { position: 'top-right' });
      return;
    }
    setLoading(true);
    try {
      await UserService.restoreUser(user.id_user);
      await fetchUsers();
    } catch (error) {
      // Error handling is managed by UserService (toast notifications)
      console.error('Error restoring user:', error); // Debug log
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
    columnHelper.accessor('username', {
      header: 'Tên người dùng',
      cell: (info) => <div className="font-medium text-gray-900">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>,
    }),
    columnHelper.accessor('roles', {
      header: 'Vai trò',
      cell: (info) => {
        const roles = Array.isArray(info.getValue()) ? info.getValue() : [];
        return (
            <div className="text-sm text-gray-600">
              {roles.length > 0
                  ? roles
                      .map((role) => (role.name === 'USER_ROLE' ? 'Người dùng' : role.name === 'ADMIN_ROLE' ? 'Quản trị viên' : role.name))
                      .join(', ')
                  : '-'}
            </div>
        );
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
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex justify-end gap-2">
              <button
                  onClick={() => openModal('view', user)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Xem chi tiết"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                  onClick={() => openModal('edit', user)}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Chỉnh sửa"
              >
                <Edit className="w-4 h-4" />
              </button>
              {user.active ? (
                  <button
                      onClick={() => openDeleteModal(user)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Xóa"
                      disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
              ) : (
                  <button
                      onClick={() => handleRestoreUser(user)}
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
            <User className="h-8 w-8 text-blue-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
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
                Thêm người dùng
              </button>
            </div>
          </div>

          {loading && pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>
          ) : pageResponse.content.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                Không có dữ liệu người dùng.
                <button
                    onClick={fetchUsers}
                    className="ml-2 text-blue-600 hover:underline"
                >
                  Thử lại
                </button>
              </div>
          ) : (
              <>
                <DataTable data={filteredUsers} columns={columns} />
                <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Hiển thị {filteredUsers.length} / {pageResponse.totalElements} người dùng
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

        <UserModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedUser(null);
              setModalMode('add');
            }}
            mode={modalMode}
            user={selectedUser}
            onSave={handleSaveUser}
        />

        {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <h2 className="text-xl font-semibold">Xác nhận xóa người dùng</h2>
                  </div>
                  <button
                      onClick={closeDeleteModal}
                      className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa người dùng "{selectedUser?.username || 'Không xác định'}" không?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                      onClick={closeDeleteModal}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                      onClick={handleDeleteUser}
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

export default Users;