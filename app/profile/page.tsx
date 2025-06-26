"use client";

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import lecturerService from '../services/lecturerService';
import studentService from '../services/studentService';

type UserRole = 'sv' | 'gv' | 'admin';

interface BaseProfile {
    hoTen: string;
    email: string;
    soDienThoai: string;
    ngaySinh?: string;
    gioiTinh?: string;
    avatarUrl?: string;
    role: UserRole;
}

interface StudentProfile extends BaseProfile {
    role: 'sv';
    maSinhVien: string;
    khoa: string;
    lop: string;
    chuyenNganh: string;
    namNhapHoc?: string;
}

interface LecturerProfile {
    role: 'gv';
    maGiangVien: string;
    tenGiangVien: string;
    email: string;
    soDienThoai: string;
    tenKhoa: string;
}

type Profile = StudentProfile | LecturerProfile | BaseProfile;

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [editForm, setEditForm] = useState<Profile | null>(null);
    const [changePwdForm, setChangePwdForm] = useState({ oldPwd: '', newPwd: '', confirmPwd: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);

    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];
    const [editTouched, setEditTouched] = useState<{ [key: string]: boolean }>({});

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userRole = localStorage.getItem('vaiTros') as string || '["SV"]';
            const userId = localStorage.getItem('maNguoiDung');

            if (!userId) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            // Parse role from vaiTros array
            let role: UserRole = 'sv';
            try {
                const roles = JSON.parse(userRole);
                if (roles.includes('GV')) {
                    role = 'gv';
                } else if (roles.includes('SV')) {
                    role = 'sv';
                } else if (roles.includes('ADMIN')) {
                    role = 'admin';
                }
            } catch (e) {
                console.warn('Error parsing vaiTros:', e);
            }

            if (role === 'sv') {
                const response = await studentService.getStudentById(userId);
                if (response.success) {
                    const studentData = response.data;
                    setProfile({
                        role: 'sv',
                        hoTen: studentData.hoTen || '',
                        email: studentData.email || '',
                        soDienThoai: studentData.soDienThoai || '',
                        ngaySinh: studentData.ngaySinh || '',
                        gioiTinh: studentData.gioiTinh || '',
                        avatarUrl: studentData.avatarUrl || '',
                        maSinhVien: studentData.maSinhVien || '',
                        khoa: studentData.khoa || '',
                        lop: studentData.lop || '',
                        chuyenNganh: studentData.chuyenNganh || '',
                        namNhapHoc: studentData.namNhapHoc || '',
                    });
                } else {
                    throw new Error(response.message || 'Không thể lấy thông tin sinh viên');
                }
            } else if (role === 'gv') {
                const response = await lecturerService.getLecturerById(userId);
                if (response.success) {
                    const lecturerData = response.data;
                    setProfile({
                        role: 'gv',
                        maGiangVien: lecturerData.maGiangVien || '',
                        tenGiangVien: lecturerData.tenGiangVien || '',
                        email: lecturerData.email || '',
                        soDienThoai: lecturerData.soDienThoai || '',
                        tenKhoa: lecturerData.tenKhoa || '',
                    });
                } else {
                    throw new Error(response.message || 'Không thể lấy thông tin giảng viên');
                }
            } else {
                // Admin profile - using mock data for now
                setProfile({
                    role: 'admin',
                    hoTen: 'Admin',
                    email: 'admin@example.com',
                    soDienThoai: '',
                    avatarUrl: '',
                    gioiTinh: '',
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
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

    const handleEditInput = (field: string, value: string) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
        setEditTouched({ ...editTouched, [field]: true });
    };

    const handleSaveProfile = async () => {
        if (!editForm || !profile) return;

        // Validate required fields
        if (
            !editForm ||
            (editForm.role === 'gv' && !(editForm as LecturerProfile).tenGiangVien?.trim()) ||
            (editForm.role !== 'gv' && !(editForm as StudentProfile | BaseProfile).hoTen?.trim()) ||
            !editForm.email?.trim() ||
            !editForm.soDienThoai?.trim()
        ) {
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
            const userRole = localStorage.getItem('vaiTros') as string;

            if (!userId) {
                throw new Error('Không tìm thấy thông tin người dùng');
            }

            // Parse role from vaiTros array
            let role: UserRole = 'sv';
            try {
                const roles = JSON.parse(userRole);
                if (roles.includes('GV')) {
                    role = 'gv';
                } else if (roles.includes('SV')) {
                    role = 'sv';
                } else if (roles.includes('ADMIN')) {
                    role = 'admin';
                }
            } catch (e) {
                console.warn('Error parsing vaiTros:', e);
            }

            // Prepare update data
            const updateData =
                editForm && editForm.role === 'gv'
                    ? {
                        tenGiangVien: (editForm as LecturerProfile).tenGiangVien,
                        email: editForm.email,
                        soDienThoai: editForm.soDienThoai,
                    }
                    : editForm
                        ? {
                            hoTen: (editForm as StudentProfile | BaseProfile).hoTen,
                            email: editForm.email,
                            soDienThoai: editForm.soDienThoai,
                            ngaySinh: (editForm as StudentProfile | BaseProfile).ngaySinh,
                            gioiTinh: (editForm as StudentProfile | BaseProfile).gioiTinh,
                        }
                        : {};

            let response;
            if (role === 'sv') {
                response = await studentService.updateStudent(userId, updateData);
            } else if (role === 'gv') {
                // For lecturer, use tenGiangVien instead of hoTen
                const lecturerUpdateData = {
                    tenGiangVien: (editForm as LecturerProfile).tenGiangVien,
                    email: editForm.email,
                    soDienThoai: editForm.soDienThoai,
                };
                response = await lecturerService.updateLecturer(userId, lecturerUpdateData);
            } else {
                throw new Error('Không hỗ trợ cập nhật cho role này');
            }

            if (response.success) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Cập nhật thông tin thành công',
                    life: 3000
                });
                setProfile(editForm);
                setShowEditDialog(false);
                // Refresh profile data
                await fetchProfile();
            } else {
                throw new Error(response.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
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
        hoTen:
            editForm && editForm.role === 'gv'
                ? editTouched.hoTen && !((editForm as LecturerProfile).tenGiangVien?.trim())
                : editTouched.hoTen && !((editForm as StudentProfile | BaseProfile).hoTen?.trim()),
        email: editTouched.email && isEmpty(editForm?.email || ''),
        soDienThoai: editTouched.soDienThoai && isEmpty(editForm?.soDienThoai || ''),
    };

    if (loading) return <div className="flex justify-center items-center h-64">Đang tải thông tin...</div>;

    if (!profile) return <div className="text-center text-red-500">Không thể tải thông tin cá nhân</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <Toast ref={toast} />

            <div className="flex items-center gap-4 mb-6">
                <img
                    src={'/default-avatar.png'}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h2 className="text-2xl font-bold">
                        {profile.role === 'gv'
                            ? (profile as LecturerProfile).tenGiangVien
                            : (profile as StudentProfile | BaseProfile).hoTen}
                    </h2>
                    <p className="text-gray-500">
                        {profile.role === 'gv' ? (profile as LecturerProfile).email : (profile as any).email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {profile.role === 'sv' ? 'Sinh viên' : profile.role === 'gv' ? 'Giảng viên' : 'Admin'}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.role === 'gv' ? (
                    <>
                        <div>
                            <label className="font-semibold">Tên giảng viên:</label>
                            <div>{(profile as LecturerProfile).tenGiangVien || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Email:</label>
                            <div>{(profile as LecturerProfile).email || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Số điện thoại:</label>
                            <div>{(profile as LecturerProfile).soDienThoai || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Mã giảng viên:</label>
                            <div>{(profile as LecturerProfile).maGiangVien || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Khoa:</label>
                            <div>{(profile as LecturerProfile).tenKhoa || '-'}</div>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <label className="font-semibold">Số điện thoại:</label>
                            <div>{(profile as StudentProfile | BaseProfile).soDienThoai || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Ngày sinh:</label>
                            <div>{(profile as StudentProfile | BaseProfile).ngaySinh || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Giới tính:</label>
                            <div>{(profile as StudentProfile | BaseProfile).gioiTinh || '-'}</div>
                        </div>
                        {profile.role === 'sv' && (
                            <>
                                <div>
                                    <label className="font-semibold">Mã sinh viên:</label>
                                    <div>{(profile as StudentProfile).maSinhVien}</div>
                                </div>
                                <div>
                                    <label className="font-semibold">Khoa:</label>
                                    <div>{(profile as StudentProfile).khoa}</div>
                                </div>
                                <div>
                                    <label className="font-semibold">Lớp:</label>
                                    <div>{(profile as StudentProfile).lop}</div>
                                </div>
                                <div>
                                    <label className="font-semibold">Chuyên ngành:</label>
                                    <div>{(profile as StudentProfile).chuyenNganh}</div>
                                </div>
                                <div>
                                    <label className="font-semibold">Năm nhập học:</label>
                                    <div>{(profile as StudentProfile).namNhapHoc || '-'}</div>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    onClick={() => {
                        setEditForm(profile);
                        setEditTouched({});
                        setShowEditDialog(true);
                    }}
                    disabled={profile.role === 'admin'}
                >
                    Cập nhật thông tin
                </button>
                <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    onClick={() => setShowChangePasswordDialog(true)}
                >
                    Đổi mật khẩu
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                }
            >
                {editForm && editForm.role === 'gv' ? (
                    <div className="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-field mb-3">
                            <label htmlFor="tenGiangVien" className="p-d-block font-semibold mb-1">Tên giảng viên *</label>
                            <InputText id="tenGiangVien" className={"p-inputtext p-component w-full" + (editErrors.hoTen ? ' p-invalid' : '')} value={(editForm as LecturerProfile).tenGiangVien} onChange={e => setEditForm({ ...editForm, tenGiangVien: e.target.value })} />
                            {editErrors.hoTen && <small className="p-error">Tên giảng viên không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="email" className="p-d-block font-semibold mb-1">Email *</label>
                            <InputText id="email" className={"p-inputtext p-component w-full" + (editErrors.email ? ' p-invalid' : '')} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                            {editErrors.email && <small className="p-error">Email không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="soDienThoai" className="p-d-block font-semibold mb-1">Số điện thoại *</label>
                            <InputText id="soDienThoai" className={"p-inputtext p-component w-full" + (editErrors.soDienThoai ? ' p-invalid' : '')} value={editForm.soDienThoai} onChange={e => setEditForm({ ...editForm, soDienThoai: e.target.value })} />
                            {editErrors.soDienThoai && <small className="p-error">Số điện thoại không được để trống</small>}
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="tenKhoa" className="p-d-block font-semibold mb-1">Khoa</label>
                            <InputText id="tenKhoa" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).tenKhoa} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="maGiangVien" className="p-d-block font-semibold mb-1">Mã giảng viên</label>
                            <InputText id="maGiangVien" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).maGiangVien} disabled />
                        </div>
                    </div>
                ) : (
                    <div className="p-fluid grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-field mb-3">
                            <label htmlFor="hoTen" className="p-d-block font-semibold mb-1">Họ tên *</label>
                            <InputText id="hoTen" className={"p-inputtext p-component w-full" + (editErrors.hoTen ? ' p-invalid' : '')} value={(editForm as StudentProfile | BaseProfile).hoTen || ''} onChange={e => handleEditInput('hoTen', e.target.value)} />
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
                            <InputText id="ngaySinh" className="p-inputtext p-component w-full" value={(editForm as StudentProfile | BaseProfile).ngaySinh || ''} onChange={e => handleEditInput('ngaySinh', e.target.value)} />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="gioiTinh" className="p-d-block font-semibold mb-1">Giới tính</label>
                            <Dropdown id="gioiTinh" className="w-full" value={(editForm as StudentProfile | BaseProfile).gioiTinh || ''} options={genderOptions} onChange={e => handleEditInput('gioiTinh', e.value)} placeholder="Chọn giới tính" />
                        </div>
                        {editForm.role === 'sv' && (
                            <>
                                <div className="p-field mb-3">
                                    <label htmlFor="maSinhVien" className="p-d-block font-semibold mb-1">Mã sinh viên</label>
                                    <InputText id="maSinhVien" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as StudentProfile).maSinhVien} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="khoa" className="p-d-block font-semibold mb-1">Khoa</label>
                                    <InputText id="khoa" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as StudentProfile).khoa} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="lop" className="p-d-block font-semibold mb-1">Lớp</label>
                                    <InputText id="lop" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as StudentProfile).lop} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="chuyenNganh" className="p-d-block font-semibold mb-1">Chuyên ngành</label>
                                    <InputText id="chuyenNganh" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as StudentProfile).chuyenNganh} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="namNhapHoc" className="p-d-block font-semibold mb-1">Năm nhập học</label>
                                    <InputText id="namNhapHoc" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as StudentProfile).namNhapHoc || ''} disabled />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </Dialog>

            {/* Dialog đổi mật khẩu */}
            <Dialog
                visible={showChangePasswordDialog}
                onHide={() => setShowChangePasswordDialog(false)}
                header="Đổi mật khẩu"
                modal
                className="p-fluid w-full max-w-md"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300" onClick={() => setShowChangePasswordDialog(false)}>
                            Hủy
                        </button>
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700" onClick={() => setShowChangePasswordDialog(false)}>
                            Lưu
                        </button>
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <span className="p-float-label">
                        <Password id="oldPwd" value={changePwdForm.oldPwd} onChange={e => setChangePwdForm({ ...changePwdForm, oldPwd: e.target.value })} toggleMask feedback={false} className="w-full" />
                        <label htmlFor="oldPwd">Mật khẩu hiện tại</label>
                    </span>
                    <span className="p-float-label">
                        <Password id="newPwd" value={changePwdForm.newPwd} onChange={e => setChangePwdForm({ ...changePwdForm, newPwd: e.target.value })} toggleMask feedback={false} className="w-full" />
                        <label htmlFor="newPwd">Mật khẩu mới</label>
                    </span>
                    <span className="p-float-label">
                        <Password id="confirmPwd" value={changePwdForm.confirmPwd} onChange={e => setChangePwdForm({ ...changePwdForm, confirmPwd: e.target.value })} toggleMask feedback={false} className="w-full" />
                        <label htmlFor="confirmPwd">Xác nhận mật khẩu mới</label>
                    </span>
                </div>
            </Dialog>
        </div>
    );
} 