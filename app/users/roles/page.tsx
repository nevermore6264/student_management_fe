/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import roleService, { Role } from '../../services/roleService';

export default function RoleManagementPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Role>({ maVaiTro: '', tenVaiTro: '', moTa: '' });
    const [saving, setSaving] = useState(false);

    const fetchRoles = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await roleService.getAllRoles();
            setRoles(res.data || []);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách vai trò');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleEdit = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await roleService.updateRole(formData.maVaiTro, formData);
            setSuccess('Cập nhật vai trò thành công');
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
            fetchRoles();
        } catch (err: any) {
            setError(err.message || 'Cập nhật vai trò thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="w-4/5 max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý vai trò</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã vai trò</th>
                                <th className="px-4 py-2 text-left">Tên vai trò</th>
                                <th className="px-4 py-2 text-left">Mô tả</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.maVaiTro} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{role.maVaiTro}</td>
                                    <td className="px-4 py-2">{role.tenVaiTro}</td>
                                    <td className="px-4 py-2">{role.moTa}</td>
                                    <td className="px-4 py-2 text-center">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-warning text-lg"
                                            tooltip="Sửa"
                                            onClick={() => {
                                                setFormData(role);
                                                setEditDialogVisible(true);
                                            }}
                                        />
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
                header={formData.maVaiTro ? 'Sửa vai trò' : 'Thêm vai trò mới'}
                modal
                className="p-fluid w-full max-w-3xl"
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
                            onClick={handleEdit}
                            disabled={saving}
                        >
                            Lưu
                        </button>
                    </div>
                }
            >
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maVaiTro" className="text-gray-700 font-medium">Mã vai trò</label>
                        <input
                            id="maVaiTro"
                            value={formData.maVaiTro}
                            disabled
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base cursor-not-allowed text-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenVaiTro" className="text-gray-700 font-medium">Tên vai trò</label>
                        <input
                            id="tenVaiTro"
                            value={formData.tenVaiTro}
                            disabled
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base cursor-not-allowed text-gray-400"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="moTa" className="text-gray-700 font-medium">Mô tả</label>
                        <input
                            id="moTa"
                            value={formData.moTa}
                            onChange={e => setFormData({ ...formData, moTa: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                </form>
            </Dialog>
        </div>
    );
} 