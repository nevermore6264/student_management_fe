/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import classSectionService, { ClassSection } from '../services/classSectionService';
import gradeService, { GradeManagement, DiemRequest } from '../services/gradeService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

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

interface StudentGrade {
    maDiem: string | null;
    maSinhVien: string;
    hoTenSinhVien: string;
    maLopHP: string;
    tenLopHP: string | null;
    tenMon: string | null;
    soTinChi: number;
    diem: number;
    xepLoai: string | null;
    hocKy: number | null;
    namHoc: string | null;
    diemChuyenCan: number | null;
    diemGiuaKy: number | null;
    diemCuoiKy: number | null;
    diemTongKet: number | null;
    ghiChu: string | null;
}

export default function CourseManagementPage() {
    const router = useRouter();

    // Giáo viên states
    const [myClasses, setMyClasses] = useState<ClassSection[]>([]);
    const [myGrades, setMyGrades] = useState<GradeManagement[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchClassText, setSearchClassText] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Popup states
    const [studentsDialogVisible, setStudentsDialogVisible] = useState(false);
    const [overviewDialogVisible, setOverviewDialogVisible] = useState(false);
    const [gradesDialogVisible, setGradesDialogVisible] = useState(false);
    const [reportDialogVisible, setReportDialogVisible] = useState(false);

    // Data for popups
    const [selectedClass, setSelectedClass] = useState<ClassSection | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [overview, setOverview] = useState<ClassOverview | null>(null);
    const [classGrades, setClassGrades] = useState<StudentGrade[]>([]);
    const [loadingPopup, setLoadingPopup] = useState(false);
    const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
    const [editGradeDialogVisible, setEditGradeDialogVisible] = useState(false);

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
            const response = await gradeService.getGradesByClass(cls.maLopHP);
            // The API returns data that matches StudentGrade interface directly
            setClassGrades(response as unknown as StudentGrade[]);
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

    const handleEditGrade = (grade: StudentGrade) => {
        setEditingGrade(grade);
        setEditGradeDialogVisible(true);
    };

    const handleSaveGrade = async () => {
        if (!editingGrade) return;

        setLoadingPopup(true);
        try {
            // Tạo request body theo DiemRequest (không bao gồm xepLoai)
            const diemRequest: DiemRequest = {
                maSinhVien: editingGrade.maSinhVien,
                maLopHP: editingGrade.maLopHP,
                diemChuyenCan: editingGrade.diemChuyenCan,
                diemGiuaKy: editingGrade.diemGiuaKy,
                diemCuoiKy: editingGrade.diemCuoiKy,
                diemTongKet: editingGrade.diemTongKet,
                ghiChu: editingGrade.ghiChu
            };

            let response;

            // Thử tạo mới trước, nếu lỗi "đã tồn tại" thì cập nhật
            try {
                response = await gradeService.createGrade(diemRequest);
            } catch (createError: unknown) {
                const errorMessage = createError instanceof Error ? createError.message : '';
                // Nếu lỗi "đã tồn tại" thì cập nhật
                if (errorMessage.includes('đã tồn tại')) {
                    console.log("Oke");
                    response = await gradeService.updateGrade(diemRequest);
                } else {
                    throw createError;
                }
            }

            // Update local state với response từ server
            const updatedGrade = {
                ...editingGrade,
                maDiem: response.id,
                diemChuyenCan: response.diemChuyenCan,
                diemGiuaKy: response.diemGiuaKy,
                diemCuoiKy: response.diemCuoiKy,
                diemTongKet: response.diemTongKet,
                ghiChu: response.ghiChu
            };

            setClassGrades(classGrades.map(grade =>
                grade.maSinhVien === editingGrade.maSinhVien ? updatedGrade : grade
            ));

            setEditGradeDialogVisible(false);
            setEditingGrade(null);
            setSuccess('Cập nhật điểm thành công');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể cập nhật điểm');
        } finally {
            setLoadingPopup(false);
        }
    };

    // Calculate total grade and classification
    const calculateGrade = (diemChuyenCan: number | null, diemGiuaKy: number | null, diemCuoiKy: number | null) => {
        const cc = diemChuyenCan || 0;
        const gk = diemGiuaKy || 0;
        const ck = diemCuoiKy || 0;

        // Tính điểm tổng kết: 20% chuyên cần + 30% giữa kỳ + 50% cuối kỳ
        const diemTongKet = (cc * 0.2) + (gk * 0.3) + (ck * 0.5);

        // Tính xếp loại (chỉ hiển thị trên UI, không gửi lên server)
        let xepLoai = '';
        if (diemTongKet >= 8.5) xepLoai = 'A (Xuất sắc)';
        else if (diemTongKet >= 7.0) xepLoai = 'B (Tốt)';
        else if (diemTongKet >= 5.5) xepLoai = 'C (Trung bình)';
        else if (diemTongKet >= 4.0) xepLoai = 'D (Yếu)';
        else xepLoai = 'F (Kém)';

        return { diemTongKet: Math.round(diemTongKet * 10) / 10, xepLoai };
    };

    // Function tính xếp loại từ điểm tổng kết
    const getXepLoai = (diemTongKet: number | null): string => {
        if (diemTongKet === null || diemTongKet === undefined) return '-';

        if (diemTongKet >= 8.5) return 'A (Xuất sắc)';
        else if (diemTongKet >= 7.0) return 'B (Tốt)';
        else if (diemTongKet >= 5.5) return 'C (Trung bình)';
        else if (diemTongKet >= 4.0) return 'D (Yếu)';
        else return 'F (Kém)';
    };

    // Update grade calculation when any component grade changes
    const updateGradeCalculation = (grade: StudentGrade, field: string, value: number | null) => {
        const updatedGrade = { ...grade, [field]: value };

        // Recalculate total grade and classification
        const { diemTongKet, xepLoai } = calculateGrade(
            updatedGrade.diemChuyenCan,
            updatedGrade.diemGiuaKy,
            updatedGrade.diemCuoiKy
        );

        return {
            ...updatedGrade,
            diemTongKet,
            xepLoai
        };
    };

    // Chart data functions
    const getPieChartData = () => {
        if (!overview) return null;

        return {
            labels: ['Đạt', 'Không đạt'],
            datasets: [
                {
                    data: [overview.soSinhVienDat, overview.soSinhVienKhongDat],
                    backgroundColor: ['#10B981', '#EF4444'],
                    borderColor: ['#059669', '#DC2626'],
                    borderWidth: 2,
                },
            ],
        };
    };

    const getBarChartData = () => {
        if (!overview) return null;

        return {
            labels: overview.thongKeDiem.map(item => item.khoangDiem),
            datasets: [
                {
                    label: 'Số lượng sinh viên',
                    data: overview.thongKeDiem.map(item => item.soLuong),
                    backgroundColor: [
                        '#EF4444', // 0-2: Đỏ
                        '#F97316', // 2-4: Cam
                        '#EAB308', // 4-5: Vàng
                        '#F59E0B', // 5-6.5: Vàng đậm
                        '#10B981', // 6.5-8: Xanh lá
                        '#3B82F6', // 8-9: Xanh dương
                        '#8B5CF6', // 9-10: Tím
                    ],
                    borderColor: [
                        '#DC2626',
                        '#EA580C',
                        '#CA8A04',
                        '#D97706',
                        '#059669',
                        '#2563EB',
                        '#7C3AED',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const barChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Phân bố điểm sinh viên',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'Tỷ lệ đạt/không đạt',
            },
        },
    };

    const filteredMyClasses = myClasses.filter(cls =>
        (cls.maLopHP?.toLowerCase() || '').includes(searchClassText.toLowerCase()) ||
        (cls.tenLopHP?.toLowerCase() || '').includes(searchClassText.toLowerCase())
    );

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Lớp học phần của tôi</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}

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
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Tổng số lớp</p>
                            <p className="text-2xl font-bold">{myClasses.length}</p>
                        </div>
                        <div className="bg-blue-400 rounded-full p-3">
                            <i className="pi pi-users text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium mb-1">Lớp đang hoạt động</p>
                            <p className="text-2xl font-bold">{myClasses.filter(cls => cls.trangThai).length}</p>
                        </div>
                        <div className="bg-green-400 rounded-full p-3">
                            <i className="pi pi-check-circle text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium mb-1">Tổng sinh viên</p>
                            <p className="text-2xl font-bold">{myClasses.reduce((sum, cls) => sum + cls.soLuong, 0)}</p>
                        </div>
                        <div className="bg-yellow-400 rounded-full p-3">
                            <i className="pi pi-user text-xl"></i>
                        </div>
                    </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium mb-1">Điểm chưa nhập</p>
                            <p className="text-2xl font-bold">{myGrades.filter(grade => grade.trangThai !== 'Đã nhập').length}</p>
                        </div>
                        <div className="bg-purple-400 rounded-full p-3">
                            <i className="pi pi-exclamation-triangle text-xl"></i>
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
                className="p-fluid w-full max-w-6xl"
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
                            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Mã SV</th>
                                    <th className="px-4 py-3 text-left">Tên sinh viên</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Số điện thoại</th>
                                    <th className="px-4 py-3 text-left">Địa chỉ</th>
                                    <th className="px-4 py-3 text-left">Giới tính</th>
                                    <th className="px-4 py-3 text-left">Khoa</th>
                                    <th className="px-4 py-3 text-left">Lớp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-3 font-mono bg-gray-50">{student.maSinhVien}</td>
                                        <td className="px-4 py-3 font-medium">{student.hoTenSinhVien}</td>
                                        <td className="px-4 py-3">{student.email}</td>
                                        <td className="px-4 py-3">{student.soDienThoai}</td>
                                        <td className="px-4 py-3">{student.diaChi}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${student.gioiTinh ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                                                {student.gioiTinh ? 'Nam' : 'Nữ'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">{student.maKhoa}</td>
                                        <td className="px-4 py-3">{student.tenLop}</td>
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
                className="p-fluid w-full max-w-6xl"
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
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                                Thông tin lớp học phần
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Mã lớp</div>
                                    <div className="font-semibold text-gray-800">{overview.maLopHP}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Tên lớp</div>
                                    <div className="font-semibold text-gray-800">{overview.tenLopHP}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Học phần</div>
                                    <div className="font-semibold text-gray-800">{overview.tenHocPhan}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Số tín chỉ</div>
                                    <div className="font-semibold text-gray-800">{overview.soTinChi}</div>
                                </div>
                            </div>
                        </div>

                        {/* Thống kê tổng quan */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-blue-100 text-sm font-medium mb-1">Tổng số sinh viên</div>
                                        <div className="text-3xl font-bold">{overview.tongSoSinhVien}</div>
                                    </div>
                                    <div className="bg-blue-400 rounded-full p-3">
                                        <i className="pi pi-users text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-green-100 text-sm font-medium mb-1">Điểm trung bình</div>
                                        <div className="text-3xl font-bold">{overview.diemTrungBinhLop}</div>
                                    </div>
                                    <div className="bg-green-400 rounded-full p-3">
                                        <i className="pi pi-chart-line text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-yellow-100 text-sm font-medium mb-1">Số lượng đạt</div>
                                        <div className="text-3xl font-bold">{overview.soSinhVienDat}</div>
                                    </div>
                                    <div className="bg-yellow-400 rounded-full p-3">
                                        <i className="pi pi-check-circle text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-red-100 text-sm font-medium mb-1">Không đạt</div>
                                        <div className="text-3xl font-bold">{overview.soSinhVienKhongDat}</div>
                                    </div>
                                    <div className="bg-red-400 rounded-full p-3">
                                        <i className="pi pi-times-circle text-2xl"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Tỷ lệ đạt/không đạt</h3>
                                {getPieChartData() && (
                                    <div className="h-64">
                                        <Pie data={getPieChartData()!} options={pieChartOptions} />
                                    </div>
                                )}
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Phân bố điểm</h3>
                                {getBarChartData() && (
                                    <div className="h-64">
                                        <Bar data={getBarChartData()!} options={barChartOptions} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Thống kê chi tiết */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-purple-100 text-sm font-medium mb-1">Sinh viên có điểm</div>
                                        <div className="text-2xl font-bold">{overview.soSinhVienCoDiem}</div>
                                    </div>
                                    <div className="bg-purple-400 rounded-full p-3">
                                        <i className="pi pi-star text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-indigo-100 text-sm font-medium mb-1">Điểm cao nhất</div>
                                        <div className="text-2xl font-bold">{overview.diemCaoNhat}</div>
                                    </div>
                                    <div className="bg-indigo-400 rounded-full p-3">
                                        <i className="pi pi-arrow-up text-xl"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl shadow-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-pink-100 text-sm font-medium mb-1">Điểm thấp nhất</div>
                                        <div className="text-2xl font-bold">{overview.diemThapNhat}</div>
                                    </div>
                                    <div className="bg-pink-400 rounded-full p-3">
                                        <i className="pi pi-arrow-down text-xl"></i>
                                    </div>
                                </div>
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
                className="p-fluid w-full max-w-7xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
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
                            <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left">Mã SV</th>
                                    <th className="px-4 py-3 text-left">Tên sinh viên</th>
                                    <th className="px-4 py-3 text-center">Điểm chuyên cần</th>
                                    <th className="px-4 py-3 text-center">Điểm giữa kỳ</th>
                                    <th className="px-4 py-3 text-center">Điểm cuối kỳ</th>
                                    <th className="px-4 py-3 text-center">Điểm tổng kết</th>
                                    <th className="px-4 py-3 text-center">Xếp loại</th>
                                    <th className="px-4 py-3 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classGrades.map((grade, index) => (
                                    <tr key={index} className="border-b hover:bg-yellow-50 transition-colors">
                                        <td className="px-4 py-3 font-mono bg-gray-50">{grade.maSinhVien}</td>
                                        <td className="px-4 py-3 font-medium">{grade?.hoTenSinhVien}</td>
                                        <td className="px-4 py-3 text-center">
                                            {grade.diemChuyenCan !== null ? grade.diemChuyenCan : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {grade.diemGiuaKy !== null ? grade.diemGiuaKy : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {grade.diemCuoiKy !== null ? grade.diemCuoiKy : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center font-semibold text-lg">
                                            {grade.diemTongKet !== null ? grade.diemTongKet : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {grade.xepLoai ? (
                                                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 font-medium">
                                                    {grade.xepLoai}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 font-medium">
                                                    {getXepLoai(grade.diemTongKet)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Button
                                                icon="pi pi-pencil"
                                                className="p-button-rounded p-button-warning text-sm"
                                                tooltip="Sửa điểm"
                                                onClick={() => handleEditGrade(grade)}
                                            />
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

            {/* Popup Edit Grade */}
            <Dialog
                visible={editGradeDialogVisible}
                onHide={() => setEditGradeDialogVisible(false)}
                header={`Sửa điểm - ${editingGrade?.hoTenSinhVien}`}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <Button
                            label="Lưu"
                            icon="pi pi-save"
                            onClick={handleSaveGrade}
                            className="p-button-success"
                            loading={loadingPopup}
                        />
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={() => setEditGradeDialogVisible(false)}
                            className="p-button-secondary"
                            disabled={loadingPopup}
                        />
                    </div>
                }
            >
                {editingGrade && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã sinh viên</label>
                                    <div className="bg-gray-100 px-3 py-2 rounded-md font-mono">{editingGrade.maSinhVien}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sinh viên</label>
                                    <div className="bg-gray-100 px-3 py-2 rounded-md">{editingGrade.hoTenSinhVien}</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm chuyên cần</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={editingGrade.diemChuyenCan || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : null;
                                        if (value !== null && (value < 0 || value > 10)) return; // Validate range
                                        setEditingGrade(updateGradeCalculation(editingGrade, 'diemChuyenCan', value));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập điểm (0-10)"
                                />
                                <div className="text-xs text-gray-500 mt-1">Hệ số: 20% (Tối đa: 10)</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm giữa kỳ</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={editingGrade.diemGiuaKy || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : null;
                                        if (value !== null && (value < 0 || value > 10)) return; // Validate range
                                        setEditingGrade(updateGradeCalculation(editingGrade, 'diemGiuaKy', value));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập điểm (0-10)"
                                />
                                <div className="text-xs text-gray-500 mt-1">Hệ số: 30% (Tối đa: 10)</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm cuối kỳ</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={editingGrade.diemCuoiKy || ''}
                                    onChange={(e) => {
                                        const value = e.target.value ? parseFloat(e.target.value) : null;
                                        if (value !== null && (value < 0 || value > 10)) return; // Validate range
                                        setEditingGrade(updateGradeCalculation(editingGrade, 'diemCuoiKy', value));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập điểm (0-10)"
                                />
                                <div className="text-xs text-gray-500 mt-1">Hệ số: 50% (Tối đa: 10)</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Điểm tổng kết</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={editingGrade.diemTongKet || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    placeholder="Tự động tính"
                                    readOnly
                                />
                                <div className="text-xs text-gray-500 mt-1">Tự động tính từ 3 điểm thành phần</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Xếp loại</label>
                                <input
                                    type="text"
                                    value={getXepLoai(editingGrade.diemTongKet)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                    placeholder="Tự động tính"
                                    readOnly
                                />
                                <div className="text-xs text-gray-500 mt-1">Tự động tính từ điểm tổng kết</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                            <textarea
                                value={editingGrade.ghiChu || ''}
                                onChange={(e) => setEditingGrade({
                                    ...editingGrade,
                                    ghiChu: e.target.value || null
                                })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập ghi chú (nếu có)"
                            />
                        </div>
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
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl shadow-sm border">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                                Thông tin lớp học phần
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Mã lớp</div>
                                    <div className="font-semibold text-gray-800">{selectedClass?.maLopHP}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Tên lớp</div>
                                    <div className="font-semibold text-gray-800">{selectedClass?.tenLopHP}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Học phần</div>
                                    <div className="font-semibold text-gray-800">{selectedClass?.maHocPhan}</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-sm text-gray-600">Số lượng SV</div>
                                    <div className="font-semibold text-gray-800">{selectedClass?.soLuong}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-sm border">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                <i className="pi pi-chart-bar mr-2 text-blue-500"></i>
                                Thống kê điểm
                            </h3>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <div className="text-2xl font-bold text-blue-600">85%</div>
                                    <div className="text-sm text-gray-600">Tỷ lệ đạt</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <div className="text-2xl font-bold text-green-600">7.8</div>
                                    <div className="text-sm text-gray-600">Điểm TB</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <div className="text-2xl font-bold text-yellow-600">15</div>
                                    <div className="text-sm text-gray-600">SV xuất sắc</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                    <div className="text-2xl font-bold text-red-600">3</div>
                                    <div className="text-sm text-gray-600">SV cần hỗ trợ</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-sm border">
                            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                                <i className="pi pi-lightbulb mr-2 text-green-500"></i>
                                Đề xuất cải thiện
                            </h3>
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