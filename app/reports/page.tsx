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

interface AcademicReport {
    maBaoCao: string;
    tenBaoCao: string;
    loaiBaoCao: string;
    ngayTao: string;
    trangThai: string;
    fileUrl?: string;
}

interface AttendanceReport {
    maBaoCao: string;
    tenBaoCao: string;
    hocKy: number;
    namHoc: string;
    ngayTao: string;
    trangThai: string;
    fileUrl?: string;
}

interface GradeReport {
    maBaoCao: string;
    tenBaoCao: string;
    hocKy: number;
    namHoc: string;
    ngayTao: string;
    trangThai: string;
    fileUrl?: string;
}

export default function ReportsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const [academicReports] = useState<AcademicReport[]>([
        {
            maBaoCao: 'BC001',
            tenBaoCao: 'Báo cáo học tập học kỳ 1 năm 2023-2024',
            loaiBaoCao: 'Học tập',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/academic/BC001.pdf'
        },
        {
            maBaoCao: 'BC002',
            tenBaoCao: 'Báo cáo rèn luyện học kỳ 1 năm 2023-2024',
            loaiBaoCao: 'Rèn luyện',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/academic/BC002.pdf'
        }
    ]);

    const [attendanceReports] = useState<AttendanceReport[]>([
        {
            maBaoCao: 'BC003',
            tenBaoCao: 'Báo cáo điểm danh học kỳ 1 năm 2023-2024',
            hocKy: 1,
            namHoc: '2023-2024',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/attendance/BC003.pdf'
        }
    ]);

    const [gradeReports] = useState<GradeReport[]>([
        {
            maBaoCao: 'BC004',
            tenBaoCao: 'Bảng điểm học kỳ 1 năm 2023-2024',
            hocKy: 1,
            namHoc: '2023-2024',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/grades/BC004.pdf'
        }
    ]);

    const [selectedReport, setSelectedReport] = useState<AcademicReport | AttendanceReport | GradeReport | null>(null);
    const [reportDetailDialogVisible, setReportDetailDialogVisible] = useState(false);

    const statusTemplate = (rowData: AcademicReport | AttendanceReport | GradeReport) => {
        const status = rowData.trangThai;
        const severity = status === 'Đã duyệt' ? 'success' : 'warning';
        return <Tag value={status} severity={severity} />;
    };

    const actionTemplate = (rowData: AcademicReport | AttendanceReport | GradeReport) => {
        return (
            <div className="flex gap-2">
                <Button
                    label="Xem"
                    icon="pi pi-eye"
                    className="p-button-info"
                    onClick={() => {
                        setSelectedReport(rowData);
                        setReportDetailDialogVisible(true);
                    }}
                />
                <Button
                    label="Tải xuống"
                    icon="pi pi-download"
                    className="p-button-success"
                    onClick={() => window.open(rowData.fileUrl, '_blank')}
                />
            </div>
        );
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Báo cáo</h1>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Báo cáo học tập">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm báo cáo..." />
                        </span>
                    </div>

                    <DataTable
                        value={academicReports}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy báo cáo nào"
                    >
                        <Column field="maBaoCao" header="Mã báo cáo" sortable />
                        <Column field="tenBaoCao" header="Tên báo cáo" sortable />
                        <Column field="loaiBaoCao" header="Loại báo cáo" sortable />
                        <Column field="ngayTao" header="Ngày tạo" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '12rem' }} />
                    </DataTable>
                </TabPanel>

                <TabPanel header="Báo cáo điểm danh">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm báo cáo..." />
                        </span>
                    </div>

                    <DataTable
                        value={attendanceReports}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy báo cáo nào"
                    >
                        <Column field="maBaoCao" header="Mã báo cáo" sortable />
                        <Column field="tenBaoCao" header="Tên báo cáo" sortable />
                        <Column field="hocKy" header="Học kỳ" sortable />
                        <Column field="namHoc" header="Năm học" sortable />
                        <Column field="ngayTao" header="Ngày tạo" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '12rem' }} />
                    </DataTable>
                </TabPanel>

                <TabPanel header="Bảng điểm">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm báo cáo..." />
                        </span>
                    </div>

                    <DataTable
                        value={gradeReports}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy báo cáo nào"
                    >
                        <Column field="maBaoCao" header="Mã báo cáo" sortable />
                        <Column field="tenBaoCao" header="Tên báo cáo" sortable />
                        <Column field="hocKy" header="Học kỳ" sortable />
                        <Column field="namHoc" header="Năm học" sortable />
                        <Column field="ngayTao" header="Ngày tạo" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '12rem' }} />
                    </DataTable>
                </TabPanel>
            </TabView>

            {/* Report Detail Dialog */}
            <Dialog
                visible={reportDetailDialogVisible}
                onHide={() => setReportDetailDialogVisible(false)}
                header="Chi tiết báo cáo"
                modal
                style={{ width: '50vw' }}
            >
                {selectedReport && (
                    <div className="grid">
                        <div className="col-12">
                            <p><strong>Mã báo cáo:</strong> {selectedReport.maBaoCao}</p>
                            <p><strong>Tên báo cáo:</strong> {selectedReport.tenBaoCao}</p>
                            <p><strong>Ngày tạo:</strong> {selectedReport.ngayTao}</p>
                            <p><strong>Trạng thái:</strong> {selectedReport.trangThai}</p>
                            {'loaiBaoCao' in selectedReport && (
                                <p><strong>Loại báo cáo:</strong> {selectedReport.loaiBaoCao}</p>
                            )}
                            {'hocKy' in selectedReport && (
                                <p><strong>Học kỳ:</strong> {selectedReport.hocKy}</p>
                            )}
                            {'namHoc' in selectedReport && (
                                <p><strong>Năm học:</strong> {selectedReport.namHoc}</p>
                            )}
                        </div>
                        <div className="col-12 flex justify-content-end gap-2">
                            <Button
                                label="Đóng"
                                icon="pi pi-times"
                                className="p-button-text"
                                onClick={() => setReportDetailDialogVisible(false)}
                            />
                            <Button
                                label="Tải xuống"
                                icon="pi pi-download"
                                className="p-button-success"
                                onClick={() => window.open(selectedReport.fileUrl, '_blank')}
                            />
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 