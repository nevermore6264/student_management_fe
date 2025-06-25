/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Dropdown } from 'primereact/dropdown';
import gradeService, { SemesterSummary, Grade, GradeManagement } from '../services/gradeService';
import classSectionService from '../services/classSectionService';

export default function GradeManagementPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [semesterSummaries, setSemesterSummaries] = useState<SemesterSummary[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [gradeManagement, setGradeManagement] = useState<GradeManagement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [selectedGradeManagement, setSelectedGradeManagement] = useState<GradeManagement | null>(null);
    const [gradeDetailDialogVisible, setGradeDetailDialogVisible] = useState(false);
    const [gradeEditDialogVisible, setGradeEditDialogVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchGradeTerm, setSearchGradeTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [classes, setClasses] = useState<{ maLopHP: string; tenLopHP: string }[]>([]);
    const [students, setStudents] = useState<{ maSinhVien: string; tenSinhVien: string }[]>([]);
    const [formData, setFormData] = useState<Partial<GradeManagement>>({
        maSinhVien: '',
        tenSinhVien: '',
        maHocPhan: '',
        tenHocPhan: '',
        maLopHP: '',
        diemQuaTrinh: 0,
        diemGiuaKy: 0,
        diemCuoiKy: 0,
        diemTrungBinh: 0,
        diemChu: '',
        trangThai: 'Đã nhập'
    });
    const [isEdit, setIsEdit] = useState(false);

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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải tổng quan điểm');
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
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải chi tiết điểm');
            setGrades([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGradeManagement = async () => {
        setLoading(true); setError('');
        try {
            const data = await gradeService.getAllGrades();
            setGradeManagement(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu điểm');
            setGradeManagement([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const data = await classSectionService.getAllClassSections();
            setClasses(data.map(cls => ({ maLopHP: cls.maLopHP, tenLopHP: cls.tenLopHP })));
        } catch (err: unknown) {
            console.error('Không thể tải danh sách lớp học phần:', err);
        }
    };

    useEffect(() => {
        if (activeTab === 0) fetchOverview();
        else if (activeTab === 1) fetchDetails();
        else if (activeTab === 2) {
            fetchGradeManagement();
            fetchClasses();
        }
    }, [activeTab]);

    const filteredGrades = grades.filter(grade =>
        (grade.tenHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (grade.maHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredGradeManagement = gradeManagement.filter(grade => {
        const matchesSearch =
            (grade.tenSinhVien?.toLowerCase() || '').includes(searchGradeTerm.toLowerCase()) ||
            (grade.maSinhVien?.toLowerCase() || '').includes(searchGradeTerm.toLowerCase()) ||
            (grade.tenHocPhan?.toLowerCase() || '').includes(searchGradeTerm.toLowerCase());
        const matchesClass = selectedClass ? grade.maLopHP === selectedClass : true;
        const matchesStudent = selectedStudent ? grade.maSinhVien === selectedStudent : true;
        return matchesSearch && matchesClass && matchesStudent;
    });

    const calculateOverallStats = () => {
        if (grades.length === 0) return { totalCredits: 0, avgGrade: 0, totalSubjects: 0 };

        const totalCredits = grades.reduce((sum, grade) => sum + (grade.soTinChi || 0), 0);
        const avgGrade = grades.reduce((sum, grade) => sum + (grade.diemTrungBinh || 0), 0) / grades.length;
        const totalSubjects = grades.length;

        return { totalCredits, avgGrade: parseFloat(avgGrade.toFixed(2)), totalSubjects };
    };

    const handleEditGrade = (grade: GradeManagement) => {
        setFormData(grade);
        setIsEdit(true);
        setGradeEditDialogVisible(true);
    };

    const handleSaveGrade = async () => {
        setLoading(true);
        try {
            if (isEdit && selectedGradeManagement) {
                await gradeService.updateGrade(selectedGradeManagement.id, formData);
                setSuccess('Cập nhật điểm thành công');
            } else {
                await gradeService.createGrade(formData as Omit<GradeManagement, 'id'>);
                setSuccess('Thêm điểm thành công');
            }
            setTimeout(() => setSuccess(''), 2500);
            setGradeEditDialogVisible(false);
            fetchGradeManagement();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Lưu điểm thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGrade = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa điểm này?')) return;
        setLoading(true);
        try {
            await gradeService.deleteGrade(id);
            setSuccess('Xóa điểm thành công');
            setTimeout(() => setSuccess(''), 2500);
            fetchGradeManagement();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Xóa điểm thất bại');
            setTimeout(() => setError(''), 2500);
        } finally {
            setLoading(false);
        }
    };

    const stats = calculateOverallStats();

    const actionTemplate = (rowData: GradeManagement) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-warning text-sm"
                onClick={() => handleEditGrade(rowData)}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-danger text-sm"
                onClick={() => handleDeleteGrade(rowData.id)}
            />
        </div>
    );

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Quản lý điểm</h1>

            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}

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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredGrades.map((grade, index) => (
                                        <tr key={index} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono">{grade.maHocPhan}</td>
                                            <td className="px-4 py-2">{grade.tenHocPhan}</td>
                                            <td className="px-4 py-2 text-center">{grade.soTinChi}</td>
                                            <td className="px-4 py-2 text-center">{grade.hocKy}</td>
                                            <td className="px-4 py-2 text-center">{grade.namHoc}</td>
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
                        </div>
                    )}
                </TabPanel>

                <TabPanel header="Quản lý điểm (GV)">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                        <div className="flex gap-2 w-full md:w-2/3">
                            <span className="p-input-icon-left w-full">
                                <i className="pi pi-search" />
                                <InputText
                                    placeholder="Tìm kiếm sinh viên, học phần..."
                                    value={searchGradeTerm}
                                    onChange={(e) => setSearchGradeTerm(e.target.value)}
                                    className="w-full"
                                />
                            </span>
                        </div>
                        <div className="flex gap-2 w-full md:w-1/3">
                            <Dropdown
                                value={selectedClass}
                                options={[{ maLopHP: '', tenLopHP: 'Tất cả lớp' }, ...classes]}
                                onChange={(e) => setSelectedClass(e.value)}
                                optionLabel="tenLopHP"
                                optionValue="maLopHP"
                                placeholder="Lọc theo lớp"
                                className="w-full"
                            />
                        </div>
                        <Button
                            label="Thêm điểm"
                            icon="pi pi-plus"
                            onClick={() => {
                                setFormData({
                                    maSinhVien: '',
                                    tenSinhVien: '',
                                    maHocPhan: '',
                                    tenHocPhan: '',
                                    maLopHP: '',
                                    diemQuaTrinh: 0,
                                    diemGiuaKy: 0,
                                    diemCuoiKy: 0,
                                    diemTrungBinh: 0,
                                    diemChu: '',
                                    trangThai: 'Đã nhập'
                                });
                                setIsEdit(false);
                                setGradeEditDialogVisible(true);
                            }}
                        />
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
                                        <th className="px-4 py-2 text-left">Mã SV</th>
                                        <th className="px-4 py-2 text-left">Tên sinh viên</th>
                                        <th className="px-4 py-2 text-left">Mã HP</th>
                                        <th className="px-4 py-2 text-left">Tên học phần</th>
                                        <th className="px-4 py-2 text-left">Lớp HP</th>
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
                                    {filteredGradeManagement.map((grade) => (
                                        <tr key={grade.id} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono">{grade.maSinhVien}</td>
                                            <td className="px-4 py-2">{grade.tenSinhVien}</td>
                                            <td className="px-4 py-2 font-mono">{grade.maHocPhan}</td>
                                            <td className="px-4 py-2">{grade.tenHocPhan}</td>
                                            <td className="px-4 py-2">{grade.maLopHP}</td>
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
                                            <td className="px-4 py-2 text-center">
                                                {actionTemplate(grade)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </TabPanel>
            </TabView>

            {/* Grade Edit Dialog */}
            <Dialog
                visible={gradeEditDialogVisible}
                onHide={() => setGradeEditDialogVisible(false)}
                header={isEdit ? 'Sửa điểm' : 'Thêm điểm mới'}
                modal
                className="p-fluid w-full max-w-2xl"
                footer={
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300"
                            onClick={() => setGradeEditDialogVisible(false)}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700"
                            onClick={handleSaveGrade}
                            disabled={loading}
                        >
                            Lưu
                        </button>
                    </div>
                }
            >
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maSinhVien" className="text-gray-700 font-medium">Mã sinh viên</label>
                        <input
                            id="maSinhVien"
                            value={formData.maSinhVien}
                            onChange={e => setFormData({ ...formData, maSinhVien: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenSinhVien" className="text-gray-700 font-medium">Tên sinh viên</label>
                        <input
                            id="tenSinhVien"
                            value={formData.tenSinhVien}
                            onChange={e => setFormData({ ...formData, tenSinhVien: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maHocPhan" className="text-gray-700 font-medium">Mã học phần</label>
                        <input
                            id="maHocPhan"
                            value={formData.maHocPhan}
                            onChange={e => setFormData({ ...formData, maHocPhan: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="tenHocPhan" className="text-gray-700 font-medium">Tên học phần</label>
                        <input
                            id="tenHocPhan"
                            value={formData.tenHocPhan}
                            onChange={e => setFormData({ ...formData, tenHocPhan: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="maLopHP" className="text-gray-700 font-medium">Lớp học phần</label>
                        <input
                            id="maLopHP"
                            value={formData.maLopHP}
                            onChange={e => setFormData({ ...formData, maLopHP: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diemQuaTrinh" className="text-gray-700 font-medium">Điểm quá trình</label>
                        <input
                            id="diemQuaTrinh"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.diemQuaTrinh}
                            onChange={e => setFormData({ ...formData, diemQuaTrinh: Number(e.target.value) })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diemGiuaKy" className="text-gray-700 font-medium">Điểm giữa kỳ</label>
                        <input
                            id="diemGiuaKy"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.diemGiuaKy}
                            onChange={e => setFormData({ ...formData, diemGiuaKy: Number(e.target.value) })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diemCuoiKy" className="text-gray-700 font-medium">Điểm cuối kỳ</label>
                        <input
                            id="diemCuoiKy"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.diemCuoiKy}
                            onChange={e => setFormData({ ...formData, diemCuoiKy: Number(e.target.value) })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diemTrungBinh" className="text-gray-700 font-medium">Điểm trung bình</label>
                        <input
                            id="diemTrungBinh"
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={formData.diemTrungBinh}
                            onChange={e => setFormData({ ...formData, diemTrungBinh: Number(e.target.value) })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="diemChu" className="text-gray-700 font-medium">Điểm chữ</label>
                        <select
                            id="diemChu"
                            value={formData.diemChu}
                            onChange={e => setFormData({ ...formData, diemChu: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="">Chọn điểm chữ</option>
                            <option value="A">A (8.5-10)</option>
                            <option value="B+">B+ (7.5-8.4)</option>
                            <option value="B">B (6.5-7.4)</option>
                            <option value="C+">C+ (5.5-6.4)</option>
                            <option value="C">C (4.5-5.4)</option>
                            <option value="D+">D+ (3.5-4.4)</option>
                            <option value="D">D (2.5-3.4)</option>
                            <option value="F">F (0-2.4)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="trangThai" className="text-gray-700 font-medium">Trạng thái</label>
                        <select
                            id="trangThai"
                            value={formData.trangThai}
                            onChange={e => setFormData({ ...formData, trangThai: e.target.value })}
                            className="bg-blue-50 border border-gray-200 rounded-md px-3 py-2 text-base"
                            required
                        >
                            <option value="Đã nhập">Đã nhập</option>
                            <option value="Chưa nhập">Chưa nhập</option>
                        </select>
                    </div>
                </form>
            </Dialog>
        </div>
    );
} 