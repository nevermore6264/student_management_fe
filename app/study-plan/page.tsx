'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';

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
        let severity: "success" | "warning" | "info" = 'info';
        if (status === 'Đã hoàn thành') severity = 'success';
        else if (status === 'Đang học') severity = 'warning';
        return <Tag value={status} severity={severity} />;
    };

    const courseTypeTemplate = (rowData: Course) => {
        const type = rowData.loaiHocPhan;
        const severity: "danger" | "info" = type === 'Bắt buộc' ? 'danger' : 'info';
        return <Tag value={type} severity={severity} />;
    };

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <div className="w-full flex justify-content-between align-items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-700 text-center">Kế hoạch học tập</h1>
                <Button
                    label="Tạo kế hoạch mới"
                    icon="pi pi-plus"
                    className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                />
            </div>

            <div className="w-full mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Kế hoạch hiện tại</h2>
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Tên kế hoạch</th>
                                <th className="px-4 py-2 text-left">Ngày tạo</th>
                                <th className="px-4 py-2 text-left">Trạng thái</th>
                                <th className="px-4 py-2 text-left">Tổng số tín chỉ</th>
                                <th className="px-4 py-2 text-left">Điểm trung bình</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studyPlans.map((plan) => (
                                <tr key={plan.maKeHoach} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2">{plan.tenKeHoach}</td>
                                    <td className="px-4 py-2">{plan.ngayTao}</td>
                                    <td className="px-4 py-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
                                            {plan.trangThai}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2">{plan.tongSoTinChi}</td>
                                    <td className="px-4 py-2">{plan.diemTrungBinh}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full">
                <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="w-full">
                    <TabPanel header="Tổng quan">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="block text-gray-500 font-medium mb-2">Tổng số tín chỉ</span>
                                        <div className="text-gray-900 font-bold text-2xl">24</div>
                                    </div>
                                    <div className="flex items-center justify-center bg-blue-100 rounded-full w-12 h-12">
                                        <i className="pi pi-book text-blue-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="block text-gray-500 font-medium mb-2">Đã hoàn thành</span>
                                        <div className="text-gray-900 font-bold text-2xl">12</div>
                                    </div>
                                    <div className="flex items-center justify-center bg-green-100 rounded-full w-12 h-12">
                                        <i className="pi pi-check text-green-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="block text-gray-500 font-medium mb-2">Đang học</span>
                                        <div className="text-gray-900 font-bold text-2xl">6</div>
                                    </div>
                                    <div className="flex items-center justify-center bg-yellow-100 rounded-full w-12 h-12">
                                        <i className="pi pi-clock text-yellow-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="block text-gray-500 font-medium mb-2">Điểm trung bình</span>
                                        <div className="text-gray-900 font-bold text-2xl">3.5</div>
                                    </div>
                                    <div className="flex items-center justify-center bg-purple-100 rounded-full w-12 h-12">
                                        <i className="pi pi-star text-purple-500 text-xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Danh sách học phần">
                        <div className="flex justify-content-between mb-4">
                            <span className="p-input-icon-left">
                                <InputText placeholder="Tìm kiếm học phần..." className="w-full" />
                            </span>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <table className="w-full border rounded-lg overflow-hidden">
                                <thead className="bg-blue-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Mã học phần</th>
                                        <th className="px-4 py-2 text-left">Tên học phần</th>
                                        <th className="px-4 py-2 text-left">Số tín chỉ</th>
                                        <th className="px-4 py-2 text-left">Loại học phần</th>
                                        <th className="px-4 py-2 text-left">Học kỳ</th>
                                        <th className="px-4 py-2 text-left">Năm học</th>
                                        <th className="px-4 py-2 text-left">Trạng thái</th>
                                        <th className="px-4 py-2 text-left">Điểm trung bình</th>
                                        <th className="px-4 py-2 text-center">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.map((course) => (
                                        <tr key={course.maHocPhan} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono">{course.maHocPhan}</td>
                                            <td className="px-4 py-2">{course.tenHocPhan}</td>
                                            <td className="px-4 py-2">{course.soTinChi}</td>
                                            <td className="px-4 py-2">
                                                {courseTypeTemplate(course)}
                                            </td>
                                            <td className="px-4 py-2">{course.hocKy}</td>
                                            <td className="px-4 py-2">{course.namHoc}</td>
                                            <td className="px-4 py-2">
                                                {statusTemplate(course)}
                                            </td>
                                            <td className="px-4 py-2">{course.diemTrungBinh || 'Chưa có'}</td>
                                            <td className="px-4 py-2 text-center">
                                                <Button
                                                    icon="pi pi-info-circle"
                                                    className="p-button-rounded p-button-info text-lg"
                                                    tooltip="Xem chi tiết"
                                                    onClick={() => {
                                                        setSelectedCourse(course);
                                                        setCourseDetailDialogVisible(true);
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabPanel>
                </TabView>
            </div>

            {/* Course Detail Dialog */}
            <Dialog
                visible={courseDetailDialogVisible}
                onHide={() => setCourseDetailDialogVisible(false)}
                header="Chi tiết học phần"
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                            onClick={() => setCourseDetailDialogVisible(false)}
                        >
                            Đóng
                        </button>
                    </div>
                }
            >
                {selectedCourse && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Mã học phần</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base font-mono">
                                {selectedCourse.maHocPhan}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Tên học phần</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {selectedCourse.tenHocPhan}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Số tín chỉ</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {selectedCourse.soTinChi}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Loại học phần</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {courseTypeTemplate(selectedCourse)}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Học kỳ</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {selectedCourse.hocKy}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Năm học</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {selectedCourse.namHoc}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Trạng thái</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {statusTemplate(selectedCourse)}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-700 font-medium">Điểm trung bình</label>
                            <div className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base">
                                {selectedCourse.diemTrungBinh || 'Chưa có'}
                            </div>
                        </div>
                        <div className="col-span-full">
                            <h3 className="text-lg font-semibold mb-3 text-blue-700">Học phần tiên quyết</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-base text-gray-600">
                                Không có
                            </div>
                        </div>
                        <div className="col-span-full">
                            <h3 className="text-lg font-semibold mb-3 text-blue-700">Học phần song hành</h3>
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-base text-gray-600">
                                Không có
                            </div>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 