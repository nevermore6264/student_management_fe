'use client';

import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import studyPlanService, { StudyPlan } from '../services/studyPlanService';

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
                                <th className="px-4 py-2 text-left">Ghi chú</th>
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
                                    <tr key={plan.maKeHoach + plan.maHocPhan} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{plan.maHocPhan}</td>
                                        <td className="px-4 py-2">{plan.tenHocPhan}</td>
                                        <td className="px-4 py-2 text-center">{plan.soTinChi}</td>
                                        <td className="px-4 py-2 text-center">{plan.hocKyDuKien}</td>
                                        <td className="px-4 py-2 text-center">{plan.namHocDuKien}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[plan.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                                                {plan.trangThaiText}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 text-center">{plan.diem !== undefined ? plan.diem : '-'}</td>
                                        <td className="px-4 py-2">{plan.ghiChu || ''}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}