/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import courseService, { Course } from '../../services/courseService';
import departmentService, { Department } from '../../services/departmentService';

export default function CourseListPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Course>({
        maHocPhan: '',
        tenHocPhan: '',
        soTinChi: 0,
        maKhoa: '',
        moTa: '',
        trangThai: 1
    });
    const [isEdit, setIsEdit] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [saving, setSaving] = useState(false);
    const [detailDialogVisible, setDetailDialogVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await courseService.getAllCourses();
            setCourses(res.data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải danh sách học phần');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
        departmentService.getAllDepartments().then(res => setDepartments(res.data)).catch(() => setDepartments([]));
    }, []);

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
                        <b>Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến học phần này!</b>
                        <div className="mt-2 font-bold">Hành động này không thể hoàn tác!</div>
                    </div>
                </div>
            ),
            header: 'Xác nhận xóa học phần',
            icon: 'pi pi-exclamation-triangle text-3xl text-red-500',
            acceptClassName: 'p-button-danger',
            rejectLabel: 'Hủy',
            acceptLabel: 'Xóa',
            accept: async () => {
                try {
                    await courseService.deleteCourse(course.maHocPhan);
                    setCourses(courses.filter(c => c.maHocPhan !== course.maHocPhan));
                    setSuccess('Xóa học phần thành công');
                    setTimeout(() => setSuccess(''), 2500);
                } catch (err: any) {
                    setError(err.message || 'Xóa học phần thất bại');
                    setTimeout(() => setError(''), 2500);
                }
            }
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                await courseService.updateCourse(formData.maHocPhan, formData);
                setCourses(courses.map(c => c.maHocPhan === formData.maHocPhan ? formData : c));
                setSuccess('Cập nhật học phần thành công');
            } else {
                const newCourse = await courseService.createCourse(formData);
                setCourses([...courses, newCourse]);
                setSuccess('Thêm học phần thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: any) {
            setError(err.message || 'Lưu học phần thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const filteredCourses = courses.filter(course =>
        (course.maHocPhan?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
        (course.tenHocPhan?.toLowerCase() || '').includes(searchText.toLowerCase())
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
                        placeholder="Tìm kiếm theo mã, tên học phần..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button label="Thêm học phần" icon="pi pi-plus" onClick={() => { setFormData({ maHocPhan: '', tenHocPhan: '', soTinChi: 0, maKhoa: departments[0]?.maKhoa || '', moTa: '', trangThai: 1 }); setIsEdit(false); setEditDialogVisible(true); }} />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã học phần</th>
                                <th className="px-4 py-2 text-left">Tên học phần</th>
                                <th className="px-4 py-2 text-left">Số tín chỉ</th>
                                <th className="px-4 py-2 text-left">Khoa</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map(course => {
                                const khoa = departments.find(dep => dep.maKhoa === course.maKhoa);
                                return (
                                    <tr key={course.maHocPhan} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{course.maHocPhan}</td>
                                        <td className="px-4 py-2">{course.tenHocPhan}</td>
                                        <td className="px-4 py-2">{course.soTinChi}</td>
                                        <td className="px-4 py-2">{khoa ? khoa.tenKhoa : course.maKhoa}</td>
                                        <td className="px-4 py-2">{course.trangThai === 1 ? 'Hoạt động' : 'Ngừng'}</td>
                                        <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                            <Button icon="pi pi-eye" className="p-button-rounded p-button-info text-lg" tooltip="Xem chi tiết" onClick={() => { setSelectedCourse(course); setDetailDialogVisible(true); }} />
                                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(course)} />
                                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => handleDelete(course)} />
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
                header={isEdit ? 'Sửa học phần' : 'Thêm học phần'}
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
                        <label htmlFor="maHocPhan" className="text-gray-700 font-medium">Mã học phần</label>
                        <input id="maHocPhan" value={formData.maHocPhan} onChange={e => setFormData({ ...formData, maHocPhan: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required disabled={isEdit} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenHocPhan" className="text-gray-700 font-medium">Tên học phần</label>
                        <input id="tenHocPhan" value={formData.tenHocPhan} onChange={e => setFormData({ ...formData, tenHocPhan: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soTinChi" className="text-gray-700 font-medium">Số tín chỉ</label>
                        <input id="soTinChi" type="number" min={0} value={formData.soTinChi} onChange={e => setFormData({ ...formData, soTinChi: Number(e.target.value) })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maKhoa" className="text-gray-700 font-medium">Khoa</label>
                        <select id="maKhoa" value={formData.maKhoa} onChange={e => setFormData({ ...formData, maKhoa: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required>
                            {departments.map(dep => (
                                <option key={dep.maKhoa} value={dep.maKhoa}>{dep.tenKhoa}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label htmlFor="moTa" className="text-gray-700 font-medium">Mô tả</label>
                        <textarea id="moTa" value={formData.moTa} onChange={e => setFormData({ ...formData, moTa: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" rows={2} />
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
            <Dialog
                visible={detailDialogVisible}
                onHide={() => setDetailDialogVisible(false)}
                header={selectedCourse ? `Danh sách lớp học phần của ${selectedCourse.tenHocPhan}` : ''}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={<div className="flex justify-end"><Button label="Đóng" onClick={() => setDetailDialogVisible(false)} /></div>}
            >
                {selectedCourse && selectedCourse.lopHocPhans && selectedCourse.lopHocPhans.length > 0 ? (
                    <div className="overflow-x-auto">
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
                                </tr>
                            </thead>
                            <tbody>
                                {selectedCourse.lopHocPhans.map(lop => (
                                    <tr key={lop.maLopHP}>
                                        <td className="px-4 py-2 font-mono">{lop.maLopHP}</td>
                                        <td className="px-4 py-2">{lop.tenLopHP}</td>
                                        <td className="px-4 py-2">{lop.soLuong}</td>
                                        <td className="px-4 py-2">{lop.giangVien}</td>
                                        <td className="px-4 py-2">{new Date(lop.thoiGianBatDau).toLocaleString()}</td>
                                        <td className="px-4 py-2">{new Date(lop.thoiGianKetThuc).toLocaleString()}</td>
                                        <td className="px-4 py-2">{lop.phongHoc}</td>
                                        <td className="px-4 py-2">{lop.trangThai ? 'Hoạt động' : 'Ngừng'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Không có lớp học phần nào.</div>
                )}
            </Dialog>
        </div>
    );
} 