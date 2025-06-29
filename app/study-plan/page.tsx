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
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Mã học phần</th>
                                <th className="px-4 py-2 text-left">Tên học phần</th>
                                <th className="px-4 py-2 text-center">Số tín chỉ</th>
                                <th className="px-4 py-2 text-center">Học kỳ dự kiến</th>
                                <th className="px-4 py-2 text-center">Năm học dự kiến</th>
                                <th className="px-4 py-2 text-center">Trạng thái</th>
                                <th className="px-4 py-2 text-center">Điểm</th>
                                <th className="px-4 py-2 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPlans.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        Không có dữ liệu kế hoạch học tập
                                    </td>
                                </tr>
                            ) : (
                                filteredPlans.map(plan => (
                                    <tr key={plan.maKeHoach + plan.maHocPhan} className="border-b hover:bg-blue-50 cursor-pointer">
                                        <td className="px-4 py-2 font-mono" onClick={() => handleRowClick(plan)}>{plan.maHocPhan}</td>
                                        <td className="px-4 py-2" onClick={() => handleRowClick(plan)}>{plan.tenHocPhan}</td>
                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.soTinChi}</td>
                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.hocKyDuKien}</td>
                                        <td className="px-4 py-2 text-center" onClick={() => handleRowClick(plan)}>{plan.namHocDuKien}</td>
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialog chi tiết */}
            <Dialog
                visible={detailDialogVisible}
                onHide={() => setDetailDialogVisible(false)}
                header="Chi tiết kế hoạch học tập"
                modal
                className="w-3/4"
                footer={detailDialogFooter}
            >
                {error && <Message severity="error" text={error} className="mb-4" />}

                {detailLoading ? (
                    <div className="text-center py-8 text-blue-500 font-semibold">Đang tải chi tiết...</div>
                ) : detailPlan ? (
                    <div className="space-y-6">
                        {/* Thông tin cơ bản */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-2">Thông tin cơ bản</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Mã học phần:</span> <span className="font-mono">{detailPlan.maHocPhan}</span></p>
                                    <p><span className="font-medium">Tên học phần:</span> {detailPlan.tenHocPhan}</p>
                                    <p><span className="font-medium">Số tín chỉ:</span> {detailPlan.soTinChi}</p>
                                    <p><span className="font-medium">Học kỳ dự kiến:</span> {detailPlan.hocKyDuKien}</p>
                                    <p><span className="font-medium">Năm học dự kiến:</span> {detailPlan.namHocDuKien}</p>
                                    <p><span className="font-medium">Trạng thái:</span>
                                        <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[detailPlan.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                                            {detailPlan.trangThaiText}
                                        </span>
                                    </p>
                                    {detailPlan.diem !== undefined && (
                                        <p><span className="font-medium">Điểm:</span> {detailPlan.diem}</p>
                                    )}
                                    {detailPlan.ghiChu && (
                                        <p><span className="font-medium">Ghi chú:</span> {detailPlan.ghiChu}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Thông tin chi tiết học phần */}
                        {detailPlan.moTaHocPhan && (
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Mô tả học phần</h3>
                                <p className="text-gray-600">{detailPlan.moTaHocPhan}</p>
                            </div>
                        )}

                        {detailPlan.mucTieuHocPhan && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Mục tiêu học phần</h3>
                                <p className="text-gray-600">{detailPlan.mucTieuHocPhan}</p>
                            </div>
                        )}

                        {detailPlan.noiDungHocPhan && (
                            <div className="p-4 bg-yellow-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Nội dung học phần</h3>
                                <p className="text-gray-600">{detailPlan.noiDungHocPhan}</p>
                            </div>
                        )}

                        {detailPlan.dieuKienTienQuyet && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Điều kiện tiên quyết</h3>
                                <p className="text-gray-600">{detailPlan.dieuKienTienQuyet}</p>
                            </div>
                        )}

                        {detailPlan.phuongPhapGiangDay && (
                            <div className="p-4 bg-indigo-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Phương pháp giảng dạy</h3>
                                <p className="text-gray-600">{detailPlan.phuongPhapGiangDay}</p>
                            </div>
                        )}

                        {detailPlan.danhGiaHocPhan && (
                            <div className="p-4 bg-pink-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Đánh giá học phần</h3>
                                <p className="text-gray-600">{detailPlan.danhGiaHocPhan}</p>
                            </div>
                        )}

                        {detailPlan.taiLieuThamKhao && (
                            <div className="p-4 bg-orange-50 rounded-lg">
                                <h3 className="font-semibold text-gray-700 mb-2">Tài liệu tham khảo</h3>
                                <p className="text-gray-600">{detailPlan.taiLieuThamKhao}</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </Dialog>
        </div>
    );
}