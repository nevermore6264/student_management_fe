/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import classSectionService, { ClassSection } from '../../../services/classSectionService';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';

export default function CourseClassManagementPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.courseId as string;

    const [classes, setClasses] = useState<ClassSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchText, setSearchText] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<ClassSection>({
        maLopHP: '',
        maHocPhan: courseId,
        tenLopHP: '',
        soLuong: 0,
        giangVien: '',
        thoiGianBatDau: '',
        thoiGianKetThuc: '',
        phongHoc: '',
        trangThai: true
    });
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<ClassSection | null>(null);

    useEffect(() => {
        fetchClasses();
    }, [courseId]);

    const fetchClasses = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await classSectionService.getClassSectionsByCourse(courseId);
            setClasses(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                const updated = await classSectionService.updateClassSection(formData.maLopHP, formData);
                setClasses(classes.map(c => c.maLopHP === updated.maLopHP ? updated : c));
                setSuccess('Cập nhật lớp học phần thành công');
            } else {
                const created = await classSectionService.createClassSection(formData);
                setClasses([...classes, created]);
                setSuccess('Thêm lớp học phần thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Lưu lớp học phần thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (cls: ClassSection) => {
        setFormData(cls);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            await classSectionService.deleteClassSection(deleteTarget.maLopHP);
            setClasses(classes.filter(c => c.maLopHP !== deleteTarget.maLopHP));
            setSuccess('Xóa lớp học phần thành công');
            setTimeout(() => setSuccess(''), 2500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Xóa lớp học phần thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
            setDeleteTarget(null);
        }
    };

    const filteredClasses = classes.filter(lop =>
        (lop.maLopHP?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (lop.tenLopHP?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <div className="w-full mb-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center mb-2">Quản lý Lớp học phần</h1>
                <p className="text-gray-600 text-center">Mã học phần: {courseId}</p>
            </div>

            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã, tên lớp học phần..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button
                        label="Thêm lớp học phần"
                        icon="pi pi-plus"
                        onClick={() => {
                            setFormData({
                                maLopHP: '',
                                maHocPhan: courseId,
                                tenLopHP: '',
                                soLuong: 0,
                                giangVien: '',
                                thoiGianBatDau: '',
                                thoiGianKetThuc: '',
                                phongHoc: '',
                                trangThai: true
                            });
                            setIsEdit(false);
                            setEditDialogVisible(true);
                        }}
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
                                <th className="px-4 py-2">Mã lớp HP</th>
                                <th className="px-4 py-2">Tên lớp HP</th>
                                <th className="px-4 py-2">Số lượng</th>
                                <th className="px-4 py-2">Giảng viên</th>
                                <th className="px-4 py-2">Thời gian bắt đầu</th>
                                <th className="px-4 py-2">Thời gian kết thúc</th>
                                <th className="px-4 py-2">Phòng học</th>
                                <th className="px-4 py-2">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClasses.map(lop => (
                                <tr key={lop.maLopHP} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{lop.maLopHP}</td>
                                    <td className="px-4 py-2">{lop.tenLopHP}</td>
                                    <td className="px-4 py-2">{lop.soLuong}</td>
                                    <td className="px-4 py-2">{lop.giangVien}</td>
                                    <td className="px-4 py-2">{new Date(lop.thoiGianBatDau).toLocaleString()}</td>
                                    <td className="px-4 py-2">{new Date(lop.thoiGianKetThuc).toLocaleString()}</td>
                                    <td className="px-4 py-2">{lop.phongHoc}</td>
                                    <td className="px-4 py-2">{lop.trangThai ? 'Hoạt động' : 'Ngừng'}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button
                                            icon="pi pi-pencil"
                                            className="p-button-rounded p-button-warning text-lg"
                                            onClick={() => handleEdit(lop)}
                                        />
                                        <Button
                                            icon="pi pi-trash"
                                            className="p-button-rounded p-button-danger text-lg"
                                            onClick={() => setDeleteTarget(lop)}
                                        />
                                        <Button
                                            icon="pi pi-users"
                                            className="p-button-rounded p-button-info text-lg"
                                            tooltip="Xem sinh viên"
                                            onClick={() => router.push(`/courses/${courseId}/classes/${lop.maLopHP}/students`)}
                                        />
                                        <Button
                                            icon="pi pi-chart-bar"
                                            className="p-button-rounded p-button-success text-lg"
                                            tooltip="Tổng quan điểm"
                                            onClick={() => router.push(`/courses/${courseId}/classes/${lop.maLopHP}/overview`)}
                                        />
                                        <Button
                                            icon="pi pi-file-excel"
                                            className="p-button-rounded p-button-secondary text-lg"
                                            tooltip="Xuất báo cáo"
                                            onClick={() => router.push(`/courses/${courseId}/classes/${lop.maLopHP}/report`)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                header={isEdit ? 'Sửa lớp học phần' : 'Thêm lớp học phần'}
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
                        <label htmlFor="maLopHP" className="text-gray-700 font-medium">Mã lớp HP</label>
                        <input
                            id="maLopHP"
                            value={formData.maLopHP}
                            onChange={e => setFormData({ ...formData, maLopHP: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                            disabled={isEdit}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenLopHP" className="text-gray-700 font-medium">Tên lớp HP</label>
                        <input
                            id="tenLopHP"
                            value={formData.tenLopHP}
                            onChange={e => setFormData({ ...formData, tenLopHP: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soLuong" className="text-gray-700 font-medium">Số lượng</label>
                        <input
                            id="soLuong"
                            type="number"
                            min={0}
                            value={formData.soLuong}
                            onChange={e => setFormData({ ...formData, soLuong: Number(e.target.value) })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="giangVien" className="text-gray-700 font-medium">Giảng viên</label>
                        <input
                            id="giangVien"
                            value={formData.giangVien}
                            onChange={e => setFormData({ ...formData, giangVien: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="thoiGianBatDau" className="text-gray-700 font-medium">Thời gian bắt đầu</label>
                        <input
                            id="thoiGianBatDau"
                            type="datetime-local"
                            value={formData.thoiGianBatDau}
                            onChange={e => setFormData({ ...formData, thoiGianBatDau: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="thoiGianKetThuc" className="text-gray-700 font-medium">Thời gian kết thúc</label>
                        <input
                            id="thoiGianKetThuc"
                            type="datetime-local"
                            value={formData.thoiGianKetThuc}
                            onChange={e => setFormData({ ...formData, thoiGianKetThuc: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phongHoc" className="text-gray-700 font-medium">Phòng học</label>
                        <input
                            id="phongHoc"
                            value={formData.phongHoc}
                            onChange={e => setFormData({ ...formData, phongHoc: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="trangThai" className="text-gray-700 font-medium">Trạng thái</label>
                        <select
                            id="trangThai"
                            value={formData.trangThai ? 'true' : 'false'}
                            onChange={e => setFormData({ ...formData, trangThai: e.target.value === 'true' })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="true">Hoạt động</option>
                            <option value="false">Ngừng</option>
                        </select>
                    </div>
                </form>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                visible={!!deleteTarget}
                onHide={() => setDeleteTarget(null)}
                header="Xác nhận xóa lớp học phần"
                modal
                className="p-fluid w-full max-w-md"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                            onClick={() => setDeleteTarget(null)}
                            disabled={saving}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={saving}
                        >
                            Xóa
                        </button>
                    </div>
                }
            >
                <p>Bạn có chắc chắn muốn xóa lớp học phần <strong>{deleteTarget?.tenLopHP}</strong>?</p>
            </Dialog>
        </div>
    );
} 