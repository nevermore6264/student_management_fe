/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface SemesterSummary {
    hocKy: number;
    namHoc: string;
    tongSoTinChi: number;
    diemTrungBinh: number;
    xepLoai: string;
}

export interface Grade {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: number;
    namHoc: string;
    diemQuaTrinh: number;
    diemGiuaKy: number;
    diemCuoiKy: number;
    diemTrungBinh: number;
    diemChu: string;
    trangThai: string;
}

class GradeService {
    async getOverview(maSinhVien: string): Promise<SemesterSummary[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/tongquan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy tổng quan điểm');
        }
        return res.json();
    }

    async getDetails(maSinhVien: string): Promise<Grade[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/chitiet`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy chi tiết điểm');
        }
        return res.json();
    }

    async getAllOverview(): Promise<ApiResponse<SemesterSummary[]>> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/tongquan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy tổng quan toàn bộ sinh viên');
        }
        return res.json();
    }

    async getAllDetails(): Promise<ApiResponse<Grade[]>> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/chitiet`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy chi tiết điểm toàn bộ sinh viên');
        }
        return res.json();
    }
}

const gradeService = new GradeService();
export default gradeService; 