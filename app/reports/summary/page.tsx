'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import adminReportService, { AdminReportResponse } from '../../services/adminReportService';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

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

    // Chart data cho đăng ký
    const registrationChartData = {
        labels: ['Chờ duyệt', 'Đã duyệt', 'Từ chối'],
        datasets: [
            {
                data: [
                    reportData?.dangKyChoDuyet || 0,
                    reportData?.dangKyDaDuyet || 0,
                    reportData?.dangKyTuChoi || 0
                ],
                backgroundColor: ['#FFA726', '#66BB6A', '#EF5350'],
                borderWidth: 0
            }
        ]
    };

    // Chart data cho kế hoạch học tập
    const studyPlanChartData = {
        labels: ['Hoàn thành', 'Đang học', 'Chưa học'],
        datasets: [
            {
                data: [
                    reportData?.keHoachHoanThanh || 0,
                    reportData?.keHoachDangHoc || 0,
                    reportData?.keHoachChuaHoc || 0
                ],
                backgroundColor: ['#4CAF50', '#2196F3', '#9E9E9E'],
                borderWidth: 0
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
                                <p className="text-3xl font-bold">{(reportData.tongSoSinhVien || 0).toLocaleString()}</p>
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
                                <p className="text-3xl font-bold">{(reportData.tongSoGiangVien || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-user text-xl"></i>
                            </div>
                        </div>
                    </Card>

                    {/* Tổng số lớp */}
                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Tổng số lớp</p>
                                <p className="text-3xl font-bold">{(reportData.tongSoLop || 0).toLocaleString()}</p>
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
                                <p className="text-3xl font-bold">{(reportData.tongSoKhoa || 0).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                                <i className="pi pi-sitemap text-xl"></i>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Second Row Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Học phần */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-book text-2xl text-indigo-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Học phần</h3>
                            <p className="text-3xl font-bold text-indigo-600">{(reportData.tongSoHocPhan || 0).toLocaleString()}</p>
                        </div>
                    </Card>

                    {/* Đợt đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-calendar text-2xl text-pink-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Đợt đăng ký</h3>
                            <p className="text-3xl font-bold text-pink-600">{(reportData.tongSoDotDangKy || 0).toLocaleString()}</p>
                        </div>
                    </Card>

                    {/* Tổng đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="pi pi-check-circle text-2xl text-teal-600"></i>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng đăng ký</h3>
                            <p className="text-3xl font-bold text-teal-600">{(reportData.tongSoDangKy || 0).toLocaleString()}</p>
                        </div>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Đăng ký Chart */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Thống kê đăng ký</h3>
                        <div className="h-80">
                            <Doughnut data={registrationChartData} options={chartOptions} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Chờ duyệt</p>
                                <p className="text-lg font-bold text-orange-600">{reportData.dangKyChoDuyet}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Đã duyệt</p>
                                <p className="text-lg font-bold text-green-600">{reportData.dangKyDaDuyet}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Từ chối</p>
                                <p className="text-lg font-bold text-red-600">{reportData.dangKyTuChoi}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Kế hoạch học tập Chart */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Kế hoạch học tập</h3>
                        <div className="h-80">
                            <Doughnut data={studyPlanChartData} options={chartOptions} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Hoàn thành</p>
                                <p className="text-lg font-bold text-green-600">{reportData.keHoachHoanThanh}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Đang học</p>
                                <p className="text-lg font-bold text-blue-600">{reportData.keHoachDangHoc}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Chưa học</p>
                                <p className="text-lg font-bold text-gray-600">{reportData.keHoachChuaHoc}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Progress Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Tỷ lệ đăng ký */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tỷ lệ đăng ký</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Đã duyệt</span>
                                    <span>{reportData.tongSoDangKy > 0 ? Math.round((reportData.dangKyDaDuyet / reportData.tongSoDangKy) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoDangKy > 0 ? (reportData.dangKyDaDuyet / reportData.tongSoDangKy) * 100 : 0}
                                    color="green"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Chờ duyệt</span>
                                    <span>{reportData.tongSoDangKy > 0 ? Math.round((reportData.dangKyChoDuyet / reportData.tongSoDangKy) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoDangKy > 0 ? (reportData.dangKyChoDuyet / reportData.tongSoDangKy) * 100 : 0}
                                    color="orange"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Từ chối</span>
                                    <span>{reportData.tongSoDangKy > 0 ? Math.round((reportData.dangKyTuChoi / reportData.tongSoDangKy) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoDangKy > 0 ? (reportData.dangKyTuChoi / reportData.tongSoDangKy) * 100 : 0}
                                    color="red"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Tỷ lệ kế hoạch học tập */}
                    <Card className="bg-white shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Tỷ lệ kế hoạch học tập</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Hoàn thành</span>
                                    <span>{reportData.tongSoKeHoachHocTap > 0 ? Math.round((reportData.keHoachHoanThanh / reportData.tongSoKeHoachHocTap) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoKeHoachHocTap > 0 ? (reportData.keHoachHoanThanh / reportData.tongSoKeHoachHocTap) * 100 : 0}
                                    color="green"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Đang học</span>
                                    <span>{reportData.tongSoKeHoachHocTap > 0 ? Math.round((reportData.keHoachDangHoc / reportData.tongSoKeHoachHocTap) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoKeHoachHocTap > 0 ? (reportData.keHoachDangHoc / reportData.tongSoKeHoachHocTap) * 100 : 0}
                                    color="blue"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Chưa học</span>
                                    <span>{reportData.tongSoKeHoachHocTap > 0 ? Math.round((reportData.keHoachChuaHoc / reportData.tongSoKeHoachHocTap) * 100) : 0}%</span>
                                </div>
                                <ProgressBar
                                    value={reportData.tongSoKeHoachHocTap > 0 ? (reportData.keHoachChuaHoc / reportData.tongSoKeHoachHocTap) * 100 : 0}
                                    color="gray"
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Toast ref={toast} position="top-right" />
        </div>
    );
} 