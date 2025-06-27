"use client";

import { useEffect, useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import studentService from '../services/studentService';

interface StudentProfile {
    maSinhVien: string;
    hoTen: string;
    email: string;
    soDienThoai: string;
    ngaySinh?: string;
    gioiTinh?: string;
    avatarUrl?: string;
    khoa: string;
    lop: string;
    chuyenNganh: string;
    namNhapHoc?: string;
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
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('maNguoiDung');
            if (!userId) throw new Error('Không tìm thấy thông tin người dùng');
            const response = await studentService.getStudentById(userId);
            if (response.success) {
                const studentData = response.data;
                setProfile({
                    maSinhVien: studentData.maSinhVien || '',
                    hoTen: studentData.hoTen || '',
                    email: studentData.email || '',
                    soDienThoai: studentData.soDienThoai || '',
                    ngaySinh: studentData.ngaySinh || '',
                    gioiTinh: studentData.gioiTinh || '',
                    avatarUrl: studentData.avatarUrl || '',
                    khoa: studentData.khoa || '',
                    lop: studentData.lop || '',
                    chuyenNganh: studentData.chuyenNganh || '',
                    namNhapHoc: studentData.namNhapHoc || '',
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

    const handleEditInput = (field: keyof StudentProfile, value: string) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
        setEditTouched({ ...editTouched, [field]: true });
    };

    const handleSaveProfile = async () => {
        if (!editForm) return;
        if (!editForm.hoTen.trim() || !editForm.email.trim() || !editForm.soDienThoai.trim()) {
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
                hoTen: editForm.hoTen,
                email: editForm.email,
                soDienThoai: editForm.soDienThoai,
                ngaySinh: editForm.ngaySinh,
                gioiTinh: editForm.gioiTinh,
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
        hoTen: editTouched.hoTen && isEmpty(editForm?.hoTen),
        email: editTouched.email && isEmpty(editForm?.email),
        soDienThoai: editTouched.soDienThoai && isEmpty(editForm?.soDienThoai),
    };

    if (loading) return <div className="flex justify-center items-center h-64">Đang tải thông tin...</div>;
    if (!profile) return <div className="text-center text-red-500">Không thể tải thông tin cá nhân</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <Toast ref={toast} />
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={profile.avatarUrl || '/avatar-default.svg'}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h2 className="text-2xl font-bold">{profile.hoTen}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Sinh viên
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">Họ tên:</label>
                    <div>{profile.hoTen || '-'}</div>
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
                    <label className="font-semibold">Khoa:</label>
                    <div>{profile.khoa || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Lớp:</label>
                    <div>{profile.lop || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Chuyên ngành:</label>
                    <div>{profile.chuyenNganh || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Năm nhập học:</label>
                    <div>{profile.namNhapHoc || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Ngày sinh:</label>
                    <div>{profile.ngaySinh || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Giới tính:</label>
                    <div>{profile.gioiTinh || '-'}</div>
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
                            <label htmlFor="hoTen" className="p-d-block font-semibold mb-1">Họ tên *</label>
                            <InputText id="hoTen" className={"p-inputtext p-component w-full" + (editErrors.hoTen ? ' p-invalid' : '')} value={editForm.hoTen} onChange={e => handleEditInput('hoTen', e.target.value)} />
                            {editErrors.hoTen && <small className="p-error">Họ tên không được để trống</small>}
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
                            <label htmlFor="ngaySinh" className="p-d-block font-semibold mb-1">Ngày sinh</label>
                            <InputText id="ngaySinh" className="p-inputtext p-component w-full" value={editForm.ngaySinh || ''} onChange={e => handleEditInput('ngaySinh', e.target.value)} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="gioiTinh" className="p-d-block font-semibold mb-1">Giới tính</label>
                            <Dropdown id="gioiTinh" className="w-full" value={editForm.gioiTinh || ''} options={genderOptions} onChange={e => handleEditInput('gioiTinh', e.value)} placeholder="Chọn giới tính" />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="maSinhVien" className="p-d-block font-semibold mb-1">Mã sinh viên</label>
                            <InputText id="maSinhVien" className="p-inputtext p-component w-full bg-gray-100" value={editForm.maSinhVien} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="khoa" className="p-d-block font-semibold mb-1">Khoa</label>
                            <InputText id="khoa" className="p-inputtext p-component w-full bg-gray-100" value={editForm.khoa} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="lop" className="p-d-block font-semibold mb-1">Lớp</label>
                            <InputText id="lop" className="p-inputtext p-component w-full bg-gray-100" value={editForm.lop} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="chuyenNganh" className="p-d-block font-semibold mb-1">Chuyên ngành</label>
                            <InputText id="chuyenNganh" className="p-inputtext p-component w-full bg-gray-100" value={editForm.chuyenNganh} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="namNhapHoc" className="p-d-block font-semibold mb-1">Năm nhập học</label>
                            <InputText id="namNhapHoc" className="p-inputtext p-component w-full bg-gray-100" value={editForm.namNhapHoc || ''} disabled />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 