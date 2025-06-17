/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/hocphan';

export interface CourseClass {
    maLopHP: string;
    tenLopHP: string;
    soLuong: number;
    giangVien: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    phongHoc: string;
    trangThai: boolean;
}

export interface Course {
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    maKhoa: string;
    lopHocPhans?: CourseClass[];
}

class CourseService {
    private validateCourse(data: any): Course {
        return {
            maHocPhan: data.maHocPhan || '',
            tenHocPhan: data.tenHocPhan || '',
            soTinChi: data.soTinChi ?? 0,
            maKhoa: data.maKhoa || '',
            lopHocPhans: data.lopHocPhans || []
        };
    }

    async getAllCourses(): Promise<{ data: Course[] }> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách học phần');
        }
        const data = await res.json();
        return {
            ...data,
            data: Array.isArray(data.data) ? data.data.map(this.validateCourse) : []
        };
    }

    async getCourseById(id: string): Promise<Course> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy thông tin học phần');
        }
        const data = await res.json();
        return this.validateCourse(data.data);
    }

    async getCoursesByDepartment(maKhoa: string): Promise<{ data: Course[] }> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/khoa/${maKhoa}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách học phần theo khoa');
        }
        const data = await res.json();
        return {
            ...data,
            data: Array.isArray(data.data) ? data.data.map(this.validateCourse) : []
        };
    }

    async createCourse(data: Course) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Thêm học phần thất bại');
        }
        const responseData = await res.json();
        return this.validateCourse(responseData.data);
    }

    async updateCourse(id: string, data: Course) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Cập nhật học phần thất bại');
        }
        const responseData = await res.json();
        return this.validateCourse(responseData.data);
    }

    async deleteCourse(id: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Xóa học phần thất bại');
        }
        return res;
    }
}

const courseService = new CourseService();
export default courseService;