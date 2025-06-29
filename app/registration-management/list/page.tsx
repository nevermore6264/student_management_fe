'use client';

import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Paginator } from 'primereact/paginator';
import registrationService, { RegistrationRecord, RegistrationPeriod } from '../../services/registrationService';

const STATUS_OPTIONS = [
    { label: 'Tất cả trạng thái', value: null },
    { label: 'Chờ duyệt', value: 0 },
    { label: 'Đã duyệt', value: 1 },
    { label: 'Từ chối', value: 2 }
];

const STATUS_MAP: Record<number, { color: string; icon: string }> = {
    0: { color: 'bg-yellow-100 text-yellow-700', icon: 'pi-clock' },
    1: { color: 'bg-green-100 text-green-700', icon: 'pi-check-circle' },
    2: { color: 'bg-red-100 text-red-700', icon: 'pi-times-circle' }
};

export default function RegistrationListPage() {
    const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
    const [periods, setPeriods] = useState<RegistrationPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showStatusDialog, setShowStatusDialog] = useState(false);
    const [selectedRegistration, setSelectedRegistration] = useState<RegistrationRecord | null>(null);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);

    // Pagination
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Filters
    const [filters, setFilters] = useState({
        maDotDangKy: null as number | null,
        maSinhVien: '',
        trangThai: null as number | null
    });

    const fetchPeriods = async () => {
        try {
            const data = await registrationService.getRegistrationPeriods();
            setPeriods(data);
        } catch (error) {
            console.error('Lỗi khi tải danh sách đợt đăng ký:', error);
        }
    };

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await registrationService.getRegistrationList({
                ...filters,
                page: currentPage,
                size: pageSize
            });
            setRegistrations(response.content || []);
            setTotalRecords(response.totalElements || 0);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể tải danh sách đăng ký',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);

    useEffect(() => {
        fetchRegistrations();
    }, [filters, currentPage, pageSize]);

    const handleFilterChange = (field: keyof typeof filters, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(0); // Reset về trang đầu khi filter
    };

    const handleStatusUpdate = (registration: RegistrationRecord) => {
        setSelectedRegistration(registration);
        setShowStatusDialog(true);
    };

    const handleDelete = (registration: RegistrationRecord) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa đăng ký của sinh viên "${registration.hoTenSinhVien}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deleteRegistration(registration.maDangKy),
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy'
        });
    };

    const deleteRegistration = async (maDangKy: number) => {
        try {
            await registrationService.deleteRegistration(maDangKy);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Xóa đăng ký thành công',
                life: 3000
            });
            fetchRegistrations();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể xóa đăng ký',
                life: 3000
            });
        }
    };

    const handleStatusSave = async (trangThai: number, ghiChu?: string) => {
        if (!selectedRegistration) return;

        try {
            setSaving(true);
            await registrationService.updateRegistrationStatus(selectedRegistration.maDangKy, trangThai, ghiChu);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật trạng thái thành công',
                life: 3000
            });
            setShowStatusDialog(false);
            fetchRegistrations();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const statusBodyTemplate = (rowData: RegistrationRecord) => {
        const status = STATUS_MAP[rowData.trangThai] || STATUS_MAP[0];
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                <i className={`pi ${status.icon} mr-1`}></i>
                {rowData.trangThaiText}
            </span>
        );
    };

    const dateBodyTemplate = (rowData: RegistrationRecord) => {
        return rowData.ngayDangKy ? new Date(rowData.ngayDangKy).toLocaleDateString('vi-VN') : '-';
    };

    const actionBodyTemplate = (rowData: RegistrationRecord) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-check"
                    className="p-button-rounded p-button-success p-button-sm"
                    tooltip="Cập nhật trạng thái"
                    onClick={() => handleStatusUpdate(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger p-button-sm"
                    tooltip="Xóa"
                    onClick={() => handleDelete(rowData)}
                />
            </div>
        );
    };

    const onPageChange = (event: { first: number; rows: number; page: number; pageCount: number }) => {
        setCurrentPage(event.page);
        setPageSize(event.rows);
    };

    const periodOptions = [
        { label: 'Tất cả đợt đăng ký', value: null },
        ...periods.map(period => ({
            label: period.tenDotDangKy,
            value: period.maDotDangKy
        }))
    ];

    const statusUpdateOptions = [
        { label: 'Chờ duyệt', value: 0 },
        { label: 'Đã duyệt', value: 1 },
        { label: 'Từ chối', value: 2 }
    ];

    return (
        <div className="w-4/5 max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-blue-700">Quản lý danh sách đăng ký</h1>
                    <p className="text-gray-600">Quản lý các đăng ký học phần của sinh viên</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Đợt đăng ký</label>
                        <Dropdown
                            value={filters.maDotDangKy}
                            options={periodOptions}
                            onChange={(e) => handleFilterChange('maDotDangKy', e.value)}
                            placeholder="Chọn đợt đăng ký"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mã sinh viên</label>
                        <InputText
                            value={filters.maSinhVien}
                            onChange={(e) => handleFilterChange('maSinhVien', e.target.value)}
                            placeholder="Nhập mã sinh viên"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                        <Dropdown
                            value={filters.trangThai}
                            options={STATUS_OPTIONS}
                            onChange={(e) => handleFilterChange('trangThai', e.value)}
                            placeholder="Chọn trạng thái"
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* DataTable */}
            <DataTable
                value={registrations}
                loading={loading}
                className="p-datatable-sm"
                emptyMessage="Không có đăng ký nào"
                showGridlines
            >
                <Column field="maDangKy" header="Mã ĐK" sortable style={{ width: '80px' }} />
                <Column field="maSinhVien" header="Mã SV" sortable style={{ width: '120px' }} />
                <Column field="hoTenSinhVien" header="Họ tên sinh viên" sortable />
                <Column field="maLop" header="Lớp" sortable style={{ width: '100px' }} />
                <Column field="maHocPhan" header="Mã HP" sortable style={{ width: '100px' }} />
                <Column field="tenHocPhan" header="Tên học phần" sortable />
                <Column field="soTinChi" header="TC" sortable style={{ width: '60px' }} />
                <Column field="tenDotDangKy" header="Đợt đăng ký" sortable style={{ width: '150px' }} />
                <Column
                    field="ngayDangKy"
                    header="Ngày đăng ký"
                    sortable
                    style={{ width: '140px' }}
                    body={dateBodyTemplate}
                />
                <Column
                    field="trangThai"
                    header="Trạng thái"
                    sortable
                    style={{ width: '120px' }}
                    body={statusBodyTemplate}
                />
                <Column
                    header="Thao tác"
                    style={{ width: '120px' }}
                    body={actionBodyTemplate}
                />
            </DataTable>

            {/* Pagination */}
            <div className="mt-4">
                <Paginator
                    first={currentPage * pageSize}
                    rows={pageSize}
                    totalRecords={totalRecords}
                    onPageChange={onPageChange}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                />
            </div>

            {/* Status Update Dialog */}
            <Dialog
                visible={showStatusDialog}
                onHide={() => setShowStatusDialog(false)}
                header="Cập nhật trạng thái đăng ký"
                modal
                className="w-full max-w-md"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            className="p-button-text"
                            onClick={() => setShowStatusDialog(false)}
                            disabled={saving}
                        />
                        <Button
                            label={saving ? 'Đang lưu...' : 'Lưu'}
                            icon={saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
                            onClick={() => {
                                const status = (document.getElementById('statusSelect') as HTMLSelectElement)?.value;
                                const note = (document.getElementById('statusNote') as HTMLInputElement)?.value;
                                if (status) {
                                    handleStatusSave(parseInt(status), note || undefined);
                                }
                            }}
                            disabled={saving}
                        />
                    </div>
                }
            >
                {selectedRegistration && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Sinh viên: <span className="font-semibold">{selectedRegistration.hoTenSinhVien}</span></p>
                            <p className="text-sm text-gray-600">Học phần: <span className="font-semibold">{selectedRegistration.tenHocPhan}</span></p>
                            <p className="text-sm text-gray-600">Trạng thái hiện tại: <span className="font-semibold">{selectedRegistration.trangThaiText}</span></p>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Trạng thái mới *</label>
                            <select
                                id="statusSelect"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                defaultValue={selectedRegistration.trangThai}
                            >
                                {statusUpdateOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Ghi chú</label>
                            <InputText
                                id="statusNote"
                                className="w-full"
                                placeholder="Nhập ghi chú (tùy chọn)"
                                defaultValue={selectedRegistration.ghiChu || ''}
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            <Toast ref={toast} position="top-right" />
            <ConfirmDialog />
        </div>
    );
} 