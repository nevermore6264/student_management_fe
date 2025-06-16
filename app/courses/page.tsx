'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/navigation';

interface Course {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    loaiHocPhan: string;
    moTa: string;
    maKhoa: string;
}

export default function CourseManagementPage() {
    const router = useRouter();
    const [courses] = useState<Course[]>([
        {
            maHocPhan: 'INT1234',
            tenHocPhan: 'Lập trình Web',
            soTinChi: 3,
            loaiHocPhan: 'Bắt buộc',
            moTa: 'Học phần về lập trình web',
            maKhoa: 'CNTT'
        },
        {
            maHocPhan: 'INT1235',
            tenHocPhan: 'Cơ sở dữ liệu',
            soTinChi: 3,
            loaiHocPhan: 'Bắt buộc',
            moTa: 'Học phần về cơ sở dữ liệu',
            maKhoa: 'CNTT'
        }
    ]);

    const [departments] = useState([
        { label: 'Công nghệ thông tin', value: 'CNTT' },
        { label: 'Kế toán', value: 'KT' }
    ]);

    const [courseTypes] = useState([
        { label: 'Bắt buộc', value: 'Bắt buộc' },
        { label: 'Tự chọn', value: 'Tự chọn' }
    ]);

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Course>({
        maHocPhan: '',
        tenHocPhan: '',
        soTinChi: 0,
        loaiHocPhan: '',
        moTa: '',
        maKhoa: ''
    });

    const actionTemplate = (rowData: Course) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-success"
                    tooltip="Sửa"
                    onClick={() => {
                        setSelectedCourse(rowData);
                        setFormData(rowData);
                        setEditDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-danger"
                    tooltip="Xóa"
                    onClick={() => {
                        setSelectedCourse(rowData);
                        setDeleteDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-list"
                    className="p-button-rounded p-button-info"
                    tooltip="Xem lớp học phần"
                    onClick={() => router.push(`/courses/${rowData.maHocPhan}/classes`)}
                />
            </div>
        );
    };

    const handleEdit = () => {
        // TODO: Implement edit logic
        console.log('Editing course:', formData);
        setEditDialogVisible(false);
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log('Deleting course:', selectedCourse);
        setDeleteDialogVisible(false);
        setSelectedCourse(null);
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý Học phần</h1>
                <Button
                    label="Thêm học phần"
                    icon="pi pi-plus"
                    onClick={() => {
                        setFormData({
                            maHocPhan: '',
                            tenHocPhan: '',
                            soTinChi: 0,
                            loaiHocPhan: '',
                            moTa: '',
                            maKhoa: ''
                        });
                        setEditDialogVisible(true);
                    }}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText placeholder="Tìm kiếm học phần..." />
                </span>
            </div>

            <DataTable
                value={courses}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không tìm thấy học phần nào"
            >
                <Column field="maHocPhan" header="Mã học phần" sortable />
                <Column field="tenHocPhan" header="Tên học phần" sortable />
                <Column field="soTinChi" header="Số tín chỉ" sortable />
                <Column field="loaiHocPhan" header="Loại học phần" sortable />
                <Column field="maKhoa" header="Khoa" sortable />
                <Column field="moTa" header="Mô tả" sortable />
                <Column body={actionTemplate} style={{ width: '12rem' }} />
            </DataTable>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={formData.maHocPhan ? 'Sửa học phần' : 'Thêm học phần mới'}
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
                        <label htmlFor="maHocPhan" className="font-medium">
                            Mã học phần
                        </label>
                        <InputText
                            id="maHocPhan"
                            value={formData.maHocPhan}
                            onChange={(e) => setFormData({ ...formData, maHocPhan: e.target.value })}
                            placeholder="Nhập mã học phần"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="tenHocPhan" className="font-medium">
                            Tên học phần
                        </label>
                        <InputText
                            id="tenHocPhan"
                            value={formData.tenHocPhan}
                            onChange={(e) => setFormData({ ...formData, tenHocPhan: e.target.value })}
                            placeholder="Nhập tên học phần"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="soTinChi" className="font-medium">
                            Số tín chỉ
                        </label>
                        <InputText
                            id="soTinChi"
                            type="number"
                            value={formData.soTinChi.toString()}
                            onChange={(e) => setFormData({ ...formData, soTinChi: parseInt(e.target.value) })}
                            placeholder="Nhập số tín chỉ"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="loaiHocPhan" className="font-medium">
                            Loại học phần
                        </label>
                        <Dropdown
                            id="loaiHocPhan"
                            value={formData.loaiHocPhan}
                            options={courseTypes}
                            onChange={(e) => setFormData({ ...formData, loaiHocPhan: e.value })}
                            placeholder="Chọn loại học phần"
                            required
                        />
                    </div>

                    <div className="flex flex-column gap-2">
                        <label htmlFor="maKhoa" className="font-medium">
                            Khoa
                        </label>
                        <Dropdown
                            id="maKhoa"
                            value={formData.maKhoa}
                            options={departments}
                            onChange={(e) => setFormData({ ...formData, maKhoa: e.value })}
                            placeholder="Chọn khoa"
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
                    Bạn có chắc chắn muốn xóa học phần{' '}
                    <strong>{selectedCourse?.tenHocPhan}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 