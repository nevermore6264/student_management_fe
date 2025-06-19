'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { Message } from 'primereact/message';

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
    const [activeTab, setActiveTab] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [success, setSuccess] = useState('');

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
        },
        {
            maBaoCao: 'BC003',
            tenBaoCao: 'Báo cáo thực tập học kỳ 2 năm 2023-2024',
            loaiBaoCao: 'Thực tập',
            ngayTao: '2024-06-15',
            trangThai: 'Chờ duyệt',
            fileUrl: '/reports/academic/BC003.pdf'
        }
    ]);

    const [attendanceReports] = useState<AttendanceReport[]>([
        {
            maBaoCao: 'BC004',
            tenBaoCao: 'Báo cáo điểm danh học kỳ 1 năm 2023-2024',
            hocKy: 1,
            namHoc: '2023-2024',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/attendance/BC004.pdf'
        },
        {
            maBaoCao: 'BC005',
            tenBaoCao: 'Báo cáo điểm danh học kỳ 2 năm 2023-2024',
            hocKy: 2,
            namHoc: '2023-2024',
            ngayTao: '2024-06-15',
            trangThai: 'Chờ duyệt',
            fileUrl: '/reports/attendance/BC005.pdf'
        }
    ]);

    const [gradeReports] = useState<GradeReport[]>([
        {
            maBaoCao: 'BC006',
            tenBaoCao: 'Bảng điểm học kỳ 1 năm 2023-2024',
            hocKy: 1,
            namHoc: '2023-2024',
            ngayTao: '2024-01-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/grades/BC006.pdf'
        },
        {
            maBaoCao: 'BC007',
            tenBaoCao: 'Bảng điểm học kỳ 2 năm 2023-2024',
            hocKy: 2,
            namHoc: '2023-2024',
            ngayTao: '2024-06-15',
            trangThai: 'Đã duyệt',
            fileUrl: '/reports/grades/BC007.pdf'
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
            <div className="flex gap-2 justify-center">
                <Button
                    icon="pi pi-eye"
                    className="p-button-rounded p-button-info text-lg"
                    tooltip="Xem chi tiết"
                    onClick={() => {
                        setSelectedReport(rowData);
                        setReportDetailDialogVisible(true);
                    }}
                />
                <Button
                    icon="pi pi-download"
                    className="p-button-rounded p-button-success text-lg"
                    tooltip="Tải xuống"
                    onClick={() => {
                        window.open(rowData.fileUrl, '_blank');
                        setSuccess('Đang tải xuống báo cáo...');
                        setTimeout(() => setSuccess(''), 2000);
                    }}
                />
            </div>
        );
    };

    const filteredAcademicReports = academicReports.filter(report =>
        report.maBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.tenBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.loaiBaoCao.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredAttendanceReports = attendanceReports.filter(report =>
        report.maBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.tenBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.namHoc.toLowerCase().includes(searchText.toLowerCase())
    );

    const filteredGradeReports = gradeReports.filter(report =>
        report.maBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.tenBaoCao.toLowerCase().includes(searchText.toLowerCase()) ||
        report.namHoc.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý báo cáo</h1>
            {success && <Message severity="success" text={success} className="mb-4" />}

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        placeholder="Tìm kiếm báo cáo..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button
                        label="Tạo báo cáo mới"
                        icon="pi pi-plus"
                        className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    />
                </div>
            </div>

            <TabView
                activeIndex={activeTab}
                onTabChange={(e) => setActiveTab(e.index)}
                className="w-full"
            >
                <TabPanel header="Báo cáo học tập">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã báo cáo</th>
                                    <th className="px-4 py-2 text-left">Tên báo cáo</th>
                                    <th className="px-4 py-2 text-left">Loại báo cáo</th>
                                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                                    <th className="px-4 py-2 text-left">Trạng thái</th>
                                    <th className="px-4 py-2 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAcademicReports.map((report) => (
                                    <tr key={report.maBaoCao} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{report.maBaoCao}</td>
                                        <td className="px-4 py-2">{report.tenBaoCao}</td>
                                        <td className="px-4 py-2">{report.loaiBaoCao}</td>
                                        <td className="px-4 py-2">{report.ngayTao}</td>
                                        <td className="px-4 py-2">{statusTemplate(report)}</td>
                                        <td className="px-4 py-2">{actionTemplate(report)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel header="Báo cáo điểm danh">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã báo cáo</th>
                                    <th className="px-4 py-2 text-left">Tên báo cáo</th>
                                    <th className="px-4 py-2 text-left">Học kỳ</th>
                                    <th className="px-4 py-2 text-left">Năm học</th>
                                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                                    <th className="px-4 py-2 text-left">Trạng thái</th>
                                    <th className="px-4 py-2 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendanceReports.map((report) => (
                                    <tr key={report.maBaoCao} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{report.maBaoCao}</td>
                                        <td className="px-4 py-2">{report.tenBaoCao}</td>
                                        <td className="px-4 py-2">{report.hocKy}</td>
                                        <td className="px-4 py-2">{report.namHoc}</td>
                                        <td className="px-4 py-2">{report.ngayTao}</td>
                                        <td className="px-4 py-2">{statusTemplate(report)}</td>
                                        <td className="px-4 py-2">{actionTemplate(report)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel header="Bảng điểm">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã báo cáo</th>
                                    <th className="px-4 py-2 text-left">Tên báo cáo</th>
                                    <th className="px-4 py-2 text-left">Học kỳ</th>
                                    <th className="px-4 py-2 text-left">Năm học</th>
                                    <th className="px-4 py-2 text-left">Ngày tạo</th>
                                    <th className="px-4 py-2 text-left">Trạng thái</th>
                                    <th className="px-4 py-2 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGradeReports.map((report) => (
                                    <tr key={report.maBaoCao} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{report.maBaoCao}</td>
                                        <td className="px-4 py-2">{report.tenBaoCao}</td>
                                        <td className="px-4 py-2">{report.hocKy}</td>
                                        <td className="px-4 py-2">{report.namHoc}</td>
                                        <td className="px-4 py-2">{report.ngayTao}</td>
                                        <td className="px-4 py-2">{statusTemplate(report)}</td>
                                        <td className="px-4 py-2">{actionTemplate(report)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            </TabView>

            {/* Report Detail Dialog */}
            <Dialog
                visible={reportDetailDialogVisible}
                onHide={() => setReportDetailDialogVisible(false)}
                header="Chi tiết báo cáo"
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Đóng"
                            icon="pi pi-times"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                            onClick={() => setReportDetailDialogVisible(false)}
                        />
                        <Button
                            label="Tải xuống"
                            icon="pi pi-download"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                            onClick={() => {
                                if (selectedReport?.fileUrl) {
                                    window.open(selectedReport.fileUrl, '_blank');
                                    setSuccess('Đang tải xuống báo cáo...');
                                    setTimeout(() => setSuccess(''), 2000);
                                }
                            }}
                        />
                    </div>
                }
            >
                {selectedReport && (
                    <div className="grid gap-4">
                        <div className="col-12">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="font-semibold text-gray-700">Mã báo cáo:</span>
                                    <span className="font-mono text-blue-700">{selectedReport.maBaoCao}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="font-semibold text-gray-700">Tên báo cáo:</span>
                                    <span className="text-blue-700">{selectedReport.tenBaoCao}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="font-semibold text-gray-700">Ngày tạo:</span>
                                    <span className="text-blue-700">{selectedReport.ngayTao}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                    <span className="font-semibold text-gray-700">Trạng thái:</span>
                                    <span>{statusTemplate(selectedReport)}</span>
                                </div>
                                {'loaiBaoCao' in selectedReport && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Loại báo cáo:</span>
                                        <span className="text-blue-700">{selectedReport.loaiBaoCao}</span>
                                    </div>
                                )}
                                {'hocKy' in selectedReport && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Học kỳ:</span>
                                        <span className="text-blue-700">{selectedReport.hocKy}</span>
                                    </div>
                                )}
                                {'namHoc' in selectedReport && (
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                        <span className="font-semibold text-gray-700">Năm học:</span>
                                        <span className="text-blue-700">{selectedReport.namHoc}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 