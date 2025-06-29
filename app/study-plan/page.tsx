'use client';

import { useEffect, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

// Định nghĩa interface cho kế hoạch học tập
interface StudyPlan {
    maKeHoach: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: number;
    namHoc: string;
    trangThai: 0 | 1 | 2;
    diem?: number;
    ghiChu?: string;
}

const STATUS_MAP: Record<0 | 1 | 2, { label: string; color: string }> = {
    0: { label: 'Chưa học', color: 'bg-gray-100 text-gray-700' },
    1: { label: 'Đã học', color: 'bg-green-100 text-green-700' },
    2: { label: 'Đang học', color: 'bg-blue-100 text-blue-700' },
};

export default function StudyPlanPage() {
    const [plans, setPlans] = useState<StudyPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusFilter, setStatusFilter] = useState<0 | 1 | 2 | null>(null);
    const [search, setSearch] = useState<string>('');
    const maSinhVien = typeof window !== 'undefined' ? localStorage.getItem('maNguoiDung') : '';

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/kehoachcosinhvien/sinhvien/${maSinhVien}`);
            const data = await res.json();
            setPlans(data.data || []);
        } catch {
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (maSinhVien) fetchPlans();
        // eslint-disable-next-line
    }, [maSinhVien]);

    const filteredPlans = plans.filter(plan =>
        (statusFilter === null || plan.trangThai === statusFilter) &&
        (
            plan.tenHocPhan?.toLowerCase().includes(search.toLowerCase()) ||
            plan.maHocPhan?.toLowerCase().includes(search.toLowerCase())
        )
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
                            onChange={e => setSearch(e.target.value)}
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
                        onChange={e => setStatusFilter(e.value)}
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
                                <th className="px-4 py-2 text-center">Học kỳ</th>
                                <th className="px-4 py-2 text-center">Năm học</th>
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
                                        <td className="px-4 py-2 text-center">{plan.hocKy}</td>
                                        <td className="px-4 py-2 text-center">{plan.namHoc}</td>
                                        <td className="px-4 py-2 text-center">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[plan.trangThai]?.color || 'bg-gray-100 text-gray-700'}`}>
                                                {STATUS_MAP[plan.trangThai]?.label || 'Không xác định'}
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