'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';

interface Grade {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: number;
    namHoc: string;
    diemQuaTrinh: number;
    diemGiuaKy: number;
    diemCuoiKy: number;
    diemTrungBinh: number;
    diemChu: string;
    trangThai: string;
}

interface SemesterSummary {
    hocKy: number;
    namHoc: string;
    tongSoTinChi: number;
    diemTrungBinh: number;
    xepLoai: string;
}

export default function GradeManagementPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const [semesterSummaries] = useState<SemesterSummary[]>([
        {
            hocKy: 1,
            namHoc: '2023-2024',
            tongSoTinChi: 18,
            diemTrungBinh: 3.5,
            xepLoai: 'Khá'
        },
        {
            hocKy: 2,
            namHoc: '2022-2023',
            tongSoTinChi: 21,
            diemTrungBinh: 3.7,
            xepLoai: 'Khá'
        }
    ]);

    const [grades] = useState<Grade[]>([
        {
            maHocPhan: 'INT1234',
            tenHocPhan: 'Lập trình Web',
            soTinChi: 3,
            hocKy: 1,
            namHoc: '2023-2024',
            diemQuaTrinh: 8.5,
            diemGiuaKy: 7.5,
            diemCuoiKy: 8.0,
            diemTrungBinh: 8.0,
            diemChu: 'B+',
            trangThai: 'Đã hoàn thành'
        },
        {
            maHocPhan: 'INT1235',
            tenHocPhan: 'Cơ sở dữ liệu',
            soTinChi: 3,
            hocKy: 1,
            namHoc: '2023-2024',
            diemQuaTrinh: 9.0,
            diemGiuaKy: 8.5,
            diemCuoiKy: 9.0,
            diemTrungBinh: 8.8,
            diemChu: 'A',
            trangThai: 'Đã hoàn thành'
        }
    ]);

    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [gradeDetailDialogVisible, setGradeDetailDialogVisible] = useState(false);

    const statusTemplate = (rowData: Grade) => {
        const status = rowData.trangThai;
        const severity = status === 'Đã hoàn thành' ? 'success' : 'warning';
        return <Tag value={status} severity={severity} />;
    };

    const gradeTemplate = (rowData: Grade) => {
        const grade = rowData.diemChu;
        let severity = 'info';
        if (grade === 'A' || grade === 'A+') severity = 'success';
        else if (grade === 'B' || grade === 'B+') severity = 'info';
        else if (grade === 'C' || grade === 'C+') severity = 'warning';
        else if (grade === 'D' || grade === 'D+') severity = 'danger';
        return <Tag value={grade} severity={severity} />;
    };

    const actionTemplate = (rowData: Grade) => {
        return (
            <Button
                label="Chi tiết"
                icon="pi pi-info-circle"
                className="p-button-info"
                onClick={() => {
                    setSelectedGrade(rowData);
                    setGradeDetailDialogVisible(true);
                }}
            />
        );
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý điểm</h1>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Tổng quan">
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
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm học phần..." />
                        </span>
                    </div>

                    <DataTable
                        value={grades}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy học phần nào"
                    >
                        <Column field="maHocPhan" header="Mã học phần" sortable />
                        <Column field="tenHocPhan" header="Tên học phần" sortable />
                        <Column field="soTinChi" header="Số tín chỉ" sortable />
                        <Column field="hocKy" header="Học kỳ" sortable />
                        <Column field="namHoc" header="Năm học" sortable />
                        <Column field="diemQuaTrinh" header="Điểm quá trình" sortable />
                        <Column field="diemGiuaKy" header="Điểm giữa kỳ" sortable />
                        <Column field="diemCuoiKy" header="Điểm cuối kỳ" sortable />
                        <Column field="diemTrungBinh" header="Điểm trung bình" sortable />
                        <Column field="diemChu" header="Điểm chữ" body={gradeTemplate} sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '8rem' }} />
                    </DataTable>
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