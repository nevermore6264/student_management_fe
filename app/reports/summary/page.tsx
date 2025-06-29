'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import adminReportService, { AdminReportResponse } from '../../services/adminReportService';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminSummaryReportPage() {
    const [reportData, setReportData] = useState<AdminReportResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const data = await adminReportService.getTongHopBaoCao();
            setReportData(data);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error instanceof Error ? error.message : 'Không thể tải báo cáo tổng hợp',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    // Chart data cho phân bố điểm
    const gradeDistributionData = {
        labels: ['Dưới 4.0', '4.0-5.5', '5.5-7.0', '7.0-8.5', '8.5-10.0'],
        datasets: [
            {
                data: [
                    reportData?.phanBoDiem.soSinhVienDiemDuoi4 || 0,
                    reportData?.phanBoDiem.soSinhVienDiem4Den55 || 0,
                    reportData?.phanBoDiem.soSinhVienDiem55Den7 || 0,
                    reportData?.phanBoDiem.soSinhVienDiem7Den85 || 0,
                    reportData?.phanBoDiem.soSinhVienDiem85Den10 || 0
                ],
                backgroundColor: ['#EF5350', '#FF9800', '#FFC107', '#4CAF50', '#2196F3'],
                borderWidth: 0
            }
        ]
    };

    // Chart data cho thống kê đăng ký
    const registrationData = {
        labels: ['Thành công', 'Thất bại'],
        datasets: [
            {
                data: [
                    reportData?.thongKeDangKy.soDangKyThanhCong || 0,
                    reportData?.thongKeDangKy.soDangKyThatBai || 0
                ],
                backgroundColor: ['#4CAF50', '#EF5350'],
                borderWidth: 0
            }
        ]
    };

    // Chart data cho top khoa theo sinh viên
    const topKhoaData = {
        labels: reportData?.thongKeTheoKhoa.slice(0, 5).map(khoa => khoa.tenKhoa) || [],
        datasets: [
            {
                label: 'Số sinh viên',
                data: reportData?.thongKeTheoKhoa.slice(0, 5).map(khoa => khoa.soSinhVien) || [],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            }
        }
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Đang tải báo cáo...</p>
                </div>
            </div>
        );
    }

    if (!reportData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-red-500 text-lg">Không thể tải báo cáo tổng hợp</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo tổng hợp</h1>
                    <p className="text-gray-600">Tổng quan hệ thống quản lý đăng ký học phần</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Tổng số sinh viên */}
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Tổng số sinh viên</p>
                                <p className="text-3xl font-bold">{(reportData.thongKeTongQuan.tongSoSinhVien || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-users text-xl"></i>
                            </div>
                        </div>
                    </Card>

                    {/* Tổng số giảng viên */}
                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">Tổng số giảng viên</p>
                                <p className="text-3xl font-bold">{(reportData.thongKeTongQuan.tongSoGiangVien || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-user text-xl"></i>
                            </div>
                        </div>
                    </Card>

                    {/* Tổng số lớp học phần */}
                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Lớp học phần</p>
                                <p className="text-3xl font-bold">{(reportData.thongKeTongQuan.tongSoLopHocPhan || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-building text-xl"></i>
                            </div>
                        </div>
                    </Card>

                    {/* Tổng số khoa */}
                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Tổng số khoa</p>
                                <p className="text-3xl font-bold">{(reportData.thongKeTongQuan.tongSoKhoa || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-sitemap text-xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Second Row Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Học phần */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-book text-2xl text-indigo-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Học phần</h3>
                            <p className="text-3xl font-bold text-indigo-600">{(reportData.thongKeTongQuan.tongSoHocPhan || 0).toLocaleString()}</p>
                        </div>
                    </Card>

                    {/* Tổng đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-check-circle text-2xl text-teal-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng đăng ký</h3>
                            <p className="text-3xl font-bold text-teal-600">{(reportData.thongKeDangKy.tongSoDangKy || 0).toLocaleString()}</p>
                        </div>
                    </Card>

                    {/* Tỷ lệ đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-percentage text-2xl text-pink-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tỷ lệ đăng ký</h3>
                            <p className="text-3xl font-bold text-pink-600">{(reportData.thongKeTongQuan.tyLeDangKyTrungBinh || 0).toFixed(1)}%</p>
                        </div>
                    </Card>

                    {/* Điểm trung bình */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-star text-2xl text-yellow-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Điểm TB toàn trường</h3>
                            <p className="text-3xl font-bold text-yellow-600">{(reportData.thongKeTongQuan.diemTrungBinhToanTruong || 0).toFixed(2)}</p>
                        </div>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Phân bố điểm Chart */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Phân bố điểm</h3>
                        <div className="h-80">
                            <Doughnut data={gradeDistributionData} options={chartOptions} />
                        </div>
                        <div className="grid grid-cols-5 gap-2 mt-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-600">Dưới 4.0</p>
                                <p className="text-sm font-bold text-red-600">{reportData.phanBoDiem.soSinhVienDiemDuoi4}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600">4.0-5.5</p>
                                <p className="text-sm font-bold text-orange-600">{reportData.phanBoDiem.soSinhVienDiem4Den55}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600">5.5-7.0</p>
                                <p className="text-sm font-bold text-yellow-600">{reportData.phanBoDiem.soSinhVienDiem55Den7}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600">7.0-8.5</p>
                                <p className="text-sm font-bold text-green-600">{reportData.phanBoDiem.soSinhVienDiem7Den85}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-600">8.5-10.0</p>
                                <p className="text-sm font-bold text-blue-600">{reportData.phanBoDiem.soSinhVienDiem85Den10}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Thống kê đăng ký Chart */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Thống kê đăng ký</h3>
                        <div className="h-80">
                            <Doughnut data={registrationData} options={chartOptions} />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Thành công</p>
                                <p className="text-lg font-bold text-green-600">{reportData.thongKeDangKy.soDangKyThanhCong}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Thất bại</p>
                                <p className="text-lg font-bold text-red-600">{reportData.thongKeDangKy.soDangKyThatBai}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Top Khoa Chart */}
                <div className="mb-8">
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top 5 Khoa theo số sinh viên</h3>
                        <div className="h-80">
                            <Bar data={topKhoaData} options={barChartOptions} />
                        </div>
                    </Card>
                </div>

                {/* Top Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Top Giảng viên */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Giảng viên</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {reportData.topGiangVien.slice(0, 5).map((gv, index) => (
                                <div key={gv.maGiangVien} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{gv.tenGiangVien}</p>
                                            <p className="text-sm text-gray-600">{gv.tenKhoa}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-blue-600">{gv.diemTrungBinh.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{gv.tongSoSinhVien} sinh viên</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Top Sinh viên */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Top Sinh viên</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {reportData.topSinhVien.slice(0, 5).map((sv, index) => (
                                <div key={sv.maSinhVien} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-green-600">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{sv.hoTenSinhVien}</p>
                                            <p className="text-sm text-gray-600">{sv.tenLop}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">{sv.diemTrungBinh.toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">{sv.soTinChiHoanThanh} TC</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Progress Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tỷ lệ thành công đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tỷ lệ thành công đăng ký</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Thành công</span>
                                    <span>{reportData.thongKeDangKy.tyLeThanhCong.toFixed(1)}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.thongKeDangKy.tyLeThanhCong}
                                    color="green"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Đăng ký thành công</p>
                                    <p className="text-lg font-bold text-green-600">{reportData.thongKeDangKy.soDangKyThanhCong}</p>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Đăng ký thất bại</p>
                                    <p className="text-lg font-bold text-red-600">{reportData.thongKeDangKy.soDangKyThatBai}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Xếp loại học tập */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Xếp loại học tập</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Loại A</p>
                                    <p className="text-lg font-bold text-blue-600">{reportData.phanBoDiem.xepLoai.A}</p>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Loại B</p>
                                    <p className="text-lg font-bold text-green-600">{reportData.phanBoDiem.xepLoai.B}</p>
                                </div>
                                <div className="bg-yellow-50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Loại C</p>
                                    <p className="text-lg font-bold text-yellow-600">{reportData.phanBoDiem.xepLoai.C}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Tổng số sinh viên có xếp loại</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {reportData.phanBoDiem.xepLoai.A + reportData.phanBoDiem.xepLoai.B + reportData.phanBoDiem.xepLoai.C}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Toast ref={toast} position="top-right" />
        </div>
    );
} 