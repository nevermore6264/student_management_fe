/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Message } from 'primereact/message';
import registrationService, { RegistrationPeriod } from '../../services/registrationService';

const STATUS_OPTIONS = [
    { label: 'Chưa mở', value: 0 },
    { label: 'Đang mở', value: 1 },
    { label: 'Đã đóng', value: 2 }
];

const STATUS_MAP: Record<number, { color: string; icon: string }> = {
    0: { color: 'bg-gray-100 text-gray-700', icon: 'pi-clock' },
    1: { color: 'bg-green-100 text-green-700', icon: 'pi-check-circle' },
    2: { color: 'bg-red-100 text-red-700', icon: 'pi-times-circle' }
};

export default function RegistrationPeriodsPage() {
    const [periods, setPeriods] = useState<RegistrationPeriod[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<RegistrationPeriod | null>(null);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const fetchPeriods = async () => {
        try {
            setLoading(true);
            const data = await registrationService.getRegistrationPeriods();
            setPeriods(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể tải danh sách đợt đăng ký',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, []);

    const handleCreate = () => {
        setEditingPeriod({
            maDotDangKy: 0,
            tenDotDangKy: '',
            ngayBatDau: '',
            ngayKetThuc: '',
            trangThai: 0,
            trangThaiText: 'Chưa mở',
            moTa: '',
            namHoc: '',
            hocKy: 1
        });
        setErrors({});
        setShowDialog(true);
    };

    const handleEdit = (period: RegistrationPeriod) => {
        setEditingPeriod({ ...period });
        setErrors({});
        setShowDialog(true);
    };

    const handleDelete = (period: RegistrationPeriod) => {
        confirmDialog({
            message: `Bạn có chắc chắn muốn xóa đợt đăng ký "${period.tenDotDangKy}"?`,
            header: 'Xác nhận xóa',
            icon: 'pi pi-exclamation-triangle',
            accept: () => deletePeriod(period.maDotDangKy),
            acceptLabel: 'Xóa',
            rejectLabel: 'Hủy'
        });
    };

    const deletePeriod = async (maDotDangKy: number) => {
        try {
            await registrationService.deleteRegistrationPeriod(maDotDangKy);
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Xóa đợt đăng ký thành công',
                life: 3000
            });
            fetchPeriods();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể xóa đợt đăng ký',
                life: 3000
            });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!editingPeriod?.tenDotDangKy?.trim()) {
            newErrors.tenDotDangKy = 'Tên đợt đăng ký không được để trống';
        }
        if (!editingPeriod?.ngayBatDau) {
            newErrors.ngayBatDau = 'Ngày bắt đầu không được để trống';
        }
        if (!editingPeriod?.ngayKetThuc) {
            newErrors.ngayKetThuc = 'Ngày kết thúc không được để trống';
        }
        if (editingPeriod?.ngayBatDau && editingPeriod?.ngayKetThuc &&
            new Date(editingPeriod.ngayBatDau) >= new Date(editingPeriod.ngayKetThuc)) {
            newErrors.ngayKetThuc = 'Ngày kết thúc phải sau ngày bắt đầu';
        }
        if (!editingPeriod?.namHoc?.trim()) {
            newErrors.namHoc = 'Năm học không được để trống';
        }
        if (!editingPeriod?.hocKy || editingPeriod.hocKy < 1 || editingPeriod.hocKy > 3) {
            newErrors.hocKy = 'Học kỳ phải từ 1-3';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!editingPeriod || !validateForm()) return;

        try {
            setSaving(true);
            const statusOption = STATUS_OPTIONS.find(opt => opt.value === editingPeriod.trangThai);
            const periodData = {
                ...editingPeriod,
                trangThaiText: statusOption?.label || 'Chưa mở'
            };

            if (editingPeriod.maDotDangKy === 0) {
                await registrationService.createRegistrationPeriod(periodData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Tạo đợt đăng ký thành công',
                    life: 3000
                });
            } else {
                await registrationService.updateRegistrationPeriod(editingPeriod.maDotDangKy, periodData);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật đợt đăng ký thành công',
                    life: 3000
                });
            }

            setShowDialog(false);
            fetchPeriods();
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể lưu đợt đăng ký',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof RegistrationPeriod, value: any) => {
        if (!editingPeriod) return;
        setEditingPeriod({ ...editingPeriod, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const statusBodyTemplate = (rowData: RegistrationPeriod) => {
        const status = STATUS_MAP[rowData.trangThai] || STATUS_MAP[0];
        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                <i className={`pi ${status.icon} mr-1`}></i>
                {rowData.trangThaiText}
            </span>
        );
    };

    const dateBodyTemplate = (rowData: RegistrationPeriod, field: 'ngayBatDau' | 'ngayKetThuc') => {
        return rowData[field] ? new Date(rowData[field]).toLocaleDateString('vi-VN') : '-';
    };

    const actionBodyTemplate = (rowData: RegistrationPeriod) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success p-button-sm"
                    tooltip="Chỉnh sửa"
                    onClick={() => handleEdit(rowData)}
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

    const dialogFooter = (
        <div className="flex justify-end gap-3">
            <Button
                label="Hủy"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => setShowDialog(false)}
                disabled={saving}
            />
            <Button
                label={saving ? 'Đang lưu...' : 'Lưu'}
                icon={saving ? 'pi pi-spinner pi-spin' : 'pi pi-check'}
                onClick={handleSave}
                disabled={saving}
            />
        </div>
    );

    return (
        <div className="w-4/5 max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-blue-700">Quản lý đợt đăng ký</h1>
                    <p className="text-gray-600">Quản lý các đợt đăng ký học phần</p>
                </div>
                <Button
                    label="Thêm đợt đăng ký"
                    icon="pi pi-plus"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 border-0"
                    onClick={handleCreate}
                />
            </div>

            <DataTable
                value={periods}
                loading={loading}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 20, 50]}
                className="p-datatable-sm"
                emptyMessage="Không có đợt đăng ký nào"
                showGridlines
            >
                <Column field="maDotDangKy" header="Mã đợt" sortable style={{ width: '100px' }} />
                <Column field="tenDotDangKy" header="Tên đợt đăng ký" sortable />
                <Column field="namHoc" header="Năm học" sortable style={{ width: '120px' }} />
                <Column field="hocKy" header="Học kỳ" sortable style={{ width: '100px' }} />
                <Column
                    field="ngayBatDau"
                    header="Ngày bắt đầu"
                    sortable
                    style={{ width: '140px' }}
                    body={(rowData) => dateBodyTemplate(rowData, 'ngayBatDau')}
                />
                <Column
                    field="ngayKetThuc"
                    header="Ngày kết thúc"
                    sortable
                    style={{ width: '140px' }}
                    body={(rowData) => dateBodyTemplate(rowData, 'ngayKetThuc')}
                />
                <Column
                    field="trangThai"
                    header="Trạng thái"
                    sortable
                    style={{ width: '150px' }}
                    body={statusBodyTemplate}
                />
                <Column
                    header="Thao tác"
                    style={{ width: '120px' }}
                    body={actionBodyTemplate}
                />
            </DataTable>

            <Dialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                header={editingPeriod?.maDotDangKy === 0 ? 'Thêm đợt đăng ký' : 'Chỉnh sửa đợt đăng ký'}
                modal
                className="w-full max-w-2xl"
                footer={dialogFooter}
            >
                {editingPeriod && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-2 text-gray-700">Tên đợt đăng ký *</label>
                            <InputText
                                value={editingPeriod.tenDotDangKy}
                                onChange={(e) => handleInputChange('tenDotDangKy', e.target.value)}
                                className={`w-full ${errors.tenDotDangKy ? 'p-invalid' : ''}`}
                                placeholder="Nhập tên đợt đăng ký"
                            />
                            {errors.tenDotDangKy && <small className="p-error">{errors.tenDotDangKy}</small>}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Năm học *</label>
                            <InputText
                                value={editingPeriod.namHoc}
                                onChange={(e) => handleInputChange('namHoc', e.target.value)}
                                className={`w-full ${errors.namHoc ? 'p-invalid' : ''}`}
                                placeholder="VD: 2024-2025"
                            />
                            {errors.namHoc && <small className="p-error">{errors.namHoc}</small>}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Học kỳ *</label>
                            <Dropdown
                                value={editingPeriod.hocKy}
                                options={[
                                    { label: 'Học kỳ 1', value: 1 },
                                    { label: 'Học kỳ 2', value: 2 },
                                    { label: 'Học kỳ 3', value: 3 }
                                ]}
                                onChange={(e) => handleInputChange('hocKy', e.value)}
                                className={`w-full ${errors.hocKy ? 'p-invalid' : ''}`}
                                placeholder="Chọn học kỳ"
                            />
                            {errors.hocKy && <small className="p-error">{errors.hocKy}</small>}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Ngày bắt đầu *</label>
                            <Calendar
                                value={editingPeriod.ngayBatDau ? new Date(editingPeriod.ngayBatDau) : null}
                                onChange={(e) => handleInputChange('ngayBatDau', e.value ? e.value.toISOString().split('T')[0] : '')}
                                className={`w-full ${errors.ngayBatDau ? 'p-invalid' : ''}`}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            {errors.ngayBatDau && <small className="p-error">{errors.ngayBatDau}</small>}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Ngày kết thúc *</label>
                            <Calendar
                                value={editingPeriod.ngayKetThuc ? new Date(editingPeriod.ngayKetThuc) : null}
                                onChange={(e) => handleInputChange('ngayKetThuc', e.value ? e.value.toISOString().split('T')[0] : '')}
                                className={`w-full ${errors.ngayKetThuc ? 'p-invalid' : ''}`}
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                            {errors.ngayKetThuc && <small className="p-error">{errors.ngayKetThuc}</small>}
                        </div>

                        <div>
                            <label className="block font-semibold mb-2 text-gray-700">Trạng thái</label>
                            <Dropdown
                                value={editingPeriod.trangThai}
                                options={STATUS_OPTIONS}
                                onChange={(e) => handleInputChange('trangThai', e.value)}
                                className="w-full"
                                placeholder="Chọn trạng thái"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block font-semibold mb-2 text-gray-700">Mô tả</label>
                            <InputText
                                value={editingPeriod.moTa || ''}
                                onChange={(e) => handleInputChange('moTa', e.target.value)}
                                className="w-full"
                                placeholder="Nhập mô tả (tùy chọn)"
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