const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

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
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/tongquan`);
        if (!res.ok) throw new Error('Không thể lấy tổng quan điểm');
        const data = await res.json();
        return data;
    }
    async getDetails(maSinhVien: string): Promise<Grade[]> {
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/chitiet`);
        if (!res.ok) throw new Error('Không thể lấy chi tiết điểm');
        const data = await res.json();
        return data;
    }
    async getAllOverview(): Promise<SemesterSummary[]> {
        const res = await fetch(`${API_BASE}/api/diem/tongquan`);
        if (!res.ok) throw new Error('Không thể lấy tổng quan toàn bộ sinh viên');
        const data = await res.json();
        return data;
    }
    async getAllDetails(): Promise<Grade[]> {
        const res = await fetch(`${API_BASE}/api/diem/chitiet`);
        if (!res.ok) throw new Error('Không thể lấy chi tiết điểm toàn bộ sinh viên');
        const data = await res.json();
        return data;
    }
}

const gradeService = new GradeService();
export default gradeService; 