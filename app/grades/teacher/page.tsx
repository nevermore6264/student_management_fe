"use client";

import { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Message } from 'primereact/message';
import gradeService from '../../services/gradeService';

export default function TeacherGradeOverviewPage() {
    const [overview, setOverview] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const teacherId = typeof window !== 'undefined' ? localStorage.getItem('teacherId') : '';

    useEffect(() => {
        const fetchOverview = async () => {
            setLoading(true); setError('');
            try {
                const data = await gradeService.getTeacherOverview(teacherId || '');
                if (data.success && data.data) {
                    setOverview(data.data);
                } else {
                    setOverview(null);
                    setError(data.message || 'Dữ liệu không hợp lệ');
                }
            } catch (err: any) {
                setError(err.message || 'Không thể tải tổng quan điểm');
                setOverview(null);
            } finally {
                setLoading(false);
            }
        };
        if (teacherId) fetchOverview();
    }, [teacherId]);

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Tổng quan điểm - Giảng viên</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : overview ? (
                <div className="space-y-6">
                    {/* Cards thống kê nhanh */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-600 text-sm font-medium mb-1">Tổng số lớp</p>
                                    <p className="text-2xl font-bold text-blue-700">{overview.tongSoLop}</p>
                                </div>
                                <div className="bg-blue-100 rounded-full p-3">
                                    <i className="pi pi-users text-xl text-blue-600"></i>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium mb-1">Tổng số sinh viên</p>
                                    <p className="text-2xl font-bold text-green-700">{overview.tongSoSinhVien}</p>
                                </div>
                                <div className="bg-green-100 rounded-full p-3">
                                    <i className="pi pi-user text-xl text-green-600"></i>
                                </div>
                            </div>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 text-sm font-medium mb-1">Điểm TB các lớp</p>
                                    <p className="text-2xl font-bold text-yellow-700">{overview.diemTrungBinhTatCaLop}</p>
                                </div>
                                <div className="bg-yellow-100 rounded-full p-3">
                                    <i className="pi pi-chart-line text-xl text-yellow-600"></i>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-600 text-sm font-medium mb-1">Tỷ lệ đạt</p>
                                    <p className="text-2xl font-bold text-purple-700">{Math.round(overview.tyLeDat * 100)}%</p>
                                </div>
                                <div className="bg-purple-100 rounded-full p-3">
                                    <i className="pi pi-check-circle text-xl text-purple-600"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Biểu đồ phân bố điểm và xếp loại */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Tỷ lệ xếp loại</h3>
                            <Pie
                                data={{
                                    labels: ['A', 'B', 'C', 'D', 'F'],
                                    datasets: [
                                        {
                                            data: [
                                                overview.soLuongXepLoai.A,
                                                overview.soLuongXepLoai.B,
                                                overview.soLuongXepLoai.C,
                                                overview.soLuongXepLoai.D,
                                                overview.soLuongXepLoai.F
                                            ],
                                            backgroundColor: [
                                                '#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'
                                            ],
                                            borderWidth: 2
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom' },
                                        title: { display: true, text: 'Tỷ lệ xếp loại' }
                                    }
                                }}
                            />
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-lg border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Phân bố điểm</h3>
                            <Bar
                                data={{
                                    labels: overview.bieuDoPhanBoDiem.map((item: any) => item.khoangDiem),
                                    datasets: [
                                        {
                                            label: 'Số lượng SV',
                                            data: overview.bieuDoPhanBoDiem.map((item: any) => item.soLuong),
                                            backgroundColor: '#3B82F6',
                                            borderWidth: 1
                                        }
                                    ]
                                }}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { display: false },
                                        title: { display: true, text: 'Phân bố điểm' }
                                    },
                                    scales: { y: { beginAtZero: true } }
                                }}
                            />
                        </div>
                    </div>

                    {/* Danh sách lớp và trạng thái nhập điểm */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2 text-blue-700">Các lớp đang dạy</h3>
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã lớp HP</th>
                                    <th className="px-4 py-2 text-left">Tên lớp HP</th>
                                    <th className="px-4 py-2 text-center">Số SV</th>
                                    <th className="px-4 py-2 text-center">Trạng thái nhập điểm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overview.cacLop.map((lop: any, idx: number) => (
                                    <tr key={idx} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{lop.maLopHP}</td>
                                        <td className="px-4 py-2">{lop.tenLopHP}</td>
                                        <td className="px-4 py-2 text-center">{lop.soSinhVien}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${lop.trangThaiNhapDiem === 'Đã nhập' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{lop.trangThaiNhapDiem}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Danh sách sinh viên chưa nhập điểm */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-2 text-red-700">Sinh viên chưa nhập điểm</h3>
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-red-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã SV</th>
                                    <th className="px-4 py-2 text-left">Tên sinh viên</th>
                                    <th className="px-4 py-2 text-left">Mã lớp HP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overview.sinhVienChuaNhapDiem.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">Tất cả sinh viên đã có điểm</td></tr>
                                ) : overview.sinhVienChuaNhapDiem.map((sv: any, idx: number) => (
                                    <tr key={idx} className="border-b hover:bg-red-50">
                                        <td className="px-4 py-2 font-mono">{sv.maSinhVien}</td>
                                        <td className="px-4 py-2">{sv.tenSinhVien}</td>
                                        <td className="px-4 py-2">{sv.maLopHP}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500">Không có dữ liệu tổng quan</div>
            )}
        </div>
    );
} 