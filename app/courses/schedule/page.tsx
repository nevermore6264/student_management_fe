/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import scheduleService, { Schedule } from '../../services/scheduleService';
import classSectionService, { ClassSection } from '../../services/classSectionService';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchText, setSearchText] = useState('');
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [formData, setFormData] = useState<Schedule>({
        id: 0,
        maLopHP: '',
        thu: 2,
        tietBatDau: 1,
        soTiet: 1,
        phongHoc: ''
    });
    const [isEdit, setIsEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Schedule | null>(null);
    const [classSections, setClassSections] = useState<ClassSection[]>([]);

    useEffect(() => {
        fetchSchedules();
        classSectionService.getAllClassSections().then(setClassSections).catch(() => setClassSections([]));
    }, []);

    const fetchSchedules = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await scheduleService.getAll();
            setSchedules(data);
        } catch (err: any) {
            setError(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEdit) {
                const updated = await scheduleService.update(formData.id, formData);
                setSchedules(schedules.map(s => s.id === updated.id ? updated : s));
                setSuccess('Cập nhật TKB thành công');
            } else {
                const created = await scheduleService.create(formData);
                setSchedules([...schedules, created]);
                setSuccess('Thêm TKB thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setEditDialogVisible(false);
        } catch (err: any) {
            setError(err.message || 'Lưu TKB thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (tkb: Schedule) => {
        setFormData(tkb);
        setIsEdit(true);
        setEditDialogVisible(true);
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSaving(true);
        try {
            await scheduleService.delete(deleteTarget.id);
            setSchedules(schedules.filter(s => s.id !== deleteTarget.id));
            setSuccess('Xóa TKB thành công');
            setTimeout(() => setSuccess(''), 2500);
        } catch (err: any) {
            setError(err.message || 'Xóa TKB thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setSaving(false);
            setDeleteTarget(null);
        }
    };

    const filteredSchedules = schedules.filter(sch =>
        (sch.maLopHP?.toLowerCase() || '').includes(searchText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Danh sách thời khóa biểu</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm theo mã lớp học phần..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button label="Thêm TKB" icon="pi pi-plus" onClick={() => { setFormData({ id: 0, maLopHP: '', thu: 2, tietBatDau: 1, soTiet: 1, phongHoc: '' }); setIsEdit(false); setEditDialogVisible(true); }} />
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
                                <th className="px-4 py-2">Thứ</th>
                                <th className="px-4 py-2">Tiết bắt đầu</th>
                                <th className="px-4 py-2">Số tiết</th>
                                <th className="px-4 py-2">Phòng học</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map(sch => (
                                <tr key={sch.id} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{sch.maLopHP}</td>
                                    <td className="px-4 py-2">{sch.thu}</td>
                                    <td className="px-4 py-2">{sch.tietBatDau}</td>
                                    <td className="px-4 py-2">{sch.soTiet}</td>
                                    <td className="px-4 py-2">{sch.phongHoc}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning text-lg" onClick={() => handleEdit(sch)} />
                                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger text-lg" onClick={() => setDeleteTarget(sch)} />
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
                header={isEdit ? 'Sửa thời khóa biểu' : 'Thêm thời khóa biểu'}
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
                        <label htmlFor="maLopHP" className="text-gray-700 font-medium">Lớp học phần</label>
                        <select
                            id="maLopHP"
                            value={formData.maLopHP}
                            onChange={e => setFormData({ ...formData, maLopHP: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="">-- Chọn lớp học phần --</option>
                            {classSections.map(cls => (
                                <option key={cls.maLopHP} value={cls.maLopHP}>{cls.tenLopHP}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="thu" className="text-gray-700 font-medium">Thứ</label>
                        <input id="thu" type="number" min={2} max={8} value={formData.thu} onChange={e => setFormData({ ...formData, thu: Number(e.target.value) })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tietBatDau" className="text-gray-700 font-medium">Tiết bắt đầu</label>
                        <input id="tietBatDau" type="number" min={1} value={formData.tietBatDau} onChange={e => setFormData({ ...formData, tietBatDau: Number(e.target.value) })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="soTiet" className="text-gray-700 font-medium">Số tiết</label>
                        <input id="soTiet" type="number" min={1} value={formData.soTiet} onChange={e => setFormData({ ...formData, soTiet: Number(e.target.value) })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="phongHoc" className="text-gray-700 font-medium">Phòng học</label>
                        <input id="phongHoc" value={formData.phongHoc} onChange={e => setFormData({ ...formData, phongHoc: e.target.value })} className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base" required />
                    </div>
                </form>
            </Dialog>
            <Dialog
                visible={!!deleteTarget}
                onHide={() => setDeleteTarget(null)}
                header="Xác nhận xóa thời khóa biểu"
                modal
                className="p-fluid w-full max-w-md"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300" onClick={() => setDeleteTarget(null)} disabled={saving}>Hủy</button>
                        <button type="button" className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700" onClick={handleDelete} disabled={saving}>Xóa</button>
                    </div>
                }
            >
                {deleteTarget && (
                    <div>
                        <span>Bạn có chắc chắn muốn xóa thời khóa biểu của lớp học phần <b>{deleteTarget.maLopHP}</b>?</span>
                        <div className="mt-3 text-red-600">
                            <b>Lưu ý: Hành động này sẽ xóa toàn bộ thông tin liên quan đến thời khóa biểu này!</b>
                            <div className="mt-2 font-bold">Hành động này không thể hoàn tác!</div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 