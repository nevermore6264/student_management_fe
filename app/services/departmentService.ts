/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/khoa';

interface Department {
    maKhoa: string;
    tenKhoa: string;
    soDienThoai: string;
    email: string;
    diaChi: string;
    maTruong: string;
    trangThai: number;
}

class DepartmentService {
    private validateDepartment(data: any): Department {
        return {
            maKhoa: data.maKhoa || '',
            tenKhoa: data.tenKhoa || '',
            soDienThoai: data.soDienThoai || '',
            email: data.email || '',
            diaChi: data.diaChi || '',
            maTruong: data.maTruong || 'UTE',
            trangThai: data.trangThai ?? 1
        };
    }

    async getAllDepartments(): Promise<any> {
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
            throw new Error(err.message || 'Không thể lấy danh sách khoa');
        }
        const data = await res.json();
        return {
            ...data,
            data: Array.isArray(data.data) ? data.data.map(this.validateDepartment) : []
        };
    }

    async createDepartment(data: Department) {
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
            throw new Error(err.message || 'Thêm khoa thất bại');
        }
        const responseData = await res.json();
        return this.validateDepartment(responseData.data);
    }

    async updateDepartment(maKhoa: string, data: Department) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maKhoa}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Cập nhật khoa thất bại');
        }
        const responseData = await res.json();
        return this.validateDepartment(responseData.data);
    }

    async deleteDepartment(maKhoa: string) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maKhoa}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Xóa khoa thất bại');
        }
        return res;
    }
}

const departmentService = new DepartmentService();
export default departmentService;
export type { Department }; 