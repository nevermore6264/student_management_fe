const API_BASE = 'http://localhost:8080/api';

export interface CourseClass {
    maLopHocPhan: string;
    tenLopHocPhan: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: string;
    namHoc: string;
    siSoToiDa: number;
    siSoHienTai: number;
    giangVien: string;
    phongHoc: string;
    trangThai: string;
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
    id: string;
    maSinhVien: string;
    maLopHocPhan: string;
    ngayDangKy: string;
    trangThai: string;
    lopHocPhan: CourseClass;
}

export interface RegisterPayload {
    maSinhVien: string;
    maLopHocPhan: string;
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
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Đăng ký thất bại');
        }
        const response: ApiResponse<any> = await res.json();
        return response.data;
    }

    async cancelRegistration(id: string) {
        const res = await fetch(`${API_BASE}/dangky/${id}`, {
            method: 'DELETE',
            headers: this.getAuthHeaders(),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Hủy đăng ký thất bại');
        }
        const response: ApiResponse<any> = await res.json();
        return response.data;
    }
}

const registrationService = new RegistrationService();
export default registrationService; 