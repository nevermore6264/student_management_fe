'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
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

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Course>({
        maHocPhan: '',
        tenHocPhan: '',
        soTinChi: 0,
        loaiHocPhan: '',
        moTa: '',
        maKhoa: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);

    const handleEdit = (course: Course) => {
        setFormData(course);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = (course: Course) => {
        confirmDialog({
            message: (
                <div>
                    <span>Bạn có chắc chắn muốn xóa học phần <b>{course.tenHocPhan}</b>?</span>
                    <div className="mt-3 text-red-600">
                        <b>Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến học phần này, bao gồm:</b>
                        <ul className="list-disc ml-6 mt-1">
                            <li>Thông tin học phần</li>
                            <li>Danh sách lớp học phần</li>
                            <li>Các thông tin liên quan khác</li>
                        </ul>
                        <div className="mt-2 font-bold">Hành động này không thể hoàn tác!</div>
                    </div>
                </div>
            ),
            header: 'Xác nhận xóa học phần',
            icon: 'pi pi-exclamation-triangle text-3xl text-red-500',
            acceptClassName: 'p-button-danger',
            rejectLabel: 'Hủy',
            acceptLabel: 'Xóa',
            accept: () => {
                // TODO: Implement delete logic
                console.log('Deleting course:', course);
                setSuccess('Xóa học phần thành công');
                setTimeout(() => setSuccess(''), 2500);
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement save logic
            console.log('Saving course:', formData);
            setSuccess(isEdit ? 'Cập nhật học phần thành công' : 'Thêm học phần thành công');
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lưu học phần thất bại';
            setError(errorMessage);
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.maHocPhan?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (course.tenHocPhan?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (course.maKhoa?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <ConfirmDialog />
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý học phần</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã, tên học phần, khoa..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
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
                            setIsEdit(false);
                            setEditDialogVisible(true);
                        }}
                    />
                </div>
            </div>
            <div className="overflow-x-auto w-full">
                <table className="w-full border rounded-lg overflow-hidden">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-4 py-2 text-left">Mã học phần</th>
                            <th className="px-4 py-2 text-left">Tên học phần</th>
                            <th className="px-4 py-2 text-left">Số tín chỉ</th>
                            <th className="px-4 py-2 text-left">Loại học phần</th>
                            <th className="px-4 py-2 text-left">Khoa</th>
                            <th className="px-4 py-2 text-left">Mô tả</th>
                            <th className="px-4 py-2 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(course => (
                            <tr key={course.maHocPhan} className="border-b hover:bg-blue-50">
                                <td className="px-4 py-2 font-mono">{course.maHocPhan}</td>
                                <td className="px-4 py-2">{course.tenHocPhan}</td>
                                <td className="px-4 py-2">{course.soTinChi}</td>
                                <td className="px-4 py-2">{course.loaiHocPhan}</td>
                                <td className="px-4 py-2">{course.maKhoa}</td>
                                <td className="px-4 py-2">{course.moTa}</td>
                                <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                    <Button
                                        icon="pi pi-pencil"
                                        className="p-button-rounded p-button-warning text-lg"
                                        onClick={() => handleEdit(course)}
                                    />
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger text-lg"
                                        onClick={() => handleDelete(course)}
                                    />
                                    <Button
                                        icon="pi pi-list"
                                        className="p-button-rounded p-button-info text-lg"
                                        tooltip="Xem lớp học phần"
                                        onClick={() => router.push(`/courses/${course.maHocPhan}/classes`)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={isEdit ? 'Sửa học phần' : 'Thêm học phần mới'}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                            onClick={() => setEditDialogVisible(false)}
                            disabled={saving}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            Lưu
                        </button>
                    </div>
                }
            >
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maHocPhan" className="text-gray-700 font-medium">
                            Mã học phần
                        </label>
                        <input
                            id="maHocPhan"
                            value={formData.maHocPhan}
                            onChange={(e) => setFormData({ ...formData, maHocPhan: e.target.value })}
                            placeholder="Nhập mã học phần"
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                            disabled={isEdit}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenHocPhan" className="text-gray-700 font-medium">
                            Tên học phần
                        </label>
                        <input
                            id="tenHocPhan"
                            value={formData.tenHocPhan}
                            onChange={(e) => setFormData({ ...formData, tenHocPhan: e.target.value })}
                            placeholder="Nhập tên học phần"
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="soTinChi" className="text-gray-700 font-medium">
                            Số tín chỉ
                        </label>
                        <input
                            id="soTinChi"
                            type="number"
                            value={formData.soTinChi.toString()}
                            onChange={(e) => setFormData({ ...formData, soTinChi: parseInt(e.target.value) || 0 })}
                            placeholder="Nhập số tín chỉ"
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="loaiHocPhan" className="text-gray-700 font-medium">
                            Loại học phần
                        </label>
                        <select
                            id="loaiHocPhan"
                            value={formData.loaiHocPhan}
                            onChange={(e) => setFormData({ ...formData, loaiHocPhan: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="">Chọn loại học phần</option>
                            {courseTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="maKhoa" className="text-gray-700 font-medium">
                            Khoa
                        </label>
                        <select
                            id="maKhoa"
                            value={formData.maKhoa}
                            onChange={(e) => setFormData({ ...formData, maKhoa: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="">Chọn khoa</option>
                            {departments.map(dept => (
                                <option key={dept.value} value={dept.value}>
                                    {dept.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="moTa" className="text-gray-700 font-medium">
                            Mô tả
                        </label>
                        <textarea
                            id="moTa"
                            value={formData.moTa}
                            onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                            placeholder="Nhập mô tả"
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            rows={3}
                            required
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
} 