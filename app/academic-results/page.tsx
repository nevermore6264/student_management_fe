'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import gradeService, { KetQuaHocTapResponse } from '../services/gradeService';

export default function AcademicResultsPage() {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<KetQuaHocTapResponse | null>(null);
    const toast = useRef<Toast>(null);

    const maSinhVien = localStorage.getItem('maNguoiDung') || '';

    useEffect(() => {
        loadResult();
    }, []);

    const loadResult = async () => {
        try {
            setLoading(true);
            const data = await gradeService.getStudentSummary(maSinhVien);
            setResult(data);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu';
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: errorMessage, life: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const getGradeColor = (diem: number) => {
        if (diem >= 8.5) return 'text-green-600 font-bold';
        if (diem >= 7.0) return 'text-blue-600 font-semibold';
        if (diem >= 5.5) return 'text-yellow-600 font-semibold';
        return 'text-red-600 font-semibold';
    };

    const getStatusColor = (trangThai: string) => {
        switch (trangThai.toLowerCase()) {
            case 'đạt': return 'bg-green-100 text-green-700';
            case 'không đạt': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
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

    if (!result) {
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

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <Card className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">Thông tin sinh viên</h3>
                    <p><strong>Mã sinh viên:</strong> {result.maSinhVien}</p>
                    <p><strong>Họ tên:</strong> {result.hoTenSinhVien}</p>
                    <h3 className="text-lg font-semibold mt-4 mb-2">Tổng quan</h3>
                    <p><strong>Điểm trung bình:</strong>
                        <span className={`ml-2 text-xl ${getGradeColor(result.diemTrungBinh)}`}>
                            {result.diemTrungBinh?.toFixed(2)}
                        </span>
                    </p>
                    <p><strong>Xếp loại:</strong>
                        <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                            {result.xepLoai}
                        </span>
                    </p>
                </Card>
                <div className="flex flex-col gap-4 flex-1">
                    <Card className="text-center flex-1">
                        <div className="text-3xl font-bold text-blue-600">{result.tongSoTinChi}</div>
                        <div className="text-gray-600">Tổng số tín chỉ</div>
                    </Card>
                    <Card className="text-center flex-1">
                        <div className="text-3xl font-bold text-green-600">{result.tinChiDat}</div>
                        <div className="text-gray-600">Tín chỉ đạt</div>
                    </Card>
                    <Card className="text-center flex-1">
                        <div className="text-3xl font-bold text-purple-600">{result.tyLeDat?.toFixed(1)}%</div>
                        <div className="text-gray-600">Tỷ lệ đạt</div>
                    </Card>
                </div>
            </div>

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
                            {(!result.chiTietDiem || result.chiTietDiem.length === 0) ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        Chưa có điểm học phần nào
                                    </td>
                                </tr>
                            ) : (
                                result.chiTietDiem.map((diem, index) => (
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