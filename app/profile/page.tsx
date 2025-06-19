"use client";

import { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';

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

interface LecturerProfile extends BaseProfile {
    role: 'gv';
    maGiangVien: string;
    khoa: string;
    hocVi?: string;
    chucVu?: string;
}

type Profile = StudentProfile | LecturerProfile | BaseProfile;

export default function ProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
    const [editForm, setEditForm] = useState<Profile | null>(null);
    const [changePwdForm, setChangePwdForm] = useState({ oldPwd: '', newPwd: '', confirmPwd: '' });

    const genderOptions = [
        { label: 'Nam', value: 'Nam' },
        { label: 'Nữ', value: 'Nữ' },
        { label: 'Khác', value: 'Khác' },
    ];
    const [editTouched, setEditTouched] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        // Giả lập fetch API, thực tế bạn sẽ gọi API lấy profile từ backend
        const userRole = localStorage.getItem('role') as UserRole || 'sv';
        if (userRole === 'sv') {
            setProfile({
                role: 'sv',
                hoTen: 'Nguyễn Văn A',
                email: 'sv001@example.com',
                soDienThoai: '0123456789',
                ngaySinh: '2002-01-01',
                gioiTinh: 'Nam',
                avatarUrl: '',
                maSinhVien: 'SV001',
                khoa: 'Công nghệ thông tin',
                lop: 'CNTT01',
                chuyenNganh: 'Khoa học máy tính',
                namNhapHoc: '2020',
            });
        } else if (userRole === 'gv') {
            setProfile({
                role: 'gv',
                hoTen: 'Trần Thị B',
                email: 'gv001@example.com',
                soDienThoai: '0987654321',
                ngaySinh: '1980-05-10',
                gioiTinh: 'Nữ',
                avatarUrl: '',
                maGiangVien: 'GV001',
                khoa: 'Công nghệ thông tin',
                hocVi: 'Tiến sĩ',
                chucVu: 'Trưởng bộ môn',
            });
        } else {
            setProfile({
                role: 'admin',
                hoTen: 'Admin',
                email: 'admin@example.com',
                soDienThoai: '',
                avatarUrl: '',
                gioiTinh: '',
            });
        }
        setEditForm(profile); // Khởi tạo form cập nhật khi có profile
    }, []);

    const handleEditInput = (field: string, value: string) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
        setEditTouched({ ...editTouched, [field]: true });
    };

    const isEmpty = (val: string | undefined) => !val || val.trim() === '';

    const editErrors = {
        hoTen: editTouched.hoTen && isEmpty(editForm?.hoTen || ''),
        email: editTouched.email && isEmpty(editForm?.email || ''),
        soDienThoai: editTouched.soDienThoai && isEmpty(editForm?.soDienThoai || ''),
    };

    if (!profile) return <div>Đang tải thông tin...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-8">
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={profile.avatarUrl || '/default-avatar.png'}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h2 className="text-2xl font-bold">{profile.hoTen}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        {profile.role === 'sv' ? 'Sinh viên' : profile.role === 'gv' ? 'Giảng viên' : 'Admin'}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">Số điện thoại:</label>
                    <div>{profile.soDienThoai || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Ngày sinh:</label>
                    <div>{profile.ngaySinh || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Giới tính:</label>
                    <div>{profile.gioiTinh || '-'}</div>
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
                {profile.role === 'gv' && (
                    <>
                        <div>
                            <label className="font-semibold">Mã giảng viên:</label>
                            <div>{(profile as LecturerProfile).maGiangVien}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Khoa:</label>
                            <div>{(profile as LecturerProfile).khoa}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Học vị:</label>
                            <div>{(profile as LecturerProfile).hocVi || '-'}</div>
                        </div>
                        <div>
                            <label className="font-semibold">Chức vụ:</label>
                            <div>{(profile as LecturerProfile).chucVu || '-'}</div>
                        </div>
                    </>
                )}
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                        setEditForm(profile);
                        setEditTouched({});
                        setShowEditDialog(true);
                    }}
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
                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300" onClick={() => setShowEditDialog(false)}>
                            Hủy
                        </button>
                        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700" onClick={() => setShowEditDialog(false)}>
                            Lưu
                        </button>
                    </div>
                }
            >
                {editForm ? (
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
                        {editForm.role === 'gv' && (
                            <>
                                <div className="p-field mb-3">
                                    <label htmlFor="maGiangVien" className="p-d-block font-semibold mb-1">Mã giảng viên</label>
                                    <InputText id="maGiangVien" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).maGiangVien} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="khoa" className="p-d-block font-semibold mb-1">Khoa</label>
                                    <InputText id="khoa" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).khoa} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="hocVi" className="p-d-block font-semibold mb-1">Học vị</label>
                                    <InputText id="hocVi" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).hocVi || ''} disabled />
                                </div>
                                <div className="p-field mb-3">
                                    <label htmlFor="chucVu" className="p-d-block font-semibold mb-1">Chức vụ</label>
                                    <InputText id="chucVu" className="p-inputtext p-component w-full bg-gray-100" value={(editForm as LecturerProfile).chucVu || ''} disabled />
                                </div>
                            </>
                        )}
                    </div>
                ) : null}
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