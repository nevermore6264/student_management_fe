'use client';

import { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import gradeService, { SemesterSummary, Grade } from '../services/gradeService';

export default function GradeManagementPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [semesterSummaries, setSemesterSummaries] = useState<SemesterSummary[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [gradeDetailDialogVisible, setGradeDetailDialogVisible] = useState(false);

    const fetchOverview = async () => {
        setLoading(true); setError('');
        try {
            const data = await gradeService.getAllOverview();
            setSemesterSummaries(data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải tổng quan điểm');
        } finally {
            setLoading(false);
        }
    };
    const fetchDetails = async () => {
        setLoading(true); setError('');
        try {
            const data = await gradeService.getAllDetails();
            setGrades(data);
        } catch (err: any) {
            setError(err.message || 'Không thể tải chi tiết điểm');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (activeTab === 0) fetchOverview();
        else fetchDetails();
    }, [activeTab]);

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý điểm</h1>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Tổng quan">
                    {loading ? (
                        <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
                    ) : (
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="surface-card shadow-2 p-3 border-round">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Tổng số tín chỉ</span>
                                            <div className="text-900 font-medium text-xl">39</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-book text-blue-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="surface-card shadow-2 p-3 border-round">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Điểm trung bình</span>
                                            <div className="text-900 font-medium text-xl">3.6</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-star text-green-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="surface-card shadow-2 p-3 border-round">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Xếp loại</span>
                                            <div className="text-900 font-medium text-xl">Khá</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-trophy text-yellow-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-3">
                                <div className="surface-card shadow-2 p-3 border-round">
                                    <div className="flex justify-content-between mb-3">
                                        <div>
                                            <span className="block text-500 font-medium mb-3">Số học phần</span>
                                            <div className="text-900 font-medium text-xl">13</div>
                                        </div>
                                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                            <i className="pi pi-list text-purple-500 text-xl" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Tổng kết theo học kỳ</h2>
                        <DataTable
                            value={semesterSummaries}
                            className="p-datatable-sm"
                            emptyMessage="Không có dữ liệu"
                        >
                            <Column field="hocKy" header="Học kỳ" />
                            <Column field="namHoc" header="Năm học" />
                            <Column field="tongSoTinChi" header="Tổng số tín chỉ" />
                            <Column field="diemTrungBinh" header="Điểm trung bình" />
                            <Column field="xepLoai" header="Xếp loại" />
                        </DataTable>
                    </div>
                </TabPanel>

                <TabPanel header="Chi tiết điểm">
                    <div className="flex justify-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm học phần..." />
                        </span>
                    </div>

                    <div className="overflow-x-auto w-full">
                        {loading ? (
                            <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
                        ) : error ? (
                            <div className="text-center py-8 text-red-500 font-semibold">{error}</div>
                        ) : (
                            <table className="w-full border rounded-lg overflow-hidden">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-4 py-2">Mã học phần</th>
                                        <th className="px-4 py-2">Tên học phần</th>
                                        <th className="px-4 py-2">Số tín chỉ</th>
                                        <th className="px-4 py-2">Học kỳ</th>
                                        <th className="px-4 py-2">Năm học</th>
                                        <th className="px-4 py-2">Điểm quá trình</th>
                                        <th className="px-4 py-2">Điểm giữa kỳ</th>
                                        <th className="px-4 py-2">Điểm cuối kỳ</th>
                                        <th className="px-4 py-2">Điểm trung bình</th>
                                        <th className="px-4 py-2">Điểm chữ</th>
                                        <th className="px-4 py-2">Trạng thái</th>
                                        <th className="px-4 py-2 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {grades.map((rowData) => (
                                        <tr key={rowData.maHocPhan} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono">{rowData.maHocPhan}</td>
                                            <td className="px-4 py-2">{rowData.tenHocPhan}</td>
                                            <td className="px-4 py-2">{rowData.soTinChi}</td>
                                            <td className="px-4 py-2">{rowData.hocKy}</td>
                                            <td className="px-4 py-2">{rowData.namHoc}</td>
                                            <td className="px-4 py-2">{rowData.diemQuaTrinh}</td>
                                            <td className="px-4 py-2">{rowData.diemGiuaKy}</td>
                                            <td className="px-4 py-2">{rowData.diemCuoiKy}</td>
                                            <td className="px-4 py-2">{rowData.diemTrungBinh}</td>
                                            <td className="px-4 py-2">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.diemChu === 'A' || rowData.diemChu === 'A+' ? 'bg-green-100 text-green-700' : rowData.diemChu === 'B' || rowData.diemChu === 'B+' ? 'bg-blue-100 text-blue-700' : rowData.diemChu === 'C' || rowData.diemChu === 'C+' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{rowData.diemChu}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.trangThai === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rowData.trangThai}</span>
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                <Button
                                                    label="Chi tiết"
                                                    icon="pi pi-info-circle"
                                                    className="p-button-info"
                                                    onClick={() => {
                                                        setSelectedGrade(rowData);
                                                        setGradeDetailDialogVisible(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {grades.length === 0 && (
                                        <tr>
                                            <td colSpan={13} className="text-center py-4 text-gray-500">Không tìm thấy học phần nào</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
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
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <p><strong>Mã học phần:</strong> {selectedGrade.maHocPhan}</p>
                            <p><strong>Tên học phần:</strong> {selectedGrade.tenHocPhan}</p>
                            <p><strong>Số tín chỉ:</strong> {selectedGrade.soTinChi}</p>
                            <p><strong>Học kỳ:</strong> {selectedGrade.hocKy}</p>
                            <p><strong>Năm học:</strong> {selectedGrade.namHoc}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <p><strong>Điểm quá trình:</strong> {selectedGrade.diemQuaTrinh}</p>
                            <p><strong>Điểm giữa kỳ:</strong> {selectedGrade.diemGiuaKy}</p>
                            <p><strong>Điểm cuối kỳ:</strong> {selectedGrade.diemCuoiKy}</p>
                            <p><strong>Điểm trung bình:</strong> {selectedGrade.diemTrungBinh}</p>
                            <p><strong>Điểm chữ:</strong> {selectedGrade.diemChu}</p>
                            <p><strong>Trạng thái:</strong> {selectedGrade.trangThai}</p>
                        </div>
                        <div className="col-12">
                            <h3 className="text-xl font-semibold mb-2">Công thức tính điểm</h3>
                            <p>Điểm trung bình = (Điểm quá trình * 0.3) + (Điểm giữa kỳ * 0.3) + (Điểm cuối kỳ * 0.4)</p>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 