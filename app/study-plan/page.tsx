'use client';

import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

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

const STATUS_MAP: Record<0 | 1 | 2, { label: string; color: "info" | "success" }> = {
    0: { label: 'Chưa học', color: 'info' },
    1: { label: 'Đã học', color: 'success' },
    2: { label: 'Đang học', color: 'info' },
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

    const statusBody = (row: StudyPlan) => (
        <Tag
            value={STATUS_MAP[row.trangThai]?.label || 'Không xác định'}
            severity={STATUS_MAP[row.trangThai]?.color || 'secondary'}
            className="text-sm px-3 py-1 rounded-full"
        />
    );

    const noteBody = (row: StudyPlan) => row.ghiChu || '';
    const scoreBody = (row: StudyPlan) => row.diem !== undefined ? row.diem : '-';

    const filteredPlans = plans.filter(plan =>
        (statusFilter === null || plan.trangThai === statusFilter) &&
        (
            plan.tenHocPhan?.toLowerCase().includes(search.toLowerCase()) ||
            plan.maHocPhan?.toLowerCase().includes(search.toLowerCase())
        )
    );

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Kế hoạch học tập của tôi</h1>
                    <p className="text-gray-600">Quản lý kế hoạch học tập cá nhân</p>
                </div>
                <Button
                    icon="pi pi-refresh"
                    label="Làm mới"
                    onClick={fetchPlans}
                />
            </div>

            <div className="flex justify-content-between mb-4">
                <div className="flex gap-3">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
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

            <DataTable
                value={filteredPlans}
                loading={loading}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                className="p-datatable-sm"
                emptyMessage="Không có dữ liệu kế hoạch học tập."
                scrollable
                scrollHeight="500px"
                responsiveLayout="scroll"
            >
                <Column field="maHocPhan" header="Mã học phần" sortable style={{ minWidth: 120 }} bodyClassName="font-mono" />
                <Column field="tenHocPhan" header="Tên học phần" sortable style={{ minWidth: 200 }} />
                <Column field="soTinChi" header="Số tín chỉ" sortable style={{ minWidth: 80 }} bodyClassName="text-center" />
                <Column field="hocKy" header="Học kỳ" sortable style={{ minWidth: 80 }} bodyClassName="text-center" />
                <Column field="namHoc" header="Năm học" sortable style={{ minWidth: 100 }} bodyClassName="text-center" />
                <Column field="trangThai" header="Trạng thái" body={statusBody} sortable style={{ minWidth: 120 }} bodyClassName="text-center" />
                <Column field="diem" header="Điểm" body={scoreBody} style={{ minWidth: 80 }} bodyClassName="text-center" />
                <Column field="ghiChu" header="Ghi chú" body={noteBody} style={{ minWidth: 120 }} />
            </DataTable>
        </div>
    );
}