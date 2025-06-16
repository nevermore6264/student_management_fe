'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';

interface Department {
    maKhoa: string;
    tenKhoa: string;
    moTa: string;
    truongKhoa: string;
}

export default function DepartmentManagementPage() {
    const router = useRouter();
    const [departments] = useState<Department[]>([
        {
            maKhoa: 'CNTT',
            tenKhoa: 'Công nghệ thông tin',
            moTa: 'Khoa Công nghệ thông tin',
            truongKhoa: 'Nguyễn Văn A'
        },
        {
            maKhoa: 'KT',
            tenKhoa: 'Kế toán',
            moTa: 'Khoa Kế toán',
            truongKhoa: 'Trần Thị B'
        }
    ]);

    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Department>({
        maKhoa: '',
        tenKhoa: '',
        moTa: '',
        truongKhoa: ''
    });

    const actionTemplate = (rowData: Department) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    tooltip="Sửa"
                    onClick={() => {
                        setSelectedDepartment(rowData);
                        setFormData(rowData);
                        setEditDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    tooltip="Xóa"
                    onClick={() => {
                        setSelectedDepartment(rowData);
                        setDeleteDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-list"
                    className="p-button-rounded p-button-info"
                    tooltip="Xem lớp"
                    onClick={() => router.push(`/departments/${rowData.maKhoa}/classes`)}
                />
            </div>
        );
    };

    const handleEdit = () => {
        // TODO: Implement edit logic
        console.log('Editing department:', formData);
        setEditDialogVisible(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log('Deleting department:', selectedDepartment);
        setDeleteDialogVisible(false);
        setSelectedDepartment(null);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Khoa</h1>
                <Button
                    label="Thêm khoa"
                    icon="pi pi-plus"
                    onClick={() => {
                        setFormData({ maKhoa: '', tenKhoa: '', moTa: '', truongKhoa: '' });
                        setEditDialogVisible(true);
                    }}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText placeholder="Tìm kiếm khoa..." />
                </span>
            </div>

            <DataTable
                value={departments}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không tìm thấy khoa nào"
            >
                <Column field="maKhoa" header="Mã khoa" sortable />
                <Column field="tenKhoa" header="Tên khoa" sortable />
                <Column field="truongKhoa" header="Trưởng khoa" sortable />
                <Column field="moTa" header="Mô tả" sortable />
                <Column body={actionTemplate} style={{ width: '12rem' }} />
            </DataTable>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={formData.maKhoa ? 'Sửa khoa' : 'Thêm khoa mới'}
                modal
                className="p-fluid"
                footer={
                    <div>
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={() => setEditDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Lưu"
                            icon="pi pi-check"
                            onClick={handleEdit}
                        />
                    </div>
                }
            >
                <div className="flex flex-column gap-4">
                    <div className="flex flex-column gap-2">
                        <label htmlFor="maKhoa" className="font-medium">
                            Mã khoa
                        </label>
                        <InputText
                            id="maKhoa"
                            value={formData.maKhoa}
                            onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                            placeholder="Nhập mã khoa"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tenKhoa" className="font-medium">
                            Tên khoa
                        </label>
                        <InputText
                            id="tenKhoa"
                            value={formData.tenKhoa}
                            onChange={(e) => setFormData({ ...formData, tenKhoa: e.target.value })}
                            placeholder="Nhập tên khoa"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="truongKhoa" className="font-medium">
                            Trưởng khoa
                        </label>
                        <InputText
                            id="truongKhoa"
                            value={formData.truongKhoa}
                            onChange={(e) => setFormData({ ...formData, truongKhoa: e.target.value })}
                            placeholder="Nhập tên trưởng khoa"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="moTa" className="font-medium">
                            Mô tả
                        </label>
                        <InputText
                            id="moTa"
                            value={formData.moTa}
                            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                            placeholder="Nhập mô tả"
                            required
                        />
                    </div>
                </div>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog
                visible={deleteDialogVisible}
                onHide={() => setDeleteDialogVisible(false)}
                header="Xác nhận xóa"
                modal
                footer={
                    <div>
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={() => setDeleteDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Xóa"
                            icon="pi pi-trash"
                            onClick={handleDelete}
                            className="p-button-danger"
                        />
                    </div>
                }
            >
                <p>
                    Bạn có chắc chắn muốn xóa khoa{' '}
                    <strong>{selectedDepartment?.tenKhoa}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 