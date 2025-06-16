/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import lecturerService from '../../../app/services/lecturerService';
import departmentService, { Department } from '../../../app/services/departmentService';

interface Lecturer {
    maGiangVien: string;
    tenGiangVien: string;
    email: string;
    soDienThoai: string;
    maKhoa: string;
}

export default function LecturerListPage() {
    const [lecturers, setLecturers] = useState<Lecturer[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Lecturer>({
        maGiangVien: '',
        tenGiangVien: '',
        email: '',
        soDienThoai: '',
        maKhoa: ''
    });
    const [saving, setSaving] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [lecturerToDelete, setLecturerToDelete] = useState<Lecturer | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');

    const fetchDepartments = async () => {
        try {
            const res = await departmentService.getAllDepartments();
            setDepartments(res.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách khoa');
            setTimeout(() => setError(''), 2500);
        }
    };

    const fetchLecturers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await lecturerService.getAllLecturers();
            setLecturers(res?.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách giảng viên');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLecturers();
        fetchDepartments();
    }, []);

    const handleEdit = (lecturer: Lecturer) => {
        setFormData(lecturer);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await lecturerService.deleteLecturer(id);
            setSuccess('Xóa giảng viên thành công');
            setTimeout(() => setSuccess(''), 2500);
            fetchLecturers();
        } catch (err: any) {
            setError(err.message || 'Xóa giảng viên thất bại');
            setTimeout(() => setError(''), 2500);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await lecturerService.updateLecturer(formData.maGiangVien, formData);
                setSuccess('Cập nhật giảng viên thành công');
            } else {
                await lecturerService.createLecturer(formData);
                setSuccess('Thêm giảng viên thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
            fetchLecturers();
        } catch (err: any) {
            setError(err.message || 'Lưu giảng viên thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const filteredLecturers = lecturers.filter(gv => {
        const matchesSearch =
            gv.maGiangVien.toLowerCase().includes(searchText.toLowerCase()) ||
            gv.tenGiangVien.toLowerCase().includes(searchText.toLowerCase()) ||
            gv.email.toLowerCase().includes(searchText.toLowerCase());
        const matchesDepartment = selectedDepartment ? gv.maKhoa === selectedDepartment : true;
        return matchesSearch && matchesDepartment;
    });

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý giảng viên</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex justify-end mb-4">
                <Button label="Thêm giảng viên" icon="pi pi-plus" onClick={() => { setFormData({ maGiangVien: '', tenGiangVien: '', email: '', soDienThoai: '', maKhoa: '' }); setIsEdit(false); setEditDialogVisible(true); }} />
            </div>
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã, tên, email..."
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-1/3">
                    <Dropdown
                        value={selectedDepartment}
                        options={[{ maKhoa: '', tenKhoa: 'Tất cả khoa' }, ...departments]}
                        onChange={e => setSelectedDepartment(e.value)}
                        optionLabel="tenKhoa"
                        optionValue="maKhoa"
                        placeholder="Lọc theo khoa"
                        className="w-full"
                    />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã GV</th>
                                <th className="px-4 py-2 text-left">Họ tên</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">SĐT</th>
                                <th className="px-4 py-2 text-left">Khoa</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLecturers.map((gv) => (
                                <tr key={gv.maGiangVien} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{gv.maGiangVien}</td>
                                    <td className="px-4 py-2">{gv.tenGiangVien}</td>
                                    <td className="px-4 py-2">{gv.email}</td>
                                    <td className="px-4 py-2">{gv.soDienThoai}</td>
                                    <td className="px-4 py-2">{departments.find(d => d.maKhoa === gv.maKhoa)?.tenKhoa || gv.maKhoa}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(gv)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => setLecturerToDelete(gv)} />
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
                header={isEdit ? 'Sửa giảng viên' : 'Thêm giảng viên'}
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
                        <label htmlFor="maGiangVien" className="text-gray-700 font-medium">Mã giảng viên</label>
                        <input id="maGiangVien" value={formData.maGiangVien} onChange={e => setFormData({ ...formData, maGiangVien: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required disabled={isEdit} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenGiangVien" className="text-gray-700 font-medium">Tên giảng viên</label>
                        <input id="tenGiangVien" value={formData.tenGiangVien} onChange={e => setFormData({ ...formData, tenGiangVien: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soDienThoai" className="text-gray-700 font-medium">Số điện thoại</label>
                        <input id="soDienThoai" value={formData.soDienThoai} onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required pattern="\d{10,11}" title="Số điện thoại phải có 10-11 chữ số" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maKhoa" className="text-gray-700 font-medium">Khoa</label>
                        <Dropdown
                            id="maKhoa"
                            value={formData.maKhoa}
                            options={departments}
                            onChange={(e) => setFormData({ ...formData, maKhoa: e.value })}
                            optionLabel="tenKhoa"
                            optionValue="maKhoa"
                            placeholder="Chọn khoa"
                            className="w-full bg-blue-50 border border-gray-200 rounded-md"
                            required
                        />
                    </div>
                </form>
            </Dialog>
            <ConfirmDialog
                visible={!!lecturerToDelete}
                onHide={() => setLecturerToDelete(null)}
                header="Xác nhận xóa giảng viên"
                message={
                    <div className="flex flex-col gap-2">
                        <p>Bạn có chắc chắn muốn xóa giảng viên <strong>{lecturerToDelete?.tenGiangVien}</strong>?</p>
                        <p className="text-red-600 font-medium">Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến giảng viên này, bao gồm:</p>
                        <ul className="list-disc pl-6 text-red-600">
                            <li>Thông tin cá nhân</li>
                            <li>Lịch sử giảng dạy</li>
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
                    if (lecturerToDelete) {
                        handleDelete(lecturerToDelete.maGiangVien);
                        setLecturerToDelete(null);
                    }
                }}
                reject={() => setLecturerToDelete(null)}
            />
        </div>
    );
} 