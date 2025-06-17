/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/thoikhoabieu';

export interface Schedule {
    id: number;
    maLopHP: string;
    thu: number;
    tietBatDau: number;
    soTiet: number;
    phongHoc: string;
}

class ScheduleService {
    private validateSchedule(data: any): Schedule {
        return {
            id: data.id,
            maLopHP: data.maLopHP || '',
            thu: data.thu ?? 0,
            tietBatDau: data.tietBatDau ?? 0,
            soTiet: data.soTiet ?? 0,
            phongHoc: data.phongHoc || '',
        };
    }

    async getAll(): Promise<Schedule[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy danh sách TKB');
        return Array.isArray(data.data) ? data.data.map(this.validateSchedule) : [];
    }

    async getById(id: number): Promise<Schedule> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy chi tiết TKB');
        return this.validateSchedule(data.data);
    }

    async getByLopHocPhan(maLopHP: string): Promise<Schedule[]> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/lophocphan/${maLopHP}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Không thể lấy TKB theo lớp học phần');
        return Array.isArray(data.data) ? data.data.map(this.validateSchedule) : [];
    }

    async create(payload: any): Promise<Schedule> {
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
        if (!res.ok || !data.success) throw new Error(data.message || 'Tạo TKB thất bại');
        return this.validateSchedule(data.data);
    }

    async update(id: number, payload: any): Promise<Schedule> {
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
        if (!res.ok || !data.success) throw new Error(data.message || 'Cập nhật TKB thất bại');
        return this.validateSchedule(data.data);
    }

    async delete(id: number): Promise<void> {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Xóa TKB thất bại');
    }
}

const scheduleService = new ScheduleService();
export default scheduleService; 