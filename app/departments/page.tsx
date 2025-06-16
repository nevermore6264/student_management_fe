/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import departmentService, { Department } from '../services/departmentService';

export default function DepartmentListPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Department>({
        maKhoa: '',
        tenKhoa: '',
        soDienThoai: '',
        email: '',
        diaChi: '',
        maTruong: 'UTE',
        trangThai: 1
    });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchDepartments = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await departmentService.getAllDepartments();
            setDepartments(res.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách khoa');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleEdit = (dep: Department) => {
        setFormData(dep);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = (dep: Department) => {
        confirmDialog({
            message: (
                <div>
                    <span>Bạn có chắc chắn muốn xóa khoa <b>{dep.tenKhoa}</b>?</span>
                    <div className="mt-3 text-red-600">
                        <b>Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến khoa này, bao gồm:</b>
                        <ul className="list-disc ml-6 mt-1">
                            <li>Thông tin khoa</li>
                            <li>Danh sách giảng viên, sinh viên thuộc khoa</li>
                            <li>Các thông tin liên quan khác</li>
                        </ul>
                        <div className="mt-2 font-bold">Hành động này không thể hoàn tác!</div>
                    </div>
                </div>
            ),
            header: 'Xác nhận xóa khoa',
            icon: 'pi pi-exclamation-triangle text-3xl text-red-500',
            acceptClassName: 'p-button-danger',
            rejectLabel: 'Hủy',
            acceptLabel: 'Xóa',
            accept: async () => {
                try {
                    await departmentService.deleteDepartment(dep.maKhoa);
                    setDepartments(departments.filter(d => d.maKhoa !== dep.maKhoa));
                    setSuccess('Xóa khoa thành công');
                    setTimeout(() => setSuccess(''), 2500);
                } catch (err: any) {
                    setError(err.message || 'Xóa khoa thất bại');
                    setTimeout(() => setError(''), 2500);
                }
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await departmentService.updateDepartment(formData.maKhoa, formData);
                setDepartments(departments.map(d => d.maKhoa === formData.maKhoa ? formData : d));
                setSuccess('Cập nhật khoa thành công');
            } else {
                const newDepartment = await departmentService.createDepartment(formData);
                setDepartments([...departments, newDepartment]);
                setSuccess('Thêm khoa thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: any) {
            setError(err.message || 'Lưu khoa thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const filteredDepartments = departments.filter(dep =>
        (dep.maKhoa?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (dep.tenKhoa?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <ConfirmDialog />
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý khoa</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã, tên khoa..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button label="Thêm khoa" icon="pi pi-plus" onClick={() => { setFormData({ maKhoa: '', tenKhoa: '', soDienThoai: '', email: '', diaChi: '', maTruong: 'UTE', trangThai: 1 }); setIsEdit(false); setEditDialogVisible(true); }} />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã khoa</th>
                                <th className="px-4 py-2 text-left">Tên khoa</th>
                                <th className="px-4 py-2 text-left">Số điện thoại</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Địa chỉ</th>
                                <th className="px-4 py-2 text-left">Mã trường</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.map(dep => (
                                <tr key={dep.maKhoa} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{dep.maKhoa}</td>
                                    <td className="px-4 py-2">{dep.tenKhoa}</td>
                                    <td className="px-4 py-2">{dep.soDienThoai}</td>
                                    <td className="px-4 py-2">{dep.email}</td>
                                    <td className="px-4 py-2">{dep.diaChi}</td>
                                    <td className="px-4 py-2">UTE</td>
                                    <td className="px-4 py-2">{dep.trangThai === 1 ? 'Hoạt động' : 'Ngừng'}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(dep)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => handleDelete(dep)} />
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
                header={isEdit ? 'Sửa khoa' : 'Thêm khoa'}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300" onClick={() => setEditDialogVisible(false)} disabled={saving}>Hủy</button>
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700" onClick={handleSave} disabled={saving}>Lưu</button>
                    </div>
                }
            >
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maKhoa" className="text-gray-700 font-medium">Mã khoa</label>
                        <input id="maKhoa" value={formData.maKhoa} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required disabled={isEdit} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenKhoa" className="text-gray-700 font-medium">Tên khoa</label>
                        <input id="tenKhoa" value={formData.tenKhoa} onChange={e => setFormData({ ...formData, tenKhoa: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soDienThoai" className="text-gray-700 font-medium">Số điện thoại</label>
                        <input id="soDienThoai" value={formData.soDienThoai} onChange={e => setFormData({ ...formData, soDienThoai: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input id="email" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diaChi" className="text-gray-700 font-medium">Địa chỉ</label>
                        <input id="diaChi" value={formData.diaChi} onChange={e => setFormData({ ...formData, diaChi: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maTruong" className="text-gray-700 font-medium">Mã trường</label>
                        <input id="maTruong" disabled value={formData.maTruong} onChange={e => setFormData({ ...formData, maTruong: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="trangThai" className="text-gray-700 font-medium">Trạng thái</label>
                        <select id="trangThai" value={formData.trangThai} onChange={e => setFormData({ ...formData, trangThai: Number(e.target.value) })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                            <option value={1}>Hoạt động</option>
                            <option value={0}>Ngừng</option>
                        </select>
                    </div>
                </form>
            </Dialog>
        </div>
    );
} 