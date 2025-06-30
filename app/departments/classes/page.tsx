/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import classService, { Class } from '../../services/classService';
import departmentService, { Department } from '../../services/departmentService';
import React from 'react';

export default function ClassListPage() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Class>({
        maLop: '',
        tenLop: '',
        maKhoa: '',
        khoaHoc: '',
        trangThai: 1
    });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchClasses = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await classService.getAllClasses();
            setClasses(res.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách lớp');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
        departmentService.getAllDepartments().then(res => setDepartments(res.data)).catch(() => setDepartments([]));
    }, []);

    const handleEdit = (cls: Class) => {
        setFormData(cls);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = (cls: Class) => {
        confirmDialog({
            message: (
                <div>
                    <span>Bạn có chắc chắn muốn xóa lớp <b>{cls.tenLop}</b>?</span>
                    <div className="mt-3 text-red-600">
                        <b>Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến lớp này, bao gồm:</b>
                        <ul className="list-disc ml-6 mt-1">
                            <li>Thông tin lớp</li>
                            <li>Danh sách sinh viên thuộc lớp</li>
                            <li>Các thông tin liên quan khác</li>
                        </ul>
                        <div className="mt-2 font-bold">Hành động này không thể hoàn tác!</div>
                    </div>
                </div>
            ),
            header: 'Xác nhận xóa lớp',
            icon: 'pi pi-exclamation-triangle text-3xl text-red-500',
            acceptClassName: 'p-button-danger',
            rejectLabel: 'Hủy',
            acceptLabel: 'Xóa',
            accept: async () => {
                try {
                    await classService.deleteClass(cls.maLop);
                    setClasses(classes.filter(c => c.maLop !== cls.maLop));
                    setSuccess('Xóa lớp thành công');
                    setTimeout(() => setSuccess(''), 2500);
                } catch (err: any) {
                    setError(err.message || 'Xóa lớp thất bại');
                    setTimeout(() => setError(''), 2500);
                }
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await classService.updateClass(formData.maLop, formData);
                setClasses(classes.map(c => c.maLop === formData.maLop ? formData : c));
                setSuccess('Cập nhật lớp thành công');
            } else {
                const newClass = await classService.createClass(formData);
                setClasses([...classes, newClass]);
                setSuccess('Thêm lớp thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: any) {
            setError(err.message || 'Lưu lớp thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const filteredClasses = classes.filter(cls =>
        (cls.maLop?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (cls.tenLop?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <ConfirmDialog />
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý lớp</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã, tên lớp..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button label="Thêm lớp" icon="pi pi-plus" onClick={() => { setFormData({ maLop: '', tenLop: '', maKhoa: departments[0]?.maKhoa || '', khoaHoc: '', trangThai: 1 }); setIsEdit(false); setEditDialogVisible(true); }} />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã lớp</th>
                                <th className="px-4 py-2 text-left">Tên lớp</th>
                                <th className="px-4 py-2 text-left">Khoa</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map(cls => {
                                const khoa = departments.find(dep => dep.maKhoa === cls.maKhoa);
                                return (
                                    <tr key={cls.maLop} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{cls.maLop}</td>
                                        <td className="px-4 py-2">{cls.tenLop}</td>
                                        <td className="px-4 py-2">{khoa ? khoa.tenKhoa : cls.maKhoa}</td>
                                        <td className="px-4 py-2">{cls.trangThai === 1 ? 'Hoạt động' : 'Ngừng'}</td>
                                        <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(cls)} />
                                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => handleDelete(cls)} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={isEdit ? 'Sửa lớp' : 'Thêm lớp'}
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
                        <label htmlFor="maLop" className="text-gray-700 font-medium">Mã lớp</label>
                        <input id="maLop" value={formData.maLop} onChange={e => setFormData({ ...formData, maLop: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required disabled={isEdit} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenLop" className="text-gray-700 font-medium">Tên lớp</label>
                        <input id="tenLop" value={formData.tenLop} onChange={e => setFormData({ ...formData, tenLop: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maKhoa" className="text-gray-700 font-medium">Khoa</label>
                        <select id="maKhoa" value={formData.maKhoa} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required>
                            {departments.map(dep => (
                                <option key={dep.maKhoa} value={dep.maKhoa}>{dep.tenKhoa}</option>
                            ))}
                        </select>
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