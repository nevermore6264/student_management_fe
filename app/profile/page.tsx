/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import studentService from '../services/studentService';
import Image from 'next/image';

interface StudentProfile {
    maSinhVien: string;
    hoTenSinhVien: string;
    email: string;
    soDienThoai: string;
    diaChi?: string;
    ngaySinh?: string;
    gioiTinh?: boolean;
    maLop: string;
}

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editForm, setEditForm] = useState<StudentProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);
    const [editTouched, setEditTouched] = useState<{ [key: string]: boolean }>({});
    const genderOptions = [
        { label: 'Nam', value: true },
        { label: 'Nữ', value: false }
    ];

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('maNguoiDung');
            if (!userId) throw new Error('Không tìm thấy thông tin người dùng');
            const response = await studentService.getStudentById(userId);
            console.log('API response:', response);
            if (response.success) {
                const studentData = response.data;
                setProfile({
                    maSinhVien: studentData.maSinhVien || '',
                    hoTenSinhVien: studentData.hoTenSinhVien || '',
                    email: studentData.email || '',
                    soDienThoai: studentData.soDienThoai || '',
                    diaChi: studentData.diaChi || '',
                    ngaySinh: studentData.ngaySinh || '',
                    gioiTinh: studentData.gioiTinh,
                    maLop: studentData.maLop || '',
                });
            } else {
                throw new Error(response.message || 'Không thể lấy thông tin sinh viên');
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể tải thông tin cá nhân',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditInput = (field: keyof StudentProfile, value: string | boolean) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
        setEditTouched({ ...editTouched, [field]: true });
    };

    const handleSaveProfile = async () => {
        if (!editForm) return;
        if (!editForm.hoTenSinhVien.trim() || !editForm.email.trim() || !editForm.soDienThoai.trim()) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng điền đầy đủ thông tin bắt buộc',
                life: 3000
            });
            return;
        }
        try {
            setSaving(true);
            const userId = localStorage.getItem('maNguoiDung');
            if (!userId) throw new Error('Không tìm thấy thông tin người dùng');
            const updateData = {
                maSinhVien: editForm.maSinhVien,
                hoTenSinhVien: editForm.hoTenSinhVien,
                email: editForm.email,
                soDienThoai: editForm.soDienThoai,
                diaChi: editForm.diaChi,
                ngaySinh: editForm.ngaySinh,
                gioiTinh: editForm.gioiTinh,
                maLop: editForm.maLop,
            };
            const response = await studentService.updateStudent(userId, updateData);
            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật thông tin thành công',
                    life: 3000
                });
                setProfile(editForm);
                setShowEditDialog(false);
                await fetchProfile();
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể cập nhật thông tin',
                life: 3000
            });
        } finally {
            setSaving(false);
        }
    };

    const isEmpty = (val: string | undefined) => !val || val.trim() === '';
    const editErrors = {
        hoTenSinhVien: editTouched.hoTenSinhVien && isEmpty(editForm?.hoTenSinhVien),
        email: editTouched.email && isEmpty(editForm?.email),
        soDienThoai: editTouched.soDienThoai && isEmpty(editForm?.soDienThoai),
    };

    if (loading) return <div className="flex justify-center items-center h-64">Đang tải thông tin...</div>;
    if (!profile) return <div className="text-center text-red-500">Không thể tải thông tin cá nhân</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <Toast ref={toast} />
            <div className="flex items-center gap-4 mb-6">
                <Image
                    src={'/avatar-default.svg'}
                    alt="avatar"
                    width={96}
                    height={96}
                    className="rounded-full border-2 border-gray-300 object-cover"
                />
                <div>
                    <h2 className="text-2xl font-bold">{profile.hoTenSinhVien}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Sinh viên
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">Họ tên:</label>
                    <div>{profile.hoTenSinhVien || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Email:</label>
                    <div>{profile.email || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Số điện thoại:</label>
                    <div>{profile.soDienThoai || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Mã sinh viên:</label>
                    <div>{profile.maSinhVien || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Mã lớp:</label>
                    <div>{profile.maLop || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Địa chỉ:</label>
                    <div>{profile.diaChi || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Ngày sinh:</label>
                    <div>{profile.ngaySinh ? new Date(profile.ngaySinh).toLocaleDateString('vi-VN') : '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Giới tính:</label>
                    <div>{profile.gioiTinh === true ? 'Nam' : profile.gioiTinh === false ? 'Nữ' : '-'}</div>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    onClick={() => {
                        setEditForm(profile);
                        setEditTouched({});
                        setShowEditDialog(true);
                    }}
                >
                    Cập nhật thông tin
                </button>
            </div>
            {/* Dialog cập nhật thông tin cá nhân */}
            <Dialog
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                header="Cập nhật thông tin cá nhân"
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 disabled:opacity-50"
                            onClick={() => setShowEditDialog(false)}
                            disabled={saving}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                }
            >
                {editForm && (
                    <div className="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-field mb-3">
                            <label htmlFor="hoTenSinhVien" className="p-d-block font-semibold mb-1">Họ tên *</label>
                            <InputText id="hoTenSinhVien" className={"p-inputtext p-component w-full" + (editErrors.hoTenSinhVien ? ' p-invalid' : '')} value={editForm.hoTenSinhVien} onChange={e => handleEditInput('hoTenSinhVien', e.target.value)} />
                            {editErrors.hoTenSinhVien && <small className="p-error">Họ tên không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="email" className="p-d-block font-semibold mb-1">Email *</label>
                            <InputText id="email" className={"p-inputtext p-component w-full" + (editErrors.email ? ' p-invalid' : '')} value={editForm.email} onChange={e => handleEditInput('email', e.target.value)} />
                            {editErrors.email && <small className="p-error">Email không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="soDienThoai" className="p-d-block font-semibold mb-1">Số điện thoại *</label>
                            <InputText id="soDienThoai" className={"p-inputtext p-component w-full" + (editErrors.soDienThoai ? ' p-invalid' : '')} value={editForm.soDienThoai} onChange={e => handleEditInput('soDienThoai', e.target.value)} />
                            {editErrors.soDienThoai && <small className="p-error">Số điện thoại không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="diaChi" className="p-d-block font-semibold mb-1">Địa chỉ</label>
                            <InputText id="diaChi" className="p-inputtext p-component w-full" value={editForm.diaChi || ''} onChange={e => handleEditInput('diaChi', e.target.value)} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="ngaySinh" className="p-d-block font-semibold mb-1">Ngày sinh</label>
                            <InputText id="ngaySinh" className="p-inputtext p-component w-full" value={editForm.ngaySinh || ''} onChange={e => handleEditInput('ngaySinh', e.target.value)} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="gioiTinh" className="p-d-block font-semibold mb-1">Giới tính</label>
                            <Dropdown id="gioiTinh" className="w-full" value={editForm.gioiTinh} options={genderOptions} onChange={e => handleEditInput('gioiTinh', e.value)} placeholder="Chọn giới tính" />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="maSinhVien" className="p-d-block font-semibold mb-1">Mã sinh viên</label>
                            <InputText id="maSinhVien" className="p-inputtext p-component w-full bg-gray-100" value={editForm.maSinhVien} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="maLop" className="p-d-block font-semibold mb-1">Mã lớp</label>
                            <InputText id="maLop" className="p-inputtext p-component w-full bg-gray-100" value={editForm.maLop} disabled />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 