'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import classSectionService, { ClassSection } from '../services/classSectionService';
import gradeService, { GradeManagement } from '../services/gradeService';

interface Student {
    maSinhVien: string;
    hoTenSinhVien: string;
    email: string;
    soDienThoai: string;
    diaChi: string;
    gioiTinh: boolean;
    maKhoa: string;
    tenKhoa: string;
    maLop: string;
    tenLop: string;
}

interface ClassOverview {
    maLopHP: string;
    tenLopHP: string;
    tenHocPhan: string;
    soTinChi: number;
    tongSoSinhVien: number;
    soSinhVienCoDiem: number;
    diemTrungBinhLop: number;
    diemCaoNhat: number;
    diemThapNhat: number;
    soSinhVienDat: number;
    soSinhVienKhongDat: number;
    thongKeDiem: Array<{
        khoangDiem: string;
        soLuong: number;
        tyLe: number;
    }>;
}

export default function CourseManagementPage() {
    const router = useRouter();

    // Giáo viên states
    const [myClasses, setMyClasses] = useState<ClassSection[]>([]);
    const [myGrades, setMyGrades] = useState<GradeManagement[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchClassText, setSearchClassText] = useState('');
    const [error, setError] = useState('');

    // Popup states
    const [studentsDialogVisible, setStudentsDialogVisible] = useState(false);
    const [overviewDialogVisible, setOverviewDialogVisible] = useState(false);
    const [gradesDialogVisible, setGradesDialogVisible] = useState(false);
    const [reportDialogVisible, setReportDialogVisible] = useState(false);

    // Data for popups
    const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [overview, setOverview] = useState<ClassOverview | null>(null);
    const [classGrades, setClassGrades] = useState<GradeManagement[]>([]);
    const [loadingPopup, setLoadingPopup] = useState(false);

    // Fetch data for teacher
    useEffect(() => {
        fetchMyClasses();
        fetchMyGrades();
    }, []);

    const fetchMyClasses = async () => {
        setLoading(true);
        try {
            // TODO: Get current teacher ID from auth context
            const teacherId = 'GV001'; // Placeholder
            const data = await classSectionService.getClassSectionsByTeacher(teacherId);
            setMyClasses(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách lớp học phần');
        } finally {
            setLoading(false);
        }
    };

    const fetchMyGrades = async () => {
        try {
            const data = await gradeService.getAllGrades();
            // TODO: Filter by current teacher's classes
            setMyGrades(data);
        } catch (err: unknown) {
            console.error('Không thể tải điểm:', err);
        }
    };

    // Popup handlers
    const handleViewStudents = async (cls: ClassSection) => {
        setSelectedClass(cls);
        setStudentsDialogVisible(true);
        setLoadingPopup(true);
        try {
            const data = await classSectionService.getStudents(cls.maLopHP);
            setStudents(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải danh sách sinh viên');
        } finally {
            setLoadingPopup(false);
        }
    };

    const handleViewOverview = async (cls: ClassSection) => {
        setSelectedClass(cls);
        setOverviewDialogVisible(true);
        setLoadingPopup(true);
        try {
            const data = await classSectionService.getOverview(cls.maLopHP);
            setOverview(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải tổng quan lớp');
        } finally {
            setLoadingPopup(false);
        }
    };

    const handleViewGrades = async (cls: ClassSection) => {
        setSelectedClass(cls);
        setGradesDialogVisible(true);
        setLoadingPopup(true);
        try {
            const data = await gradeService.getGradesByClass(cls.maLopHP);
            setClassGrades(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải điểm lớp');
        } finally {
            setLoadingPopup(false);
        }
    };

    const handleViewReport = async (cls: ClassSection) => {
        setSelectedClass(cls);
        setReportDialogVisible(true);
        setLoadingPopup(true);
        try {
            // TODO: Fetch report data
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải báo cáo');
        } finally {
            setLoadingPopup(false);
        }
    };

    const filteredMyClasses = myClasses.filter(cls =>
        (cls.maLopHP?.toLowerCase() || '').includes(searchClassText.toLowerCase()) ||
        (cls.tenLopHP?.toLowerCase() || '').includes(searchClassText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Lớp học phần của tôi</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}

            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={searchClassText}
                        onChange={e => setSearchClassText(e.target.value)}
                        placeholder="Tìm kiếm lớp học phần..."
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end w-full md:w-1/2">
                    <Button
                        label="Xem lịch giảng dạy"
                        icon="pi pi-calendar"
                        onClick={() => router.push('/courses/schedule')}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã lớp HP</th>
                                <th className="px-4 py-2 text-left">Tên lớp HP</th>
                                <th className="px-4 py-2 text-left">Học phần</th>
                                <th className="px-4 py-2 text-center">Số lượng SV</th>
                                <th className="px-4 py-2 text-left">Thời gian</th>
                                <th className="px-4 py-2 text-left">Phòng học</th>
                                <th className="px-4 py-2 text-center">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMyClasses.map(cls => (
                                <tr key={cls.maLopHP} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{cls.maLopHP}</td>
                                    <td className="px-4 py-2">{cls.tenLopHP}</td>
                                    <td className="px-4 py-2">{cls.maHocPhan}</td>
                                    <td className="px-4 py-2 text-center">{cls.soLuong}</td>
                                    <td className="px-4 py-2">
                                        {new Date(cls.thoiGianBatDau).toLocaleDateString()} - {new Date(cls.thoiGianKetThuc).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-2">{cls.phongHoc}</td>
                                    <td className="px-4 py-2 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs ${cls.trangThai ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {cls.trangThai ? 'Hoạt động' : 'Ngừng'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Button
                                            icon="pi pi-users"
                                            className="p-button-rounded p-button-info text-lg"
                                            tooltip="Xem sinh viên"
                                            onClick={() => handleViewStudents(cls)}
                                        />
                                        <Button
                                            icon="pi pi-chart-bar"
                                            className="p-button-rounded p-button-success text-lg"
                                            tooltip="Tổng quan lớp"
                                            onClick={() => handleViewOverview(cls)}
                                        />
                                        <Button
                                            icon="pi pi-star"
                                            className="p-button-rounded p-button-warning text-lg"
                                            tooltip="Quản lý điểm"
                                            onClick={() => handleViewGrades(cls)}
                                        />
                                        <Button
                                            icon="pi pi-file-pdf"
                                            className="p-button-rounded p-button-secondary text-lg"
                                            tooltip="Báo cáo"
                                            onClick={() => handleViewReport(cls)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Thống kê nhanh */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-600 text-sm font-medium mb-1">Tổng số lớp</p>
                            <p className="text-2xl font-bold text-blue-700">{myClasses.length}</p>
                        </div>
                        <div className="bg-blue-100 rounded-full p-3">
                            <i className="pi pi-users text-xl text-blue-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-medium mb-1">Lớp đang hoạt động</p>
                            <p className="text-2xl font-bold text-green-700">{myClasses.filter(cls => cls.trangThai).length}</p>
                        </div>
                        <div className="bg-green-100 rounded-full p-3">
                            <i className="pi pi-check-circle text-xl text-green-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-600 text-sm font-medium mb-1">Tổng sinh viên</p>
                            <p className="text-2xl font-bold text-yellow-700">{myClasses.reduce((sum, cls) => sum + cls.soLuong, 0)}</p>
                        </div>
                        <div className="bg-yellow-100 rounded-full p-3">
                            <i className="pi pi-user text-xl text-yellow-600"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-600 text-sm font-medium mb-1">Điểm chưa nhập</p>
                            <p className="text-2xl font-bold text-purple-700">{myGrades.filter(grade => grade.trangThai !== 'Đã nhập').length}</p>
                        </div>
                        <div className="bg-purple-100 rounded-full p-3">
                            <i className="pi pi-exclamation-triangle text-xl text-purple-600"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popup 1: Danh sách sinh viên */}
            <Dialog
                visible={studentsDialogVisible}
                onHide={() => setStudentsDialogVisible(false)}
                header={`Danh sách sinh viên - ${selectedClass?.tenLopHP}`}
                modal
                className="p-fluid w-full max-w-4xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Đóng"
                            icon="pi pi-times"
                            onClick={() => setStudentsDialogVisible(false)}
                            className="p-button-secondary"
                        />
                    </div>
                }
            >
                {loadingPopup ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải danh sách sinh viên...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã SV</th>
                                    <th className="px-4 py-2 text-left">Tên sinh viên</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Số điện thoại</th>
                                    <th className="px-4 py-2 text-left">Địa chỉ</th>
                                    <th className="px-4 py-2 text-left">Giới tính</th>
                                    <th className="px-4 py-2 text-left">Khoa</th>
                                    <th className="px-4 py-2 text-left">Lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{student.maSinhVien}</td>
                                        <td className="px-4 py-2">{student.hoTenSinhVien}</td>
                                        <td className="px-4 py-2">{student.email}</td>
                                        <td className="px-4 py-2">{student.soDienThoai}</td>
                                        <td className="px-4 py-2">{student.diaChi}</td>
                                        <td className="px-4 py-2">{student.gioiTinh ? 'Nam' : 'Nữ'}</td>
                                        <td className="px-4 py-2">{student.maKhoa}</td>
                                        <td className="px-4 py-2">{student.tenLop}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Không có sinh viên nào</div>
                        )}
                    </div>
                )}
            </Dialog>

            {/* Popup 2: Tổng quan lớp */}
            <Dialog
                visible={overviewDialogVisible}
                onHide={() => setOverviewDialogVisible(false)}
                header={`Tổng quan lớp - ${selectedClass?.tenLopHP}`}
                modal
                className="p-fluid w-full max-w-4xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Đóng"
                            icon="pi pi-times"
                            onClick={() => setOverviewDialogVisible(false)}
                            className="p-button-secondary"
                        />
                    </div>
                }
            >
                {loadingPopup ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải tổng quan lớp...</div>
                ) : overview ? (
                    <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Thông tin lớp học phần</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="font-medium">Mã lớp:</span> {overview.maLopHP}
                                </div>
                                <div>
                                    <span className="font-medium">Tên lớp:</span> {overview.tenLopHP}
                                </div>
                                <div>
                                    <span className="font-medium">Học phần:</span> {overview.tenHocPhan}
                                </div>
                                <div>
                                    <span className="font-medium">Số tín chỉ:</span> {overview.soTinChi}
                                </div>
                            </div>
                        </div>

                        {/* Thống kê tổng quan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-blue-600">Tổng số sinh viên</div>
                                <div className="text-2xl font-bold text-blue-700">{overview.tongSoSinhVien}</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-green-600">Điểm trung bình lớp</div>
                                <div className="text-2xl font-bold text-green-700">{overview.diemTrungBinhLop}</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-yellow-600">Số lượng đạt</div>
                                <div className="text-2xl font-bold text-yellow-700">{overview.soSinhVienDat}</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-red-600">Số lượng không đạt</div>
                                <div className="text-2xl font-bold text-red-700">{overview.soSinhVienKhongDat}</div>
                            </div>
                        </div>

                        {/* Thống kê chi tiết */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-purple-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-purple-600">Sinh viên có điểm</div>
                                <div className="text-2xl font-bold text-purple-700">{overview.soSinhVienCoDiem}</div>
                            </div>
                            <div className="bg-indigo-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-indigo-600">Điểm cao nhất</div>
                                <div className="text-2xl font-bold text-indigo-700">{overview.diemCaoNhat}</div>
                            </div>
                            <div className="bg-pink-50 p-4 rounded-lg shadow">
                                <div className="font-semibold text-pink-600">Điểm thấp nhất</div>
                                <div className="text-2xl font-bold text-pink-700">{overview.diemThapNhat}</div>
                            </div>
                        </div>

                        {/* Bảng thống kê điểm */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Thống kê phân bố điểm</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full border rounded-lg overflow-hidden">
                                    <thead className="bg-blue-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Khoảng điểm</th>
                                            <th className="px-4 py-2 text-center">Số lượng</th>
                                            <th className="px-4 py-2 text-center">Tỷ lệ (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {overview.thongKeDiem.map((item, index) => (
                                            <tr key={index} className="border-b hover:bg-blue-50">
                                                <td className="px-4 py-2 font-medium">{item.khoangDiem}</td>
                                                <td className="px-4 py-2 text-center">{item.soLuong}</td>
                                                <td className="px-4 py-2 text-center">{item.tyLe.toFixed(1)}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Không có dữ liệu tổng quan</div>
                )}
            </Dialog>

            {/* Popup 3: Quản lý điểm */}
            <Dialog
                visible={gradesDialogVisible}
                onHide={() => setGradesDialogVisible(false)}
                header={`Quản lý điểm - ${selectedClass?.tenLopHP}`}
                modal
                className="p-fluid w-full max-w-6xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Lưu thay đổi"
                            icon="pi pi-save"
                            className="p-button-success"
                        />
                        <Button
                            label="Đóng"
                            icon="pi pi-times"
                            onClick={() => setGradesDialogVisible(false)}
                            className="p-button-secondary"
                        />
                    </div>
                }
            >
                {loadingPopup ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải điểm lớp...</div>
                ) : (
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 text-left">Mã SV</th>
                                    <th className="px-4 py-2 text-left">Tên sinh viên</th>
                                    <th className="px-4 py-2 text-center">Điểm QT</th>
                                    <th className="px-4 py-2 text-center">Điểm GK</th>
                                    <th className="px-4 py-2 text-center">Điểm CK</th>
                                    <th className="px-4 py-2 text-center">Điểm TB</th>
                                    <th className="px-4 py-2 text-center">Điểm chữ</th>
                                    <th className="px-4 py-2 text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classGrades.map((grade, index) => (
                                    <tr key={index} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{grade.maSinhVien}</td>
                                        <td className="px-4 py-2">{grade.tenSinhVien}</td>
                                        <td className="px-4 py-2 text-center">{grade.diemQuaTrinh}</td>
                                        <td className="px-4 py-2 text-center">{grade.diemGiuaKy}</td>
                                        <td className="px-4 py-2 text-center">{grade.diemCuoiKy}</td>
                                        <td className="px-4 py-2 text-center font-semibold">{grade.diemTrungBinh}</td>
                                        <td className="px-4 py-2 text-center">{grade.diemChu}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs ${grade.trangThai === 'Đã nhập'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {grade.trangThai}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {classGrades.length === 0 && (
                            <div className="text-center py-8 text-gray-500">Không có dữ liệu điểm</div>
                        )}
                    </div>
                )}
            </Dialog>

            {/* Popup 4: Báo cáo */}
            <Dialog
                visible={reportDialogVisible}
                onHide={() => setReportDialogVisible(false)}
                header={`Báo cáo lớp - ${selectedClass?.tenLopHP}`}
                modal
                className="p-fluid w-full max-w-4xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Xuất PDF"
                            icon="pi pi-file-pdf"
                            className="p-button-danger"
                        />
                        <Button
                            label="Đóng"
                            icon="pi pi-times"
                            onClick={() => setReportDialogVisible(false)}
                            className="p-button-secondary"
                        />
                    </div>
                }
            >
                {loadingPopup ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải báo cáo...</div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Thông tin lớp học phần</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium">Mã lớp:</span> {selectedClass?.maLopHP}
                                </div>
                                <div>
                                    <span className="font-medium">Tên lớp:</span> {selectedClass?.tenLopHP}
                                </div>
                                <div>
                                    <span className="font-medium">Học phần:</span> {selectedClass?.maHocPhan}
                                </div>
                                <div>
                                    <span className="font-medium">Số lượng SV:</span> {selectedClass?.soLuong}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Thống kê điểm</h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">85%</div>
                                    <div className="text-sm text-gray-600">Tỷ lệ đạt</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">7.8</div>
                                    <div className="text-sm text-gray-600">Điểm TB</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-yellow-600">15</div>
                                    <div className="text-sm text-gray-600">SV xuất sắc</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">3</div>
                                    <div className="text-sm text-gray-600">SV cần hỗ trợ</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-3">Đề xuất cải thiện</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                <li>Tăng cường bài tập thực hành cho sinh viên yếu</li>
                                <li>Tổ chức thêm buổi ôn tập trước kỳ thi</li>
                                <li>Cải thiện phương pháp giảng dạy</li>
                            </ul>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
} 