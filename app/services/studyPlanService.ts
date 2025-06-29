/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/kehoachcosinhvien';

export interface StudyPlan {
    maKeHoach: string;
    maSinhVien: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: number;
    namHoc: string;
    trangThai: number;
    diem?: number;
    ghiChu?: string;
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

    async getById(maKeHoach: string, maSinhVien: string, maHocPhan: string) {
        const res = await fetch(`${API_BASE}/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy chi tiết kế hoạch');
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

    async update(maKeHoach: string, maSinhVien: string, maHocPhan: string, plan: Partial<StudyPlan>) {
        const res = await fetch(`${API_BASE}/${maKeHoach}/${maSinhVien}/${maHocPhan}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(plan),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Cập nhật kế hoạch thất bại');
        return data.data;
    }

    async delete(maKeHoach: string, maSinhVien: string, maHocPhan: string) {
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