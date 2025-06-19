'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useRouter, useParams } from 'next/navigation';

interface CourseClass {
    maLopHocPhan: string;
    tenLopHocPhan: string;
    hocKy: string;
    namHoc: string;
    siSoToiDa: number;
    siSoHienTai: number;
    giangVien: string;
    phongHoc: string;
    ngayBatDau: string;
    ngayKetThuc: string;
}

export default function CourseClassManagementPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;

    const [courseClasses] = useState<CourseClass[]>([
        {
            maLopHocPhan: 'LHP001',
            tenLopHocPhan: 'Lập trình Web - Nhóm 1',
            hocKy: '1',
            namHoc: '2023-2024',
            siSoToiDa: 50,
            siSoHienTai: 30,
            giangVien: 'Nguyễn Văn A',
            phongHoc: 'A101',
            ngayBatDau: '2023-09-01',
            ngayKetThuc: '2023-12-31'
        },
        {
            maLopHocPhan: 'LHP002',
            tenLopHocPhan: 'Lập trình Web - Nhóm 2',
            hocKy: '1',
            namHoc: '2023-2024',
            siSoToiDa: 50,
            siSoHienTai: 25,
            giangVien: 'Trần Thị B',
            phongHoc: 'A102',
            ngayBatDau: '2023-09-01',
            ngayKetThuc: '2023-12-31'
        }
    ]);

    const [semesters] = useState([
        { label: 'Học kỳ 1', value: '1' },
        { label: 'Học kỳ 2', value: '2' },
        { label: 'Học kỳ 3', value: '3' }
    ]);

    const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<CourseClass>({
        maLopHocPhan: '',
        tenLopHocPhan: '',
        hocKy: '',
        namHoc: '',
        siSoToiDa: 0,
        siSoHienTai: 0,
        giangVien: '',
        phongHoc: '',
        ngayBatDau: '',
        ngayKetThuc: ''
    });

    const actionTemplate = (rowData: CourseClass) => {
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
                    tooltip="Xem sinh viên đăng ký"
                    onClick={() => router.push(`/courses/${courseId}/classes/${rowData.maLopHocPhan}/students`)}
                />
                <Button
                    icon="pi pi-calendar"
                    className="p-button-rounded p-button-warning"
                    tooltip="Xem lịch học"
                    onClick={() => router.push(`/courses/${courseId}/classes/${rowData.maLopHocPhan}/schedule`)}
                />
            </div>
        );
    };

    const handleEdit = () => {
        // TODO: Implement edit logic
        console.log('Editing course class:', formData);
        setEditDialogVisible(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log('Deleting course class:', selectedClass);
        setDeleteDialogVisible(false);
        setSelectedClass(null);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Quản lý Lớp học phần</h1>
                    <p className="text-gray-600">Mã học phần: {courseId}</p>
                </div>
                <Button
                    label="Thêm lớp học phần"
                    icon="pi pi-plus"
                    onClick={() => {
                        setFormData({
                            maLopHocPhan: '',
                            tenLopHocPhan: '',
                            hocKy: '',
                            namHoc: '',
                            siSoToiDa: 0,
                            siSoHienTai: 0,
                            giangVien: '',
                            phongHoc: '',
                            ngayBatDau: '',
                            ngayKetThuc: ''
                        });
                        setEditDialogVisible(true);
                    }}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <span className="p-input-icon-left">
                    <InputText placeholder="Tìm kiếm lớp học phần..." />
                </span>
            </div>

            <DataTable
                value={courseClasses}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không tìm thấy lớp học phần nào"
            >
                <Column field="maLopHocPhan" header="Mã lớp" sortable />
                <Column field="tenLopHocPhan" header="Tên lớp" sortable />
                <Column field="hocKy" header="Học kỳ" sortable />
                <Column field="namHoc" header="Năm học" sortable />
                <Column field="siSoToiDa" header="Sĩ số tối đa" sortable />
                <Column field="siSoHienTai" header="Sĩ số hiện tại" sortable />
                <Column field="giangVien" header="Giảng viên" sortable />
                <Column field="phongHoc" header="Phòng học" sortable />
                <Column body={actionTemplate} style={{ width: '16rem' }} />
            </DataTable>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={formData.maLopHocPhan ? 'Sửa lớp học phần' : 'Thêm lớp học phần mới'}
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
                        <label htmlFor="maLopHocPhan" className="font-medium">
                            Mã lớp học phần
                        </label>
                        <InputText
                            id="maLopHocPhan"
                            value={formData.maLopHocPhan}
                            onChange={(e) => setFormData({ ...formData, maLopHocPhan: e.target.value })}
                            placeholder="Nhập mã lớp học phần"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tenLopHocPhan" className="font-medium">
                            Tên lớp học phần
                        </label>
                        <InputText
                            id="tenLopHocPhan"
                            value={formData.tenLopHocPhan}
                            onChange={(e) => setFormData({ ...formData, tenLopHocPhan: e.target.value })}
                            placeholder="Nhập tên lớp học phần"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="hocKy" className="font-medium">
                            Học kỳ
                        </label>
                        <Dropdown
                            id="hocKy"
                            value={formData.hocKy}
                            options={semesters}
                            onChange={(e) => setFormData({ ...formData, hocKy: e.value })}
                            placeholder="Chọn học kỳ"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="namHoc" className="font-medium">
                            Năm học
                        </label>
                        <InputText
                            id="namHoc"
                            value={formData.namHoc}
                            onChange={(e) => setFormData({ ...formData, namHoc: e.target.value })}
                            placeholder="Nhập năm học (VD: 2023-2024)"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="siSoToiDa" className="font-medium">
                            Sĩ số tối đa
                        </label>
                        <InputText
                            id="siSoToiDa"
                            type="number"
                            value={formData.siSoToiDa.toString()}
                            onChange={(e) => setFormData({ ...formData, siSoToiDa: parseInt(e.target.value) })}
                            placeholder="Nhập sĩ số tối đa"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="giangVien" className="font-medium">
                            Giảng viên
                        </label>
                        <InputText
                            id="giangVien"
                            value={formData.giangVien}
                            onChange={(e) => setFormData({ ...formData, giangVien: e.target.value })}
                            placeholder="Nhập tên giảng viên"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="phongHoc" className="font-medium">
                            Phòng học
                        </label>
                        <InputText
                            id="phongHoc"
                            value={formData.phongHoc}
                            onChange={(e) => setFormData({ ...formData, phongHoc: e.target.value })}
                            placeholder="Nhập phòng học"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="ngayBatDau" className="font-medium">
                            Ngày bắt đầu
                        </label>
                        <InputText
                            id="ngayBatDau"
                            type="date"
                            value={formData.ngayBatDau}
                            onChange={(e) => setFormData({ ...formData, ngayBatDau: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="ngayKetThuc" className="font-medium">
                            Ngày kết thúc
                        </label>
                        <InputText
                            id="ngayKetThuc"
                            type="date"
                            value={formData.ngayKetThuc}
                            onChange={(e) => setFormData({ ...formData, ngayKetThuc: e.target.value })}
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
                    Bạn có chắc chắn muốn xóa lớp học phần{' '}
                    <strong>{selectedClass?.tenLopHocPhan}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 