'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { TabView, TabPanel } from 'primereact/tabview';
import gradeService, { GradeOverview, GradeDetail } from '../services/gradeService';

export default function AcademicResultsPage() {
    const [loading, setLoading] = useState(true);
    const [gradeOverview, setGradeOverview] = useState<GradeOverview | null>(null);
    const toast = useRef<Toast>(null);
    const [toastMessage, setToastMessage] = useState<{ severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string } | null>(null);

    // Mock student ID - in real app this would come from user context/auth
    const maSinhVien = 'SV001';

    useEffect(() => {
        loadGradeOverview();
    }, []);

    // Effect to show toast when toastMessage changes
    useEffect(() => {
        if (toastMessage && toast.current) {
            toast.current.show({
                severity: toastMessage.severity,
                summary: toastMessage.summary,
                detail: toastMessage.detail,
                life: 3000
            });
            setToastMessage(null);
        }
    }, [toastMessage]);

    const loadGradeOverview = async () => {
        try {
            setLoading(true);
            const data = await gradeService.getStudentGradeOverview(maSinhVien);
            setGradeOverview(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin điểm';
            setToastMessage({ severity: 'error', summary: 'Lỗi', detail: errorMessage });
            console.error('Error loading grade overview:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (diemTongKet: number) => {
        if (diemTongKet >= 8.5) return 'text-green-600 font-bold';
        if (diemTongKet >= 7.0) return 'text-blue-600 font-semibold';
        if (diemTongKet >= 5.5) return 'text-yellow-600 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const getStatusColor = (trangThai: string) => {
        switch (trangThai.toLowerCase()) {
            case 'đạt':
                return 'bg-green-100 text-green-700';
            case 'không đạt':
                return 'bg-red-100 text-red-700';
            case 'chưa hoàn thành':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getXepLoaiColor = (xepLoai: string) => {
        switch (xepLoai.toLowerCase()) {
            case 'xuất sắc':
                return 'bg-purple-100 text-purple-700';
            case 'giỏi':
                return 'bg-blue-100 text-blue-700';
            case 'khá':
                return 'bg-green-100 text-green-700';
            case 'trung bình':
                return 'bg-yellow-100 text-yellow-700';
            case 'yếu':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="card">
                <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2">Đang tải thông tin điểm...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!gradeOverview) {
        return (
            <div className="card">
                <div className="text-center py-4">
                    <i className="pi pi-exclamation-triangle text-yellow-500" style={{ fontSize: '3rem' }}></i>
                    <h2 className="mt-2">Không có dữ liệu điểm</h2>
                    <p className="text-gray-600">Chưa có thông tin điểm học tập.</p>
                </div>
            </div>
        );
    }

    const tiLeDat = gradeOverview.tongSoTinChi > 0 ?
        (gradeOverview.tongSoTinChiDat / gradeOverview.tongSoTinChi) * 100 : 0;

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Kết quả học tập</h1>
                <Button
                    label="Làm mới"
                    icon="pi pi-refresh"
                    onClick={loadGradeOverview}
                    className="p-button-outlined"
                />
            </div>

            {/* Student Info Card */}
            <Card className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <h3 className="text-lg font-semibold mb-2">Thông tin sinh viên</h3>
                        <p><strong>Mã sinh viên:</strong> {gradeOverview.maSinhVien}</p>
                        <p><strong>Họ tên:</strong> {gradeOverview.hoTenSinhVien}</p>
                    </div>
                    <div className="col-12 md:col-6">
                        <h3 className="text-lg font-semibold mb-2">Tổng quan</h3>
                        <p><strong>Điểm trung bình:</strong>
                            <span className={`ml-2 text-xl ${getGradeColor(gradeOverview.diemTrungBinh)}`}>
                                {gradeOverview.diemTrungBinh.toFixed(2)}
                            </span>
                        </p>
                        <p><strong>Xếp loại:</strong>
                            <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${getXepLoaiColor(gradeOverview.xepLoai)}`}>
                                {gradeOverview.xepLoai}
                            </span>
                        </p>
                    </div>
                </div>
            </Card>

            {/* Statistics Cards */}
            <div className="grid mb-4">
                <div className="col-12 md:col-4">
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{gradeOverview.tongSoTinChi}</div>
                        <div className="text-gray-600">Tổng số tín chỉ</div>
                    </Card>
                </div>
                <div className="col-12 md:col-4">
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-green-600">{gradeOverview.tongSoTinChiDat}</div>
                        <div className="text-gray-600">Tín chỉ đạt</div>
                    </Card>
                </div>
                <div className="col-12 md:col-4">
                    <Card className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{tiLeDat.toFixed(1)}%</div>
                        <div className="text-gray-600">Tỷ lệ đạt</div>
                    </Card>
                </div>
            </div>

            {/* Progress Bar */}
            <Card className="mb-4">
                <h3 className="text-lg font-semibold mb-3">Tiến độ học tập</h3>
                <div className="mb-2">
                    <div className="flex justify-content-between mb-1">
                        <span>Tín chỉ đã đạt: {gradeOverview.tongSoTinChiDat}/{gradeOverview.tongSoTinChi}</span>
                        <span>{tiLeDat.toFixed(1)}%</span>
                    </div>
                    <ProgressBar value={tiLeDat} color={tiLeDat >= 80 ? 'green' : tiLeDat >= 60 ? 'blue' : 'orange'} />
                </div>
            </Card>

            {/* Grade Details */}
            <Card>
                <h3 className="text-lg font-semibold mb-3">Chi tiết điểm từng môn học</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300">Mã học phần</th>
                                <th className="px-4 py-2 border border-gray-300">Tên học phần</th>
                                <th className="px-4 py-2 border border-gray-300">Số tín chỉ</th>
                                <th className="px-4 py-2 border border-gray-300">Điểm quá trình</th>
                                <th className="px-4 py-2 border border-gray-300">Điểm thi</th>
                                <th className="px-4 py-2 border border-gray-300">Điểm tổng kết</th>
                                <th className="px-4 py-2 border border-gray-300">Điểm chữ</th>
                                <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gradeOverview.danhSachDiem.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        Chưa có điểm học phần nào
                                    </td>
                                </tr>
                            ) : (
                                gradeOverview.danhSachDiem.map((diem, index) => (
                                    <tr key={index} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 border border-gray-300 font-mono">{diem.maHocPhan}</td>
                                        <td className="px-4 py-2 border border-gray-300">{diem.tenHocPhan}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{diem.soTinChi}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{diem.diemQuaTrinh?.toFixed(1) || '-'}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">{diem.diemThi?.toFixed(1) || '-'}</td>
                                        <td className={`px-4 py-2 border border-gray-300 text-center ${getGradeColor(diem.diemTongKet)}`}>
                                            {diem.diemTongKet?.toFixed(1) || '-'}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300 text-center font-semibold">{diem.diemChu || '-'}</td>
                                        <td className="px-4 py-2 border border-gray-300 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(diem.trangThai)}`}>
                                                {diem.trangThai}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
} 