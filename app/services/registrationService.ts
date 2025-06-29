/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api';

export interface CourseClass {
    maLopHP: string;
    tenLopHP: string;
    soLuong: number;
    siSoHienTai: number;
    giangVien: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    phongHoc: string;
    trangThai: boolean;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
}

export interface RegistrationPeriod {
    maDotDangKy: number;
    tenDotDangKy: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThai: number;
    trangThaiText: string;
    moTa?: string;
    namHoc: string;
    hocKy: number;
}

export interface Registration {
    maSinhVien: string;
    hoTenSinhVien: string;
    maLopHP: string;
    tenLopHP: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    giangVien: string;
    phongHoc: string;
    thoiGianDangKy: string;
    trangThai: boolean;
    ketQuaDangKy: number;
    ghiChu: string | null;
}

export interface RegisterPayload {
    maSinhVien: string;
    maLopHP: string;
    maPhienDK: number;
    thoiGianDangKy: string;
    trangThai: boolean;
    ketQuaDangKy: number;
}

export interface RegistrationRecord {
    maDangKy: number;
    maSinhVien: string;
    hoTenSinhVien: string;
    email: string;
    maLop: string;
    tenLop: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    maDotDangKy: number;
    tenDotDangKy: string;
    ngayDangKy: string;
    trangThai: number;
    trangThaiText: string;
    ghiChu?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

class RegistrationService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    async getAvailableClasses() {
        const res = await fetch(`${API_BASE}/lophocphan`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách lớp học phần');
        }
        const response: ApiResponse<CourseClass[]> = await res.json();
        return response.data;
    }

    async getAvailableClassesByPeriod(maDotDK: string) {
        const res = await fetch(`${API_BASE}/lophocphan/dotdangky/${maDotDK}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách lớp học phần cho đợt đăng ký này');
        }
        const response: ApiResponse<CourseClass[]> = await res.json();
        return response.data;
    }

    async getCurrentRegistrationPeriod() {
        console.log('Calling getCurrentRegistrationPeriod...');
        const res = await fetch(`${API_BASE}/dotdangky/hientai`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        console.log('Response status:', res.status);

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            console.error('API Error:', err);
            throw new Error(err.message || 'Không thể lấy thông tin đợt đăng ký');
        }

        const response: ApiResponse<RegistrationPeriod> = await res.json();
        console.log('Raw API response:', response);
        console.log('Extracted data:', response.data);
        return response.data;
    }

    async getAllRegistrationPeriods() {
        const res = await fetch(`${API_BASE}/dotdangky`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách đợt đăng ký');
        }
        const response: ApiResponse<RegistrationPeriod[]> = await res.json();
        return response.data;
    }

    async getRegistrationPeriodById(maDotDangKy: number) {
        const res = await fetch(`${API_BASE}/dotdangky/${maDotDangKy}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy thông tin đợt đăng ký');
        return data.data;
    }

    async getRegisteredClasses(maSinhVien: string) {
        const res = await fetch(`${API_BASE}/dangky/sinhvien/${maSinhVien}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách lớp đã đăng ký');
        }
        const response: ApiResponse<Registration[]> = await res.json();
        return response.data;
    }

    async registerClass(data: RegisterPayload) {
        const res = await fetch(`${API_BASE}/dangky`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(data),
        });

        const response: ApiResponse<any> = await res.json();

        if (!res.ok || !response.success) {
            throw new Error(response.message || 'Đăng ký thất bại');
        }

        return response.data;
    }

    async cancelRegistration(maPhienDK: number, maSinhVien: string, maLopHP: string) {
        const res = await fetch(`${API_BASE}/dangky/${maPhienDK}/${maSinhVien}/${maLopHP}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });

        const response: ApiResponse<any> = await res.json();

        if (!res.ok || !response.success) {
            throw new Error(response.message || 'Hủy đăng ký thất bại');
        }

        return response.data;
    }

    // ===== QUẢN LÝ ĐỢT ĐĂNG KÝ =====
    async getRegistrationPeriods() {
        const res = await fetch(`${API_BASE}/dotdangky`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách đợt đăng ký');
        return data.data || [];
    }

    async createRegistrationPeriod(period: Partial<RegistrationPeriod>) {
        const res = await fetch(`${API_BASE}/dotdangky`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(period),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Tạo đợt đăng ký thất bại');
        return data.data;
    }

    async updateRegistrationPeriod(maDotDangKy: number, period: Partial<RegistrationPeriod>) {
        const res = await fetch(`${API_BASE}/dotdangky/${maDotDangKy}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(period),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Cập nhật đợt đăng ký thất bại');
        return data.data;
    }

    async deleteRegistrationPeriod(maDotDangKy: number) {
        const res = await fetch(`${API_BASE}/dotdangky/${maDotDangKy}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Xóa đợt đăng ký thất bại');
        return data.data;
    }

    // ===== QUẢN LÝ DANH SÁCH ĐĂNG KÝ =====
    async getRegistrationList(filters?: {
        maDotDangKy?: number;
        maSinhVien?: string;
        trangThai?: number;
        page?: number;
        size?: number;
    }) {
        const params = new URLSearchParams();
        if (filters?.maDotDangKy) params.append('maDotDangKy', filters.maDotDangKy.toString());
        if (filters?.maSinhVien) params.append('maSinhVien', filters.maSinhVien);
        if (filters?.trangThai !== undefined) params.append('trangThai', filters.trangThai.toString());
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.size) params.append('size', filters.size.toString());

        const res = await fetch(`${API_BASE}/dangky/admin?${params}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy danh sách đăng ký');
        return data.data || { content: [], totalElements: 0, totalPages: 0 };
    }

    async getRegistrationById(maDangKy: number) {
        const res = await fetch(`${API_BASE}/dangky/${maDangKy}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy thông tin đăng ký');
        return data.data;
    }

    async updateRegistrationStatus(maDangKy: number, trangThai: number, ghiChu?: string) {
        const res = await fetch(`${API_BASE}/dangky/${maDangKy}/status`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify({ trangThai, ghiChu }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Cập nhật trạng thái đăng ký thất bại');
        return data.data;
    }

    async deleteRegistration(maDangKy: number) {
        const res = await fetch(`${API_BASE}/dangky/${maDangKy}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Xóa đăng ký thất bại');
        return data.data;
    }
}

const registrationService = new RegistrationService();
export default registrationService; 