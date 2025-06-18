import React, { useState, useEffect } from 'react';
import { User, PlusCircle, Search, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight, AlertTriangle, X, RotateCcw } from 'lucide-react';
import DataTable from '../components/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import ProfileModal from '../components/ProfileModal';
import ProfileService from '../service/profile-service';
import { formatDate } from '../utils/formatters';
import Badge from '../ui/badge';
import { toast } from 'react-toastify';

const Profiles = () => {
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
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [modalMode, setModalMode] = useState('add');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await ProfileService.getAllProfiles(pageResponse.page, pageResponse.size, searchTerm);
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
        fetchProfiles();
    }, [pageResponse.page, pageResponse.size, searchTerm]);

    const filteredProfiles = (Array.isArray(pageResponse.content) ? pageResponse.content : []).filter((profile) => {
        const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? profile.active : !profile.active);
        return matchesStatus;
    });

    const openModal = async (mode, profile = null) => {
        if (mode === 'view' || mode === 'edit') {
            if (!profile || !profile.id_user) {
                toast.error('Hồ sơ không hợp lệ', { position: 'top-right' });
                return;
            }
            try {
                const fetchedProfile = await ProfileService.getProfileById(profile.id_user);
                setSelectedProfile(fetchedProfile);
            } catch (error) {
                toast.error('Lỗi khi tải hồ sơ: ' + (error.response?.data?.message || error.message), {
                    position: 'top-right',
                });
                return;
            }
        } else {
            setSelectedProfile(null);
        }
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const openDeleteModal = (profile) => {
        if (!profile || !profile.id_user) {
            toast.error('Hồ sơ không hợp lệ', { position: 'top-right' });
            return;
        }
        setSelectedProfile(profile);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProfile(null);
    };

    const handleSaveProfile = async (profile) => {
        if (!modalMode) return;
        setLoading(true);
        try {
            if (modalMode === 'add') {
                await ProfileService.createProfile(profile);
            } else if (modalMode === 'edit') {
                await ProfileService.updateProfile(profile.id_user, profile);
            }
            await fetchProfiles(); // Refetch to ensure data consistency
            setIsModalOpen(false);
            setSelectedProfile(null);
            setModalMode('add');
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProfile = async () => {
        if (!selectedProfile || !selectedProfile.id_user) {
            toast.error('Hồ sơ không hợp lệ', { position: 'top-right' });
            setIsDeleteModalOpen(false);
            return;
        }
        setLoading(true);
        try {
            await ProfileService.deleteProfile(selectedProfile.id_user);
            await fetchProfiles(); // Refetch instead of manual update
            setIsDeleteModalOpen(false);
            setSelectedProfile(null);
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    const handleRestoreProfile = async (profile) => {
        if (!profile || !profile.id_user) {
            toast.error('Hồ sơ không hợp lệ', { position: 'top-right' });
            return;
        }
        setLoading(true);
        try {
            await ProfileService.restoreProfile(profile.id_user);
            await fetchProfiles(); // Refetch instead of manual update
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
        columnHelper.accessor((row) => `${row.firstName} ${row.lastName}`, {
            id: 'fullName',
            header: 'Tên',
            cell: (info) => <div className="font-medium text-gray-900">{info.getValue() || '-'}</div>,
        }),
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>,
        }),
        columnHelper.accessor('phone', {
            header: 'Số điện thoại',
            cell: (info) => <div className="text-sm text-gray-600">{info.getValue() || '-'}</div>,
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
        columnHelper.accessor('createAt', {
            header: 'Ngày tạo',
            cell: (info) => <div className="text-sm text-gray-600">{formatDate(info.getValue()) || '-'}</div>,
        }),
        columnHelper.display({
            id: 'actions',
            header: () => <div className="text-right">Hành động</div>,
            cell: ({ row }) => {
                const profile = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => openModal('view', profile)}
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Xem chi tiết"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => openModal('edit', profile)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Chỉnh sửa"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        {profile.active ? (
                            <button
                                onClick={() => openDeleteModal(profile)}
                                className="p-1 text-red-600 hover:text-red-800"
                                title="Xóa"
                                disabled={loading}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleRestoreProfile(profile)}
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
                    <h1 className="ml-3 text-2xl font-bold text-gray-900">Quản lý hồ sơ</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm hồ sơ..."
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
                            Thêm hồ sơ
                        </button>
                    </div>
                </div>

                {loading && pageResponse.content.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">Đang tải dữ liệu...</div>
                ) : pageResponse.content.length === 0 ? (
                    <div className="text-center py-10 text-gray-600">
                        Không có dữ liệu hồ sơ.
                        <button
                            onClick={fetchProfiles}
                            className="ml-2 text-blue-600 hover:underline"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : (
                    <>
                        <DataTable data={filteredProfiles} columns={columns} />
                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Hiển thị {filteredProfiles.length} / {pageResponse.totalElements} hồ sơ
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

            <ProfileModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedProfile(null);
                    setModalMode('add');
                }}
                mode={modalMode}
                profile={selectedProfile}
                onSave={handleSaveProfile}
            />

            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                                <h2 className="text-xl font-semibold">Xác nhận xóa hồ sơ</h2>
                            </div>
                            <button
                                onClick={closeDeleteModal}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa hồ sơ "{selectedProfile?.firstName} {selectedProfile?.lastName || 'Không xác định'}" không?
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteProfile}
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

export default Profiles;