/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/lop';

export interface Class {
    maLop: string;
    tenLop: string;
    maKhoa: string;
    khoaHoc: string;
    trangThai: number;
}

class ClassService {
    private validateClass(data: any): Class {
        return {
            maLop: data.maLop || '',
            tenLop: data.tenLop || '',
            maKhoa: data.maKhoa || '',
            khoaHoc: data.khoaHoc || '',
            trangThai: data.trangThai ?? 1
        };
    }

    async getAllClasses(): Promise<{ data: Class[] }> {
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
            throw new Error(err.message || 'Không thể lấy danh sách lớp');
        }
        const data = await res.json();
        return {
            ...data,
            data: Array.isArray(data.data) ? data.data.map(this.validateClass) : []
        };
    }

    async createClass(data: Class) {
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
            throw new Error(err.message || 'Thêm lớp thất bại');
        }
        const responseData = await res.json();
        return this.validateClass(responseData.data);
    }

    async updateClass(maLop: string, data: Class) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maLop}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Cập nhật lớp thất bại');
        }
        const responseData = await res.json();
        return this.validateClass(responseData.data);
    }

    async deleteClass(maLop: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maLop}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Xóa lớp thất bại');
        }
        return res;
    }

    async getStudentsOfClass(maLopHP: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8080/api/lophocphan/${maLopHP}/students`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Không thể lấy danh sách sinh viên lớp học phần');
        }
        const data = await res.json();
        return data.data || [];
    }
}

const classService = new ClassService();
export default classService; 