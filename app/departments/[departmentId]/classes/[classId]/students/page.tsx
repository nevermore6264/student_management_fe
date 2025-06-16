'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { useRouter, useParams } from 'next/navigation';

interface Student {
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: string;
    diaChi: string;
    email: string;
    soDienThoai: string;
}

export default function StudentListPage() {
    const router = useRouter();
    const params = useParams();
    const departmentId = params.departmentId as string;
    const classId = params.classId as string;

    const [students] = useState<Student[]>([
        {
            maSinhVien: 'SV001',
            hoTen: 'Nguyễn Văn A',
            ngaySinh: '2000-01-01',
            gioiTinh: 'Nam',
            diaChi: 'Hà Nội',
            email: 'nguyenvana@example.com',
            soDienThoai: '0123456789'
        },
        {
            maSinhVien: 'SV002',
            hoTen: 'Trần Thị B',
            ngaySinh: '2000-02-02',
            gioiTinh: 'Nữ',
            diaChi: 'Hồ Chí Minh',
            email: 'tranthib@example.com',
            soDienThoai: '0987654321'
        }
    ]);

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Student>({
        maSinhVien: '',
        hoTen: '',
        ngaySinh: '',
        gioiTinh: '',
        diaChi: '',
        email: '',
        soDienThoai: ''
    });

    const actionTemplate = (rowData: Student) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    tooltip="Sửa"
                    onClick={() => {
                        setSelectedStudent(rowData);
                        setFormData(rowData);
                        setEditDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    tooltip="Xóa"
                    onClick={() => {
                        setSelectedStudent(rowData);
                        setDeleteDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-book"
                    className="p-button-rounded p-button-info"
                    tooltip="Xem kết quả học tập"
                    onClick={() => router.push(`/students/${rowData.maSinhVien}/academic-results`)}
                />
            </div>
        );
    };

    const handleEdit = () => {
        // TODO: Implement edit logic
        console.log('Editing student:', formData);
        setEditDialogVisible(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log('Deleting student:', selectedStudent);
        setDeleteDialogVisible(false);
        setSelectedStudent(null);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Danh sách sinh viên</h1>
                    <p className="text-gray-600">
                        Khoa: {departmentId} - Lớp: {classId}
                    </p>
                </div>
                <Button
                    label="Thêm sinh viên"
                    icon="pi pi-plus"
                    onClick={() => {
                        setFormData({
                            maSinhVien: '',
                            hoTen: '',
                            ngaySinh: '',
                            gioiTinh: '',
                            diaChi: '',
                            email: '',
                            soDienThoai: ''
                        });
                        setEditDialogVisible(true);
                    }}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText placeholder="Tìm kiếm sinh viên..." />
                </span>
            </div>

            <DataTable
                value={students}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không tìm thấy sinh viên nào"
            >
                <Column field="maSinhVien" header="Mã sinh viên" sortable />
                <Column field="hoTen" header="Họ tên" sortable />
                <Column field="ngaySinh" header="Ngày sinh" sortable />
                <Column field="gioiTinh" header="Giới tính" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="soDienThoai" header="Số điện thoại" sortable />
                <Column body={actionTemplate} style={{ width: '12rem' }} />
            </DataTable>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={formData.maSinhVien ? 'Sửa sinh viên' : 'Thêm sinh viên mới'}
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
                        <label htmlFor="maSinhVien" className="font-medium">
                            Mã sinh viên
                        </label>
                        <InputText
                            id="maSinhVien"
                            value={formData.maSinhVien}
                            onChange={(e) => setFormData({ ...formData, maSinhVien: e.target.value })}
                            placeholder="Nhập mã sinh viên"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="hoTen" className="font-medium">
                            Họ tên
                        </label>
                        <InputText
                            id="hoTen"
                            value={formData.hoTen}
                            onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                            placeholder="Nhập họ tên"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="ngaySinh" className="font-medium">
                            Ngày sinh
                        </label>
                        <InputText
                            id="ngaySinh"
                            type="date"
                            value={formData.ngaySinh}
                            onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="gioiTinh" className="font-medium">
                            Giới tính
                        </label>
                        <InputText
                            id="gioiTinh"
                            value={formData.gioiTinh}
                            onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                            placeholder="Nhập giới tính"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="diaChi" className="font-medium">
                            Địa chỉ
                        </label>
                        <InputText
                            id="diaChi"
                            value={formData.diaChi}
                            onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                            placeholder="Nhập địa chỉ"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="email" className="font-medium">
                            Email
                        </label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="Nhập email"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="soDienThoai" className="font-medium">
                            Số điện thoại
                        </label>
                        <InputText
                            id="soDienThoai"
                            value={formData.soDienThoai}
                            onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                            placeholder="Nhập số điện thoại"
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
                    Bạn có chắc chắn muốn xóa sinh viên{' '}
                    <strong>{selectedStudent?.hoTen}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 