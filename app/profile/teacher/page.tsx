"use client";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import lecturerService from "../../services/lecturerService";

interface LecturerProfile {
    maGiangVien: string;
    tenGiangVien: string;
    email: string;
    soDienThoai: string;
    tenKhoa: string;
    maKhoa: string;
}

export default function TeacherProfilePage() {
    const [profile, setProfile] = useState<LecturerProfile | null>(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editForm, setEditForm] = useState<LecturerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const toast = useRef<Toast>(null);
    const [editTouched, setEditTouched] = useState<{ [key: string]: boolean }>({});

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem("maNguoiDung");
            if (!userId) throw new Error("Không tìm thấy thông tin người dùng");
            const response = await lecturerService.getLecturerById(userId);
            if (response.success) {
                const lecturerData = response.data;
                setProfile({
                    maGiangVien: lecturerData.maGiangVien || "",
                    tenGiangVien: lecturerData.tenGiangVien || "",
                    email: lecturerData.email || "",
                    soDienThoai: lecturerData.soDienThoai || "",
                    tenKhoa: lecturerData.tenKhoa || "",
                    maKhoa: lecturerData.maKhoa || "",
                });
            } else {
                throw new Error(response.message || "Không thể lấy thông tin giảng viên");
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error instanceof Error ? error.message : "Không thể tải thông tin cá nhân",
                life: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditInput = (field: keyof LecturerProfile, value: string) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
        setEditTouched({ ...editTouched, [field]: true });
    };

    const handleSaveProfile = async () => {
        if (!editForm) return;
        if (!editForm.tenGiangVien.trim() || !editForm.email.trim() || !editForm.soDienThoai.trim()) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: "Vui lòng điền đầy đủ thông tin bắt buộc",
                life: 3000,
            });
            return;
        }
        try {
            setSaving(true);
            const userId = localStorage.getItem("maNguoiDung");
            if (!userId) throw new Error("Không tìm thấy thông tin người dùng");
            const updateData = {
                role: 'gv',
                maGiangVien: editForm.maGiangVien || '',
                tenGiangVien: editForm.tenGiangVien || '',
                email: editForm.email || '',
                soDienThoai: editForm.soDienThoai || '',
                maKhoa: editForm.maKhoa || '',

            };
            const response = await lecturerService.updateLecturer(userId, updateData);
            if (response.success) {
                toast.current?.show({
                    severity: "success",
                    summary: "Thành công",
                    detail: "Cập nhật thông tin thành công",
                    life: 3000,
                });
                setProfile(editForm);
                setShowEditDialog(false);
                await fetchProfile();
            } else {
                throw new Error(response.message || "Cập nhật thất bại");
            }
        } catch (error) {
            toast.current?.show({
                severity: "error",
                summary: "Lỗi",
                detail: error instanceof Error ? error.message : "Không thể cập nhật thông tin",
                life: 3000,
            });
        } finally {
            setSaving(false);
        }
    };

    const isEmpty = (val: string | undefined) => !val || val.trim() === "";
    const editErrors = {
        tenGiangVien: editTouched.tenGiangVien && isEmpty(editForm?.tenGiangVien),
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
                    src={'/avatar-default.svg'}
                    alt="avatar"
                    className="w-20 h-20 rounded-full object-cover border"
                />
                <div>
                    <h2 className="text-2xl font-bold">{profile.tenGiangVien}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                        Giảng viên
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">Tên giảng viên:</label>
                    <div>{profile.tenGiangVien || '-'}</div>
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
                    <label className="font-semibold">Mã giảng viên:</label>
                    <div>{profile.maGiangVien || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Khoa:</label>
                    <div>{profile.maKhoa || '-'}</div>
                </div>
                <div>
                    <label className="font-semibold">Khoa:</label>
                    <div>{profile.tenKhoa || '-'}</div>
                </div>
            </div>
            <div className="flex gap-4 mt-8">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
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
                            <label htmlFor="tenGiangVien" className="p-d-block font-semibold mb-1">Tên giảng viên *</label>
                            <InputText id="tenGiangVien" className={"p-inputtext p-component w-full" + (editErrors.tenGiangVien ? ' p-invalid' : '')} value={editForm.tenGiangVien} onChange={e => handleEditInput('tenGiangVien', e.target.value)} />
                            {editErrors.tenGiangVien && <small className="p-error">Tên giảng viên không được để trống</small>}
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
                            <label htmlFor="maGiangVien" className="p-d-block font-semibold mb-1">Mã giảng viên</label>
                            <InputText id="maGiangVien" className="p-inputtext p-component w-full bg-gray-100" value={editForm.maGiangVien} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="maKhoa" className="p-d-block font-semibold mb-1">Mã Khoa</label>
                            <InputText id="maKhoa" className="p-inputtext p-component w-full bg-gray-100" value={editForm.maKhoa} disabled />
                        </div>
                        <div className="p-field mb-3">
                            <label htmlFor="tenKhoa" className="p-d-block font-semibold mb-1">Khoa</label>
                            <InputText id="tenKhoa" className="p-inputtext p-component w-full bg-gray-100" value={editForm.tenKhoa} disabled />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 