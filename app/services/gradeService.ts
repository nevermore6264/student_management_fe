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

export interface GradeManagement {
    id: string;
    maSinhVien: string;
    tenSinhVien: string;
    maHocPhan: string;
    tenHocPhan: string;
    maLopHP: string;
    diemQuaTrinh: number;
    diemGiuaKy: number;
    diemCuoiKy: number;
    diemTrungBinh: number;
    diemChu: string;
    trangThai: string;
}

// Interface cho request cập nhật điểm theo DiemRequest
export interface DiemRequest {
    id?: string;
    maSinhVien: string;
    maLopHP: string;
    diemChuyenCan: number | null;
    diemGiuaKy: number | null;
    diemCuoiKy: number | null;
    diemTongKet: number | null;
    ghiChu: string | null;
}

// Interface cho response từ API
export interface DiemResponse {
    id: string;
    maSinhVien: string;
    maLopHP: string;
    diemChuyenCan: number | null;
    diemGiuaKy: number | null;
    diemCuoiKy: number | null;
    diemTongKet: number | null;
    ghiChu: string | null;
    trangThai: string;
}

export interface GradeOverview {
    maSinhVien: string;
    hoTenSinhVien: string;
    tongSoTinChi: number;
    tongSoTinChiDat: number;
    diemTrungBinh: number;
    xepLoai: string;
    danhSachDiem: GradeDetail[];
}

export interface GradeDetail {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    diemQuaTrinh: number;
    diemThi: number;
    diemTongKet: number;
    diemChu: string;
    trangThai: string;
}

export interface ChiTietDiem {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    diemQuaTrinh: number;
    diemThi: number;
    diemTongKet: number;
    diemChu: string;
    trangThai: string;
}

export interface KetQuaHocTapResponse {
    maSinhVien: string;
    hoTenSinhVien: string;
    diemTrungBinh: number;
    xepLoai: string;
    tongSoTinChi: number;
    tinChiDat: number;
    tyLeDat: number;
    tinChiDaDat: number;
    tyLeHoanThanh: number;
    chiTietDiem: ChiTietDiem[];
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

    // API quản lý điểm của giáo viên
    async getAllGrades(): Promise<GradeManagement[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy tất cả điểm');
        }
        const data = await res.json();
        return data.data || data;
    }

    async getGradeById(id: string): Promise<GradeManagement> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy điểm theo ID');
        }
        const data = await res.json();
        return data.data || data;
    }

    async getGradesByStudent(maSinhVien: string): Promise<GradeManagement[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy điểm theo sinh viên');
        }
        const data = await res.json();
        return data.data || data;
    }

    async getGradesByClass(maLopHP: string): Promise<GradeManagement[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/lophocphan/${maLopHP}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy điểm theo lớp học phần');
        }
        const data = await res.json();
        return data.data || data;
    }

    async updateGrade(gradeData: DiemRequest): Promise<DiemResponse> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/capnhat?maSinhVien=${gradeData.maSinhVien}&maLopHP=${gradeData.maLopHP}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(gradeData)
        });

        const data = await res.json();

        // Kiểm tra success field từ response
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    }

    async createGrade(gradeData: DiemRequest): Promise<DiemResponse> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/nhap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(gradeData)
        });

        const data = await res.json();

        // Kiểm tra success field từ response
        if (!data.success) {
            throw new Error(data.message);
        }

        return data.data;
    }

    async deleteGrade(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể xóa điểm');
        }
    }

    async getTeacherOverview(maGiangVien: string): Promise<any> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/diem/giangvien/${maGiangVien}/tongquan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        const data = await res.json();
        return data;
    }

    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    async getStudentGradeOverview(maSinhVien: string): Promise<GradeOverview> {
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/tongquan`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy thông tin điểm');
        }

        const response: ApiResponse<GradeOverview> = await res.json();
        return response.data;
    }

    async getStudentSummary(maSinhVien: string): Promise<KetQuaHocTapResponse> {
        const res = await fetch(`${API_BASE}/api/diem/sinhvien/${maSinhVien}/ketquahoctap`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy kết quả học tập');
        }
        const response: ApiResponse<KetQuaHocTapResponse> = await res.json();
        return response.data;
    }
}

const gradeService = new GradeService();
export default gradeService; 