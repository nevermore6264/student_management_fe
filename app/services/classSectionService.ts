/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/lophocphan';

export interface ClassSection {
    maLopHP: string;
    maHocPhan: string;
    tenLopHP: string;
    soLuong: number;
    giangVien: string;
    thoiGianBatDau: string;
    thoiGianKetThuc: string;
    phongHoc: string;
    trangThai: boolean;
}

class ClassSectionService {
    private validateClassSection(data: any): ClassSection {
        return {
            maLopHP: data.maLopHP || '',
            maHocPhan: data.maHocPhan || '',
            tenLopHP: data.tenLopHP || '',
            soLuong: data.soLuong ?? 0,
            giangVien: data.giangVien || '',
            thoiGianBatDau: data.thoiGianBatDau || '',
            thoiGianKetThuc: data.thoiGianKetThuc || '',
            phongHoc: data.phongHoc || '',
            trangThai: data.trangThai ?? true
        };
    }

    async getAllClassSections(): Promise<ClassSection[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy danh sách lớp học phần');
        return Array.isArray(data.data) ? data.data.map(this.validateClassSection) : [];
    }

    async getClassSectionById(id: string): Promise<ClassSection> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy thông tin lớp học phần');
        return this.validateClassSection(data.data);
    }

    async getClassSectionsByCourse(maHocPhan: string): Promise<ClassSection[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/hocphan/${maHocPhan}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy danh sách lớp học phần theo học phần');
        return Array.isArray(data.data) ? data.data.map(this.validateClassSection) : [];
    }

    async getClassSectionsByTeacher(maGiangVien: string): Promise<ClassSection[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/giangvien/${maGiangVien}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy danh sách lớp học phần theo giảng viên');
        return Array.isArray(data.data) ? data.data.map(this.validateClassSection) : [];
    }

    async createClassSection(payload: any): Promise<ClassSection> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Tạo lớp học phần thất bại');
        return this.validateClassSection(data.data);
    }

    async updateClassSection(id: string, payload: any): Promise<ClassSection> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Cập nhật lớp học phần thất bại');
        return this.validateClassSection(data.data);
    }

    async deleteClassSection(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Xóa lớp học phần thất bại');
    }

    async getStudents(maLopHP: string): Promise<any[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maLopHP}/sinhvien`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy danh sách sinh viên');
        return Array.isArray(data.data) ? data.data : [];
    }

    async getOverview(maLopHP: string): Promise<any> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maLopHP}/tongquan`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy tổng quan lớp học phần');
        return data.data;
    }

    async exportReport(maLopHP: string): Promise<Blob> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maLopHP}/baocao`, {
            method: 'GET',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        if (!res.ok) throw new Error('Không thể xuất báo cáo');
        return await res.blob();
    }
}

const classSectionService = new ClassSectionService();
export default classSectionService; 