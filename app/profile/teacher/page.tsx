/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import lecturerService from "../../services/lecturerService";
import Image from 'next/image';

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
                setProfile(editForm);
                setShowEditDialog(false);
                setTimeout(() => {
                    toast.current?.show({
                        severity: "success",
                        summary: "Thành công",
                        detail: "Cập nhật thông tin thành công",
                        life: 3000,
                    });
                }, 300);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-500 text-lg">Không thể tải thông tin cá nhân</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                                <Image
                                    src={'/avatar-default.svg'}
                                    alt="avatar"
                                    width={128}
                                    height={128}
                                    className="rounded-full object-cover w-full h-full"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.tenGiangVien}</h1>
                            <p className="text-gray-600 text-lg mb-3">{profile.email}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Giảng viên
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {profile.tenKhoa}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setEditForm(profile);
                                setEditTouched({});
                                setShowEditDialog(true);
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Thông tin cá nhân
                        </h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Thông tin cơ bản
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                                            <div className="text-gray-900 font-medium">{profile.tenGiangVien || '-'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã giảng viên</label>
                                            <div className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-md inline-block">{profile.maGiangVien || '-'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Khoa</label>
                                            <div className="text-gray-900 font-medium">{profile.tenKhoa || '-'}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã khoa</label>
                                            <div className="text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded-md inline-block">{profile.maKhoa || '-'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Thông tin liên hệ
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="text-gray-900 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {profile.email || '-'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                            <div className="text-gray-900 flex items-center">
                                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {profile.soDienThoai || '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog cập nhật thông tin cá nhân */}
            <Dialog
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                header={
                    <div className="flex items-center">
                        <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-xl font-semibold">Cập nhật thông tin cá nhân</span>
                    </div>
                }
                modal
                className="p-fluid w-full max-w-4xl"
                style={{ width: '90vw', maxWidth: '800px' }}
                footer={
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
                            onClick={() => setShowEditDialog(false)}
                            disabled={saving}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
                            onClick={handleSaveProfile}
                            disabled={saving}
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang lưu...
                                </div>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                }
            >
                {editForm && (
                    <div className="p-fluid grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-field">
                            <label htmlFor="tenGiangVien" className="block font-semibold mb-2 text-gray-700">Họ tên *</label>
                            <InputText
                                id="tenGiangVien"
                                className={`w-full p-3 border rounded-xl transition-all duration-200 ${editErrors.tenGiangVien ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                                value={editForm.tenGiangVien}
                                onChange={e => handleEditInput('tenGiangVien', e.target.value)}
                            />
                            {editErrors.tenGiangVien && <small className="text-red-500 text-sm mt-1 block">Họ tên không được để trống</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="email" className="block font-semibold mb-2 text-gray-700">Email *</label>
                            <InputText
                                id="email"
                                className={`w-full p-3 border rounded-xl transition-all duration-200 ${editErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                                value={editForm.email}
                                onChange={e => handleEditInput('email', e.target.value)}
                            />
                            {editErrors.email && <small className="text-red-500 text-sm mt-1 block">Email không được để trống</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="soDienThoai" className="block font-semibold mb-2 text-gray-700">Số điện thoại *</label>
                            <InputText
                                id="soDienThoai"
                                className={`w-full p-3 border rounded-xl transition-all duration-200 ${editErrors.soDienThoai ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                                value={editForm.soDienThoai}
                                onChange={e => handleEditInput('soDienThoai', e.target.value)}
                            />
                            {editErrors.soDienThoai && <small className="text-red-500 text-sm mt-1 block">Số điện thoại không được để trống</small>}
                        </div>
                        <div className="p-field">
                            <label htmlFor="maGiangVien" className="block font-semibold mb-2 text-gray-700">Mã giảng viên</label>
                            <InputText
                                id="maGiangVien"
                                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                                value={editForm.maGiangVien}
                                disabled
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="maKhoa" className="block font-semibold mb-2 text-gray-700">Mã khoa</label>
                            <InputText
                                id="maKhoa"
                                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                                value={editForm.maKhoa}
                                disabled
                            />
                        </div>
                        <div className="p-field">
                            <label htmlFor="tenKhoa" className="block font-semibold mb-2 text-gray-700">Tên khoa</label>
                            <InputText
                                id="tenKhoa"
                                className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 cursor-not-allowed"
                                value={editForm.tenKhoa}
                                disabled
                            />
                        </div>
                    </div>
                )}
            </Dialog>

            {/* Toast component - đặt ở cuối để đảm bảo z-index cao nhất */}
            <Toast
                ref={toast}
                position="top-right"
                className="z-[9999]"
                style={{ zIndex: 9999, position: 'fixed', top: '20px', right: '20px' }}
            />
        </div>
    );
} 