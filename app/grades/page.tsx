/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Message } from 'primereact/message';
import gradeService, { SemesterSummary, Grade } from '../services/gradeService';

export default function GradeManagementPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [semesterSummaries, setSemesterSummaries] = useState<SemesterSummary[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [gradeDetailDialogVisible, setGradeDetailDialogVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOverview = async () => {
        setLoading(true); setError('');
        try {
            const res = await gradeService.getAllOverview();
            if (res.success && Array.isArray(res.data)) {
                setSemesterSummaries(res.data);
            } else {
                setSemesterSummaries([]);
                setError(res.message || 'Dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tải tổng quan điểm');
            setSemesterSummaries([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchDetails = async () => {
        setLoading(true); setError('');
        try {
            const res = await gradeService.getAllDetails();
            if (res.success && Array.isArray(res.data)) {
                setGrades(res.data);
            } else {
                setGrades([]);
                setError(res.message || 'Dữ liệu không hợp lệ');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tải chi tiết điểm');
            setGrades([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (activeTab === 0) fetchOverview();
        else fetchDetails();
    }, [activeTab]);

    const filteredGrades = grades.filter(grade =>
        (grade.tenHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (grade.maHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const calculateOverallStats = () => {
        if (grades.length === 0) return { totalCredits: 0, avgGrade: 0, totalSubjects: 0 };

        const totalCredits = grades.reduce((sum, grade) => sum + (grade.soTinChi || 0), 0);
        const avgGrade = grades.reduce((sum, grade) => sum + (grade.diemTrungBinh || 0), 0) / grades.length;
        const totalSubjects = grades.length;

        return { totalCredits, avgGrade: parseFloat(avgGrade.toFixed(2)), totalSubjects };
    };

    const stats = calculateOverallStats();

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý điểm</h1>

            {error && <Message severity="error" text={error} className="mb-4" />}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium mb-1">Tổng số tín chỉ</p>
                            <p className="text-2xl font-bold text-blue-700">{stats.totalCredits}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <i className="pi pi-book text-xl text-blue-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium mb-1">Điểm trung bình</p>
                            <p className="text-2xl font-bold text-green-700">{stats.avgGrade}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <i className="pi pi-star text-xl text-green-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium mb-1">Xếp loại</p>
                            <p className="text-2xl font-bold text-purple-700">Khá</p>
                        </div>
                        <div className="bg-purple-100 rounded-full p-3">
                            <i className="pi pi-trophy text-xl text-purple-600"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-600 text-sm font-medium mb-1">Số học phần</p>
                            <p className="text-2xl font-bold text-orange-700">{stats.totalSubjects}</p>
                        </div>
                        <div className="bg-orange-100 rounded-full p-3">
                            <i className="pi pi-list text-xl text-orange-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Tổng quan">
                    {loading ? (
                        <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-700">Tổng kết theo học kỳ</h2>
                            <DataTable
                                value={semesterSummaries}
                                className="p-datatable-sm"
                                emptyMessage="Không có dữ liệu"
                                stripedRows
                            >
                                <Column field="hocKy" header="Học kỳ" />
                                <Column field="namHoc" header="Năm học" />
                                <Column field="tongSoTinChi" header="Tổng số tín chỉ" />
                                <Column field="diemTrungBinh" header="Điểm trung bình" />
                                <Column field="xepLoai" header="Xếp loại" />
                            </DataTable>
                        </div>
                    )}
                </TabPanel>

                <TabPanel header="Chi tiết điểm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex gap-2 w-full md:w-1/2">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-search" />
                                <InputText
                                    placeholder="Tìm kiếm học phần..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="text-sm text-gray-600">
                            Tìm thấy {filteredGrades.length} học phần
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border rounded-lg overflow-hidden">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Mã học phần</th>
                                        <th className="px-4 py-2 text-left">Tên học phần</th>
                                        <th className="px-4 py-2 text-center">Tín chỉ</th>
                                        <th className="px-4 py-2 text-center">Học kỳ</th>
                                        <th className="px-4 py-2 text-center">Năm học</th>
                                        <th className="px-4 py-2 text-center">Điểm QT</th>
                                        <th className="px-4 py-2 text-center">Điểm GK</th>
                                        <th className="px-4 py-2 text-center">Điểm CK</th>
                                        <th className="px-4 py-2 text-center">Điểm TB</th>
                                        <th className="px-4 py-2 text-center">Điểm chữ</th>
                                        <th className="px-4 py-2 text-center">Trạng thái</th>
                                        <th className="px-4 py-2 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGrades.map((rowData) => (
                                        <tr key={rowData.maHocPhan} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono text-sm">{rowData.maHocPhan || ''}</td>
                                            <td className="px-4 py-2">{rowData.tenHocPhan || ''}</td>
                                            <td className="px-4 py-2 text-center">{rowData.soTinChi || 0}</td>
                                            <td className="px-4 py-2 text-center">{rowData.hocKy || ''}</td>
                                            <td className="px-4 py-2 text-center">{rowData.namHoc || ''}</td>
                                            <td className="px-4 py-2 text-center font-semibold">{rowData.diemQuaTrinh || 0}</td>
                                            <td className="px-4 py-2 text-center font-semibold">{rowData.diemGiuaKy || 0}</td>
                                            <td className="px-4 py-2 text-center font-semibold">{rowData.diemCuoiKy || 0}</td>
                                            <td className="px-4 py-2 text-center">
                                                <span className="font-bold text-lg">{rowData.diemTrungBinh || 0}</span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.diemChu === 'A' || rowData.diemChu === 'A+' ? 'bg-green-100 text-green-700' :
                                                    rowData.diemChu === 'B' || rowData.diemChu === 'B+' ? 'bg-blue-100 text-blue-700' :
                                                        rowData.diemChu === 'C' || rowData.diemChu === 'C+' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {rowData.diemChu || ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.trangThai === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {rowData.trangThai || ''}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <Button
                                                    icon="pi pi-info-circle"
                                                    className="p-button-rounded p-button-info p-button-sm"
                                                    onClick={() => {
                                                        setSelectedGrade(rowData);
                                                        setGradeDetailDialogVisible(true);
                                                    }}
                                                    tooltip="Xem chi tiết"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredGrades.length === 0 && (
                                        <tr>
                                            <td colSpan={12} className="text-center py-8 text-gray-500">
                                                Không tìm thấy học phần nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TabPanel>
            </TabView>

            {/* Grade Detail Dialog */}
            <Dialog
                visible={gradeDetailDialogVisible}
                onHide={() => setGradeDetailDialogVisible(false)}
                header="Chi tiết điểm"
                modal
                style={{ width: '50vw' }}
            >
                {selectedGrade && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-bold text-blue-700 mb-2">{selectedGrade.tenHocPhan || ''}</h3>
                            <p className="text-blue-600 font-mono">{selectedGrade.maHocPhan || ''}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">Thông tin học phần</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Số tín chỉ:</span>
                                        <span className="font-semibold">{selectedGrade.soTinChi || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Học kỳ:</span>
                                        <span className="font-semibold">{selectedGrade.hocKy || ''}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Năm học:</span>
                                        <span className="font-semibold">{selectedGrade.namHoc || ''}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Trạng thái:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedGrade.trangThai === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {selectedGrade.trangThai || ''}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-3">Chi tiết điểm</h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Điểm quá trình (30%):</span>
                                            <span className="font-semibold">{selectedGrade.diemQuaTrinh || 0}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(selectedGrade.diemQuaTrinh || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Điểm giữa kỳ (30%):</span>
                                            <span className="font-semibold">{selectedGrade.diemGiuaKy || 0}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(selectedGrade.diemGiuaKy || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-gray-600">Điểm cuối kỳ (40%):</span>
                                            <span className="font-semibold">{selectedGrade.diemCuoiKy || 0}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(selectedGrade.diemCuoiKy || 0) * 10}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700 mb-2">Công thức tính điểm</h4>
                            <p className="text-gray-600 text-sm">
                                Điểm trung bình = (Điểm quá trình × 0.3) + (Điểm giữa kỳ × 0.3) + (Điểm cuối kỳ × 0.4)
                            </p>
                            <p className="text-gray-500 text-sm mt-1">
                                = ({(selectedGrade.diemQuaTrinh || 0)} × 0.3) + ({(selectedGrade.diemGiuaKy || 0)} × 0.3) + ({(selectedGrade.diemCuoiKy || 0)} × 0.4) = {selectedGrade.diemTrungBinh || 0}
                            </p>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 