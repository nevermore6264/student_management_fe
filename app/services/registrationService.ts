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
    maDotDK: string;
    tenDotDK: string;
    ngayGioBatDau: string;
    ngayGioKetThuc: string;
    thoiGian: number;
    maKhoa: string;
    tenKhoa: string;
    moTa: string;
    trangThai: boolean;
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

    async getRegistrationPeriodById(maDotDK: string) {
        const res = await fetch(`${API_BASE}/dotdangky/${maDotDK}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy thông tin đợt đăng ký');
        }
        const response: ApiResponse<RegistrationPeriod> = await res.json();
        return response.data;
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
}

const registrationService = new RegistrationService();
export default registrationService; 