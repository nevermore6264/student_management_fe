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
    const [detailPlans, setDetailPlans] = useState<StudyPlanDetail[]>([]);
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

    const fetchPlanDetails = async () => {
        if (!maSinhVien) return;

        setDetailLoading(true);
        setError('');
        try {
            const details = await studyPlanService.getKeHoachChiTiet(maKeHoach, maSinhVien, maHocPhan);
            setDetailPlans(details);
            setDetailDialogVisible(true);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết kế hoạch';
            setError(errorMessage);
        } finally {
            setDetailLoading(false);
        }
    };

    const handleViewDetails = () => {
        fetchPlanDetails();
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
                                                        <td className="px-4 py-2 font-mono" onClick={() => handleViewDetails()}>{plan.maHocPhan}</td>
                                                        <td className="px-4 py-2" onClick={() => handleViewDetails()}>{plan.tenHocPhan}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleViewDetails()}>{plan.soTinChi}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleViewDetails()}>{plan.hocKyDuKien}</td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleViewDetails()}>
                                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[plan.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                                                                {plan.trangThaiText}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-2 text-center" onClick={() => handleViewDetails()}>{plan.diem !== undefined ? plan.diem : '-'}</td>
                                                        <td className="px-4 py-2 text-center">
                                                            <Button
                                                                icon="pi pi-eye"
                                                                className="p-button-rounded p-button-info p-button-sm"
                                                                tooltip="Xem chi tiết"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleViewDetails();
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
                ) : detailPlans.length > 0 ? (
                    <div className="space-y-6 max-h-96 overflow-y-auto">
                        <div className="text-center mb-4">
                            <h2 className="text-xl font-bold text-blue-700">Tổng quan kế hoạch học tập</h2>
                            <p className="text-gray-600">Chi tiết {detailPlans.length} môn học trong kế hoạch</p>
                        </div>

                        {detailPlans.map((plan) => (
                            <div key={plan.maKeHoach + plan.maHocPhan} className="border rounded-lg overflow-hidden">
                                {/* Header của môn học */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">{plan.tenHocPhan}</h3>
                                            <p className="text-blue-100 font-mono">{plan.maHocPhan}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">{plan.soTinChi} tín chỉ</p>
                                            <p className="text-sm">Học kỳ {plan.hocKyDuKien} - {plan.namHocDuKien}</p>
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${plan.trangThai === 0 ? 'bg-gray-200 text-gray-700' :
                                                plan.trangThai === 1 ? 'bg-green-200 text-green-700' :
                                                    'bg-blue-200 text-blue-700'
                                                }`}>
                                                {plan.trangThaiText}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Nội dung chi tiết */}
                                <div className="p-4 space-y-4">
                                    {plan.moTaHocPhan && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                                                Mô tả học phần
                                            </h4>
                                            <p className="text-gray-600 bg-blue-50 p-3 rounded">{plan.moTaHocPhan}</p>
                                        </div>
                                    )}

                                    {plan.mucTieuHocPhan && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-target mr-2 text-green-500"></i>
                                                Mục tiêu học phần
                                            </h4>
                                            <p className="text-gray-600 bg-green-50 p-3 rounded">{plan.mucTieuHocPhan}</p>
                                        </div>
                                    )}

                                    {plan.noiDungHocPhan && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-book mr-2 text-yellow-500"></i>
                                                Nội dung học phần
                                            </h4>
                                            <p className="text-gray-600 bg-yellow-50 p-3 rounded">{plan.noiDungHocPhan}</p>
                                        </div>
                                    )}

                                    {plan.dieuKienTienQuyet && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-lock mr-2 text-purple-500"></i>
                                                Điều kiện tiên quyết
                                            </h4>
                                            <p className="text-gray-600 bg-purple-50 p-3 rounded">{plan.dieuKienTienQuyet}</p>
                                        </div>
                                    )}

                                    {plan.phuongPhapGiangDay && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-users mr-2 text-indigo-500"></i>
                                                Phương pháp giảng dạy
                                            </h4>
                                            <p className="text-gray-600 bg-indigo-50 p-3 rounded">{plan.phuongPhapGiangDay}</p>
                                        </div>
                                    )}

                                    {plan.danhGiaHocPhan && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-star mr-2 text-pink-500"></i>
                                                Đánh giá học phần
                                            </h4>
                                            <p className="text-gray-600 bg-pink-50 p-3 rounded">{plan.danhGiaHocPhan}</p>
                                        </div>
                                    )}

                                    {plan.taiLieuThamKhao && (
                                        <div>
                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                <i className="pi pi-file mr-2 text-orange-500"></i>
                                                Tài liệu tham khảo
                                            </h4>
                                            <p className="text-gray-600 bg-orange-50 p-3 rounded">{plan.taiLieuThamKhao}</p>
                                        </div>
                                    )}

                                    {plan.diem !== undefined && (
                                        <div className="bg-gray-50 p-3 rounded">
                                            <span className="font-semibold text-gray-700">Điểm: </span>
                                            <span className="text-lg font-bold text-blue-600">{plan.diem}</span>
                                        </div>
                                    )}

                                    {plan.ghiChu && (
                                        <div className="bg-gray-50 p-3 rounded">
                                            <span className="font-semibold text-gray-700">Ghi chú: </span>
                                            <span className="text-gray-600">{plan.ghiChu}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
            </Dialog>
        </div>
    );
}