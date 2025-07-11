'use client';

import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Message } from 'primereact/message';
import studyPlanService, { StudyPlan, StudyPlanDetail } from '../services/studyPlanService';

const STATUS_MAP: Record<number, { color: string }> = {
    0: { color: 'bg-gray-100 text-gray-700' },
    1: { color: 'bg-green-100 text-green-700' },
    2: { color: 'bg-blue-100 text-blue-700' },
};

export default function StudyPlanPage() {
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [search, setSearch] = useState<string>('');
    const [detailPlan, setDetailPlan] = useState<StudyPlanDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState<boolean>(false);
    const [detailDialogVisible, setDetailDialogVisible] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const maSinhVien = typeof window !== 'undefined' ? localStorage.getItem('maNguoiDung') : '';

    const fetchPlans = async () => {
        if (!maSinhVien) return;

        setLoading(true);
        try {
            const data = await studyPlanService.getByStudent(maSinhVien);
            setPlans(data);
        } catch (error) {
            console.error('Lỗi khi tải kế hoạch học tập:', error);
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlanDetail = async (plan: StudyPlan) => {
        setDetailLoading(true);
        setError('');
        try {
            const detail = await studyPlanService.getKeHoachChiTiet(plan.maKeHoach, plan.maSinhVien, plan.maHocPhan);
            setDetailPlan(detail);
            setDetailDialogVisible(true);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết kế hoạch';
            setError(errorMessage);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleRowClick = (plan: StudyPlan) => {
        fetchPlanDetail(plan);
    };

    useEffect(() => {
        fetchPlans();
        // eslint-disable-next-line
    }, [maSinhVien]);

    const handleStatusFilterChange = (e: { value: number | null | { label: string; value: null } }) => {
        // Xử lý trường hợp clear dropdown trả về object
        const filterValue = typeof e.value === 'object' && e.value !== null ? e.value.value : e.value;
        setStatusFilter(filterValue);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredPlans = plans.filter(plan => {
        // Kiểm tra filter trạng thái
        const statusMatch = statusFilter === null || statusFilter === undefined || plan.trangThai === statusFilter;

        // Kiểm tra search
        const searchMatch = !search || search.trim() === '' ||
            plan.tenHocPhan?.toLowerCase().includes(search.toLowerCase()) ||
            plan.maHocPhan?.toLowerCase().includes(search.toLowerCase());

        const result = statusMatch && searchMatch;

        return result;
    });

    // Group plans by academic year
    const groupedPlans = filteredPlans.reduce((groups, plan) => {
        const year = plan.namHocDuKien;
        if (!groups[year]) {
            groups[year] = [];
        }
        groups[year].push(plan);
        return groups;
    }, {} as Record<string, StudyPlan[]>);

    // Sort academic years
    const sortedYears = Object.keys(groupedPlans).sort();

    // Calculate totals for each year
    const yearTotals = sortedYears.map(year => {
        const yearPlans = groupedPlans[year];
        const totalCredits = yearPlans.reduce((sum, plan) => sum + plan.soTinChi, 0);
        const completedCount = yearPlans.filter(plan => plan.trangThai === 1).length;
        const inProgressCount = yearPlans.filter(plan => plan.trangThai === 2).length;
        const notStartedCount = yearPlans.filter(plan => plan.trangThai === 0).length;

        return {
            year,
            totalCredits,
            totalSubjects: yearPlans.length,
            completedCount,
            inProgressCount,
            notStartedCount
        };
    });

    const detailDialogFooter = (
        <div>
            <Button
                label="Đóng"
                icon="pi pi-times"
                onClick={() => setDetailDialogVisible(false)}
                className="p-button-text"
            />
        </div>
    );

    return (
        <div className="w-4/5 max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12">
            <div className="flex justify-content-between align-items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-blue-700">Kế hoạch học tập của tôi</h1>
                    <p className="text-gray-600">Quản lý kế hoạch học tập cá nhân</p>
                </div>
            </div>

            <div className="flex justify-content-between mb-4">
                <div className="flex gap-3">
                    <span className="p-input-icon-left">
                        <InputText
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Tìm kiếm học phần..."
                            className="w-64"
                        />
                    </span>
                    <Dropdown
                        value={statusFilter}
                        options={[
                            { label: 'Tất cả trạng thái', value: null },
                            { label: 'Chưa học', value: 0 },
                            { label: 'Đã học', value: 1 },
                            { label: 'Đang học', value: 2 },
                        ]}
                        onChange={handleStatusFilterChange}
                        placeholder="Lọc theo trạng thái"
                        className="w-56"
                        showClear
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="space-y-6">
                    {/* Summary cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center">
                                <i className="pi pi-calendar text-blue-500 text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm text-blue-600">Tổng số năm học</p>
                                    <p className="text-xl font-bold text-blue-700">{sortedYears.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <div className="flex items-center">
                                <i className="pi pi-book text-green-500 text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm text-green-600">Tổng số môn học</p>
                                    <p className="text-xl font-bold text-green-700">{filteredPlans.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <div className="flex items-center">
                                <i className="pi pi-star text-purple-500 text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm text-purple-600">Tổng số tín chỉ</p>
                                    <p className="text-xl font-bold text-purple-700">
                                        {filteredPlans.reduce((sum, plan) => sum + plan.soTinChi, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                            <div className="flex items-center">
                                <i className="pi pi-check-circle text-orange-500 text-2xl mr-3"></i>
                                <div>
                                    <p className="text-sm text-orange-600">Đã hoàn thành</p>
                                    <p className="text-xl font-bold text-orange-700">
                                        {filteredPlans.filter(plan => plan.trangThai === 1).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grouped by academic year */}
                    {sortedYears.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            Không có dữ liệu kế hoạch học tập
                        </div>
                    ) : (
                        sortedYears.map(year => {
                            const yearPlans = groupedPlans[year];
                            const yearTotal = yearTotals.find(total => total.year === year);

                            return (
                                <div key={year} className="border rounded-lg overflow-hidden">
                                    {/* Year header */}
                                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold">Năm học: {year}</h3>
                                                <p className="text-gray-200 text-sm">
                                                    {yearPlans.length} môn học • {yearTotal?.totalCredits} tín chỉ
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="bg-green-200 text-green-700 px-2 py-1 rounded text-xs">
                                                    Đã học: {yearTotal?.completedCount}
                                                </span>
                                                <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs">
                                                    Đang học: {yearTotal?.inProgressCount}
                                                </span>
                                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
                                                    Chưa học: {yearTotal?.notStartedCount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Year's subjects table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Mã học phần</th>
                                                    <th className="px-4 py-2 text-left">Tên học phần</th>
                                                    <th className="px-4 py-2 text-center">Số tín chỉ</th>
                                                    <th className="px-4 py-2 text-center">Học kỳ dự kiến</th>
                                                    <th className="px-4 py-2 text-center">Trạng thái</th>
                                                    <th className="px-4 py-2 text-center">Điểm</th>
                                                    <th className="px-4 py-2 text-center">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {yearPlans.map(plan => (
                                                    <tr key={plan.maKeHoach + plan.maHocPhan} className="border-b hover:bg-blue-50 cursor-pointer">
                                                        <td className="px-4 py-2 font-mono" onClick={() => handleRowClick(plan)}>{plan.maHocPhan}</td>
                                                        <td className="px-4 py-2" onClick={() => handleRowClick(plan)}>{plan.tenHocPhan}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.soTinChi}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.hocKyDuKien}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>
                                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[plan.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                                                                {plan.trangThaiText}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.diem !== undefined ? plan.diem : '-'}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            <Button
                                                                icon="pi pi-eye"
                                                                className="p-button-rounded p-button-info p-button-sm"
                                                                tooltip="Xem chi tiết"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleRowClick(plan);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Dialog chi tiết */}
            <Dialog
                visible={detailDialogVisible}
                onHide={() => setDetailDialogVisible(false)}
                header="Chi tiết kế hoạch học tập"
                modal
                className="w-4/5"
                footer={detailDialogFooter}
            >
                {error && <Message severity="error" text={error} className="mb-4" />}

                {detailLoading ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải chi tiết...</div>
                ) : detailPlan ? (
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                        {/* Header với thông tin học phần */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold mb-2">{detailPlan.tenHocPhan}</h3>
                                    <p className="text-blue-100 font-mono mb-1">Mã học phần: {detailPlan.maHocPhan}</p>
                                    <p className="text-blue-100">Khoa: {detailPlan.tenKhoaHocPhan}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold">{detailPlan.soTinChi} tín chỉ</p>
                                    <p className="text-sm">Học kỳ {detailPlan.hocKyDuKien} - {detailPlan.namHocDuKien}</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${detailPlan.trangThai === 0 ? 'bg-gray-200 text-gray-700' :
                                        detailPlan.trangThai === 1 ? 'bg-green-200 text-green-700' :
                                            'bg-blue-200 text-blue-700'
                                        }`}>
                                        {detailPlan.trangThaiText}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin sinh viên */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                <i className="pi pi-user mr-2 text-blue-500"></i>
                                Thông tin sinh viên
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Họ tên:</p>
                                    <p className="font-semibold text-gray-800">{detailPlan.hoTenSinhVien}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Mã sinh viên:</p>
                                    <p className="font-mono text-gray-800">{detailPlan.maSinhVien}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email:</p>
                                    <p className="text-gray-800">{detailPlan.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Số điện thoại:</p>
                                    <p className="text-gray-800">{detailPlan.soDienThoai}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Lớp:</p>
                                    <p className="text-gray-800">{detailPlan.tenLop} ({detailPlan.maLop})</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Khoa:</p>
                                    <p className="text-gray-800">{detailPlan.tenKhoa} ({detailPlan.maKhoa})</p>
                                </div>
                            </div>
                        </div>

                        {/* Thông tin đăng ký và điểm số */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                <i className="pi pi-check-circle mr-2 text-green-500"></i>
                                Trạng thái đăng ký và điểm số
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Đã đăng ký</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${detailPlan.daDangKy ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                                        }`}>
                                        {detailPlan.daDangKy ? 'Có' : 'Chưa'}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">Có điểm</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${detailPlan.coDiem ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                        {detailPlan.coDiem ? 'Có' : 'Chưa có'}
                                    </span>
                                </div>
                                {detailPlan.coDiem && detailPlan.diemTongKet !== undefined && (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Điểm tổng kết</p>
                                        <p className="text-lg font-bold text-blue-600">{detailPlan.diemTongKet}</p>
                                        {detailPlan.xepLoai && (
                                            <span className="inline-block px-2 py-1 rounded text-xs bg-blue-200 text-blue-700 mt-1">
                                                {detailPlan.xepLoai}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Nội dung chi tiết học phần */}
                        <div className="space-y-4">
                            {detailPlan.moTaHocPhan && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                                        Mô tả học phần
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.moTaHocPhan}</p>
                                </div>
                            )}

                            {detailPlan.mucTieuHocPhan && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-target mr-2 text-green-500"></i>
                                        Mục tiêu học phần
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.mucTieuHocPhan}</p>
                                </div>
                            )}

                            {detailPlan.noiDungHocPhan && (
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-book mr-2 text-yellow-500"></i>
                                        Nội dung học phần
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.noiDungHocPhan}</p>
                                </div>
                            )}

                            {detailPlan.dieuKienTienQuyet && (
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-lock mr-2 text-purple-500"></i>
                                        Điều kiện tiên quyết
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.dieuKienTienQuyet}</p>
                                </div>
                            )}

                            {detailPlan.phuongPhapGiangDay && (
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-users mr-2 text-indigo-500"></i>
                                        Phương pháp giảng dạy
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.phuongPhapGiangDay}</p>
                                </div>
                            )}

                            {detailPlan.danhGiaHocPhan && (
                                <div className="bg-pink-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-star mr-2 text-pink-500"></i>
                                        Đánh giá học phần
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.danhGiaHocPhan}</p>
                                </div>
                            )}

                            {detailPlan.taiLieuThamKhao && (
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-file mr-2 text-orange-500"></i>
                                        Tài liệu tham khảo
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.taiLieuThamKhao}</p>
                                </div>
                            )}

                            {detailPlan.ghiChu && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                        <i className="pi pi-comment mr-2 text-gray-500"></i>
                                        Ghi chú
                                    </h4>
                                    <p className="text-gray-700">{detailPlan.ghiChu}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </Dialog>
        </div>
    );
}