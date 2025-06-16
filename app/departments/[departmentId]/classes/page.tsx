'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

interface Class {
    maLop: string;
    tenLop: string;
    khoaHoc: string;
    siSo: number;
    giaoVienChuNhiem: string;
}

export default function ClassManagementPage() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.departmentId as string;

    const [classes] = useState<Class[]>([
        {
            maLop: 'CNTT1',
            tenLop: 'Công nghệ thông tin 1',
            khoaHoc: '2023-2024',
            siSo: 40,
            giaoVienChuNhiem: 'Nguyễn Văn A'
        },
        {
            maLop: 'CNTT2',
            tenLop: 'Công nghệ thông tin 2',
            khoaHoc: '2023-2024',
            siSo: 35,
            giaoVienChuNhiem: 'Trần Thị B'
        }
    ]);

    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Class>({
        maLop: '',
        tenLop: '',
        khoaHoc: '',
        siSo: 0,
        giaoVienChuNhiem: ''
    });

    const actionTemplate = (rowData: Class) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    tooltip="Sửa"
                    onClick={() => {
                        setSelectedClass(rowData);
                        setFormData(rowData);
                        setEditDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    tooltip="Xóa"
                    onClick={() => {
                        setSelectedClass(rowData);
                        setDeleteDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-users"
                    className="p-button-rounded p-button-info"
                    tooltip="Xem sinh viên"
                    onClick={() => router.push(`/departments/${departmentId}/classes/${rowData.maLop}/students`)}
                />
            </div>
        );
    };

    const handleEdit = () => {
        // TODO: Implement edit logic
        console.log('Editing class:', formData);
        setEditDialogVisible(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log('Deleting class:', selectedClass);
        setDeleteDialogVisible(false);
        setSelectedClass(null);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Lớp</h1>
                    <p className="text-gray-600">Khoa: {departmentId}</p>
                </div>
                <Button
                    label="Thêm lớp"
                    icon="pi pi-plus"
                    onClick={() => {
                        setFormData({ maLop: '', tenLop: '', khoaHoc: '', siSo: 0, giaoVienChuNhiem: '' });
                        setEditDialogVisible(true);
                    }}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText placeholder="Tìm kiếm lớp..." />
                </span>
            </div>

            <DataTable
                value={classes}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không tìm thấy lớp nào"
            >
                <Column field="maLop" header="Mã lớp" sortable />
                <Column field="tenLop" header="Tên lớp" sortable />
                <Column field="khoaHoc" header="Khóa học" sortable />
                <Column field="siSo" header="Sĩ số" sortable />
                <Column field="giaoVienChuNhiem" header="Giáo viên chủ nhiệm" sortable />
                <Column body={actionTemplate} style={{ width: '12rem' }} />
            </DataTable>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={formData.maLop ? 'Sửa lớp' : 'Thêm lớp mới'}
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
                        <label htmlFor="maLop" className="font-medium">
                            Mã lớp
                        </label>
                        <InputText
                            id="maLop"
                            value={formData.maLop}
                            onChange={(e) => setFormData({ ...formData, maLop: e.target.value })}
                            placeholder="Nhập mã lớp"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tenLop" className="font-medium">
                            Tên lớp
                        </label>
                        <InputText
                            id="tenLop"
                            value={formData.tenLop}
                            onChange={(e) => setFormData({ ...formData, tenLop: e.target.value })}
                            placeholder="Nhập tên lớp"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="khoaHoc" className="font-medium">
                            Khóa học
                        </label>
                        <InputText
                            id="khoaHoc"
                            value={formData.khoaHoc}
                            onChange={(e) => setFormData({ ...formData, khoaHoc: e.target.value })}
                            placeholder="Nhập khóa học"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="siSo" className="font-medium">
                            Sĩ số
                        </label>
                        <InputText
                            id="siSo"
                            type="number"
                            value={formData.siSo.toString()}
                            onChange={(e) => setFormData({ ...formData, siSo: parseInt(e.target.value) })}
                            placeholder="Nhập sĩ số"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="giaoVienChuNhiem" className="font-medium">
                            Giáo viên chủ nhiệm
                        </label>
                        <InputText
                            id="giaoVienChuNhiem"
                            value={formData.giaoVienChuNhiem}
                            onChange={(e) => setFormData({ ...formData, giaoVienChuNhiem: e.target.value })}
                            placeholder="Nhập tên giáo viên chủ nhiệm"
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
                    Bạn có chắc chắn muốn xóa lớp{' '}
                    <strong>{selectedClass?.tenLop}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 