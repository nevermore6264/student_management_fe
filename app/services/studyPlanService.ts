/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/kehoachcosinhvien';

export interface StudyPlan {
    maKeHoach: number;
    maSinhVien: string;
    hoTenSinhVien: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKyDuKien: number;
    namHocDuKien: string;
    trangThai: number;
    trangThaiText: string;
    diem?: number;
    ghiChu?: string;
}

export interface StudyPlanDetail {
    maKeHoach: number;
    hocKyDuKien: number;
    namHocDuKien: string;
    trangThai: number;
    trangThaiText: string;
    maSinhVien: string;
    hoTenSinhVien: string;
    email: string;
    soDienThoai: string;
    maLop: string;
    tenLop: string;
    maKhoa: string;
    tenKhoa: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    maKhoaHocPhan: string;
    tenKhoaHocPhan: string;
    daDangKy: boolean;
    coDiem: boolean;
    diemTongKet?: number;
    xepLoai?: string;
    ghiChu?: string;
    // Thêm các trường chi tiết khác nếu có
    moTaHocPhan?: string;
    dieuKienTienQuyet?: string;
    mucTieuHocPhan?: string;
    noiDungHocPhan?: string;
    phuongPhapGiangDay?: string;
    danhGiaHocPhan?: string;
    taiLieuThamKhao?: string;
}

class StudyPlanService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    async getAll() {
        const res = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách kế hoạch');
        return data.data || [];
    }

    async getByStudent(maSinhVien: string) {
        const res = await fetch(`${API_BASE}/sinhvien/${maSinhVien}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy kế hoạch của sinh viên');
        return data.data || [];
    }

    async getById(maKeHoach: number, maSinhVien: string, maHocPhan: string) {
        const res = await fetch(`${API_BASE}/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy chi tiết kế hoạch');
        return data.data;
    }

    async getKeHoachChiTiet(maKeHoach: number, maSinhVien: string, maHocPhan: string) {
        const res = await fetch(`${API_BASE}/chitiet/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy chi tiết kế hoạch học tập');
        return data.data;
    }

    async create(plan: Partial<StudyPlan>) {
        const res = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(plan),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Tạo kế hoạch thất bại');
        return data.data;
    }

    async update(maKeHoach: number, maSinhVien: string, maHocPhan: string, plan: Partial<StudyPlan>) {
        const res = await fetch(`${API_BASE}/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(plan),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Cập nhật kế hoạch thất bại');
        return data.data;
    }

    async delete(maKeHoach: number, maSinhVien: string, maHocPhan: string) {
        const res = await fetch(`${API_BASE}/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Xóa kế hoạch thất bại');
        return data.data;
    }
}

const studyPlanService = new StudyPlanService();
export default studyPlanService; 