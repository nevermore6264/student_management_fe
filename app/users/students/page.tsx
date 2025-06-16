/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import studentService from '../../../app/services/studentService';

interface Student {
    maSinhVien: string;
    hoTenSinhVien: string;
    ngaySinh: string;
    gioiTinh: boolean;
    email: string;
    soDienThoai: string;
    diaChi: string;
}

export default function StudentListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Student>({
        maSinhVien: '',
        hoTenSinhVien: '',
        ngaySinh: '',
        gioiTinh: true,
        email: '',
        soDienThoai: '',
        diaChi: ''
    });
    const [saving, setSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await studentService.getAllStudents();
            setStudents(res?.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách sinh viên');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleEdit = (student: Student) => {
        setFormData(student);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await studentService.deleteStudent(id);
            setSuccess('Xóa sinh viên thành công');
            setTimeout(() => setSuccess(''), 2500);
            fetchStudents();
        } catch (err: any) {
            setError(err.message || 'Xóa sinh viên thất bại');
            setTimeout(() => setError(''), 2500);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let localDateTime = formData.ngaySinh;
            if (localDateTime && !localDateTime.includes('T')) {
                localDateTime = `${localDateTime}T00:00:00`;
            }
            const payload = { ...formData, ngaySinh: localDateTime };
            if (isEdit) {
                await studentService.updateStudent(formData.maSinhVien, payload);
                setSuccess('Cập nhật sinh viên thành công');
            } else {
                await studentService.createStudent(payload);
                setSuccess('Thêm sinh viên thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
            fetchStudents();
        } catch (err: any) {
            setError(err.message || 'Lưu sinh viên thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý sinh viên</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex justify-end mb-4">
                <Button label="Thêm sinh viên" icon="pi pi-plus" onClick={() => { setFormData({ maSinhVien: '', hoTenSinhVien: '', ngaySinh: '', gioiTinh: true, email: '', soDienThoai: '', diaChi: '' }); setIsEdit(false); setEditDialogVisible(true); }} />
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã SV</th>
                                <th className="px-4 py-2 text-left">Họ tên</th>
                                <th className="px-4 py-2 text-left">Ngày sinh</th>
                                <th className="px-4 py-2 text-left">Giới tính</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">SĐT</th>
                                <th className="px-4 py-2 text-left">Địa chỉ</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((sv) => (
                                <tr key={sv.maSinhVien} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{sv.maSinhVien}</td>
                                    <td className="px-4 py-2">{sv.hoTenSinhVien}</td>
                                    <td className="px-4 py-2">{sv.ngaySinh ? sv.ngaySinh.slice(0, 10) : ''}</td>
                                    <td className="px-4 py-2">{sv.gioiTinh ? 'Nam' : 'Nữ'}</td>
                                    <td className="px-4 py-2">{sv.email}</td>
                                    <td className="px-4 py-2">{sv.soDienThoai}</td>
                                    <td className="px-4 py-2">{sv.diaChi}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(sv)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => { setStudentToDelete(sv); }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={isEdit ? 'Sửa sinh viên' : 'Thêm sinh viên'}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300" onClick={() => setEditDialogVisible(false)} disabled={saving}>Hủy</button>
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700" onClick={handleSave} disabled={saving}>Lưu</button>
                    </div>
                }
            >
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maSinhVien" className="text-gray-700 font-medium">Mã sinh viên</label>
                        <input id="maSinhVien" value={formData.maSinhVien} onChange={e => setFormData({ ...formData, maSinhVien: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required disabled={isEdit} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="hoTenSinhVien" className="text-gray-700 font-medium">Họ tên</label>
                        <input id="hoTenSinhVien" value={formData.hoTenSinhVien} onChange={e => setFormData({ ...formData, hoTenSinhVien: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ngaySinh" className="text-gray-700 font-medium">Ngày sinh</label>
                        <input id="ngaySinh" type="date" value={formData.ngaySinh ? formData.ngaySinh.slice(0, 10) : ''} onChange={e => setFormData({ ...formData, ngaySinh: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="gioiTinh" className="text-gray-700 font-medium">Giới tính</label>
                        <select id="gioiTinh" value={formData.gioiTinh ? 'true' : 'false'} onChange={e => setFormData({ ...formData, gioiTinh: e.target.value === 'true' })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                            <option value="true">Nam</option>
                            <option value="false">Nữ</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input id="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soDienThoai" className="text-gray-700 font-medium">Số điện thoại</label>
                        <input id="soDienThoai" value={formData.soDienThoai} onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diaChi" className="text-gray-700 font-medium">Địa chỉ</label>
                        <input id="diaChi" value={formData.diaChi} onChange={e => setFormData({ ...formData, diaChi: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                </form>
            </Dialog>
            <ConfirmDialog
                visible={!!studentToDelete}
                onHide={() => setStudentToDelete(null)}
                header="Xác nhận xóa sinh viên"
                message={
                    <div className="flex flex-col gap-2">
                        <p>Bạn có chắc chắn muốn xóa sinh viên <strong>{studentToDelete?.hoTenSinhVien}</strong>?</p>
                        <p className="text-red-600 font-medium">Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến sinh viên này, bao gồm:</p>
                        <ul className="list-disc pl-6 text-red-600">
                            <li>Thông tin cá nhân</li>
                            <li>Kết quả học tập</li>
                            <li>Lịch sử đăng ký học phần</li>
                            <li>Các thông tin liên quan khác</li>
                        </ul>
                        <p className="text-red-600 font-medium">Hành động này không thể hoàn tác!</p>
                    </div>
                }
                icon="pi pi-exclamation-triangle"
                acceptClassName="p-button-danger"
                acceptLabel="Xóa"
                rejectLabel="Hủy"
                accept={() => {
                    if (studentToDelete) {
                        handleDelete(studentToDelete.maSinhVien);
                        setStudentToDelete(null);
                    }
                }}
                reject={() => setStudentToDelete(null)}
            />
        </div>
    );
} 