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

interface Course {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    loaiHocPhan: string;
    hocKy: number;
    namHoc: string;
    trangThai: string;
    diemTrungBinh?: number;
}

interface StudyPlan {
    maKeHoach: string;
    tenKeHoach: string;
    ngayTao: string;
    trangThai: string;
    tongSoTinChi: number;
    diemTrungBinh: number;
}

export default function StudyPlanPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);

    const [studyPlans] = useState<StudyPlan[]>([
        {
            maKeHoach: 'KH001',
            tenKeHoach: 'Kế hoạch học tập năm 2023-2024',
            ngayTao: '2023-08-01',
            trangThai: 'Đang thực hiện',
            tongSoTinChi: 24,
            diemTrungBinh: 3.5
        }
    ]);

    const [courses] = useState<Course[]>([
        {
            maHocPhan: 'INT1234',
            tenHocPhan: 'Lập trình Web',
            soTinChi: 3,
            loaiHocPhan: 'Bắt buộc',
            hocKy: 1,
            namHoc: '2023-2024',
            trangThai: 'Đã hoàn thành',
            diemTrungBinh: 3.7
        },
        {
            maHocPhan: 'INT1235',
            tenHocPhan: 'Cơ sở dữ liệu',
            soTinChi: 3,
            loaiHocPhan: 'Bắt buộc',
            hocKy: 1,
            namHoc: '2023-2024',
            trangThai: 'Đang học',
            diemTrungBinh: 0
        },
        {
            maHocPhan: 'INT1236',
            tenHocPhan: 'Lập trình di động',
            soTinChi: 3,
            loaiHocPhan: 'Tự chọn',
            hocKy: 2,
            namHoc: '2023-2024',
            trangThai: 'Chưa học',
            diemTrungBinh: 0
        }
    ]);

    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [courseDetailDialogVisible, setCourseDetailDialogVisible] = useState(false);

    const statusTemplate = (rowData: Course) => {
        const status = rowData.trangThai;
        let severity = 'info';
        if (status === 'Đã hoàn thành') severity = 'success';
        else if (status === 'Đang học') severity = 'warning';
        return <Tag value={status} severity={severity} />;
    };

    const actionTemplate = (rowData: Course) => {
        return (
            <Button
                label="Chi tiết"
                icon="pi pi-info-circle"
                className="p-button-info"
                onClick={() => {
                    setSelectedCourse(rowData);
                    setCourseDetailDialogVisible(true);
                }}
            />
        );
    };

    const courseTypeTemplate = (rowData: Course) => {
        const type = rowData.loaiHocPhan;
        const severity = type === 'Bắt buộc' ? 'danger' : 'info';
        return <Tag value={type} severity={severity} />;
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Kế hoạch học tập</h1>
                <Button
                    label="Tạo kế hoạch mới"
                    icon="pi pi-plus"
                    className="p-button-primary"
                />
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Kế hoạch hiện tại</h2>
                <DataTable
                    value={studyPlans}
                    className="p-datatable-sm"
                    emptyMessage="Chưa có kế hoạch học tập nào"
                >
                    <Column field="tenKeHoach" header="Tên kế hoạch" />
                    <Column field="ngayTao" header="Ngày tạo" />
                    <Column field="trangThai" header="Trạng thái" />
                    <Column field="tongSoTinChi" header="Tổng số tín chỉ" />
                    <Column field="diemTrungBinh" header="Điểm trung bình" />
                </DataTable>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Tổng quan">
                    <div className="grid">
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Tổng số tín chỉ</span>
                                        <div className="text-900 font-medium text-xl">24</div>
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
                                        <span className="block text-500 font-medium mb-3">Đã hoàn thành</span>
                                        <div className="text-900 font-medium text-xl">12</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-green-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-check text-green-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Đang học</span>
                                        <div className="text-900 font-medium text-xl">6</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-yellow-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-clock text-yellow-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-3">
                            <div className="surface-card shadow-2 p-3 border-round">
                                <div className="flex justify-content-between mb-3">
                                    <div>
                                        <span className="block text-500 font-medium mb-3">Điểm trung bình</span>
                                        <div className="text-900 font-medium text-xl">3.5</div>
                                    </div>
                                    <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                        <i className="pi pi-star text-purple-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>

                <TabPanel header="Danh sách học phần">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm học phần..." />
                        </span>
                    </div>

                    <DataTable
                        value={courses}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy học phần nào"
                    >
                        <Column field="maHocPhan" header="Mã học phần" sortable />
                        <Column field="tenHocPhan" header="Tên học phần" sortable />
                        <Column field="soTinChi" header="Số tín chỉ" sortable />
                        <Column field="loaiHocPhan" header="Loại học phần" body={courseTypeTemplate} sortable />
                        <Column field="hocKy" header="Học kỳ" sortable />
                        <Column field="namHoc" header="Năm học" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column field="diemTrungBinh" header="Điểm trung bình" sortable />
                        <Column body={actionTemplate} style={{ width: '8rem' }} />
                    </DataTable>
                </TabPanel>
            </TabView>

            {/* Course Detail Dialog */}
            <Dialog
                visible={courseDetailDialogVisible}
                onHide={() => setCourseDetailDialogVisible(false)}
                header="Chi tiết học phần"
                modal
                style={{ width: '50vw' }}
            >
                {selectedCourse && (
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <p><strong>Mã học phần:</strong> {selectedCourse.maHocPhan}</p>
                            <p><strong>Tên học phần:</strong> {selectedCourse.tenHocPhan}</p>
                            <p><strong>Số tín chỉ:</strong> {selectedCourse.soTinChi}</p>
                            <p><strong>Loại học phần:</strong> {selectedCourse.loaiHocPhan}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <p><strong>Học kỳ:</strong> {selectedCourse.hocKy}</p>
                            <p><strong>Năm học:</strong> {selectedCourse.namHoc}</p>
                            <p><strong>Trạng thái:</strong> {selectedCourse.trangThai}</p>
                            <p><strong>Điểm trung bình:</strong> {selectedCourse.diemTrungBinh || 'Chưa có'}</p>
                        </div>
                        <div className="col-12">
                            <h3 className="text-xl font-semibold mb-2">Học phần tiên quyết</h3>
                            <p>Không có</p>
                        </div>
                        <div className="col-12">
                            <h3 className="text-xl font-semibold mb-2">Học phần song hành</h3>
                            <p>Không có</p>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 