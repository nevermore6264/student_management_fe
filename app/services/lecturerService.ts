/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/giangvien';

class LecturerService {
    async getAllLecturers(): Promise<any> {
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
            throw new Error(err.message || 'Không thể lấy danh sách giảng viên');
        }
        return res.json();
    }

    async createLecturer(data: any) {
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
            throw new Error(err.message || 'Thêm giảng viên thất bại');
        }
        return res.json();
    }

    async updateLecturer(id: string, data: any) {
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
            throw new Error(err.message || 'Cập nhật giảng viên thất bại');
        }
        return res.json();
    }

    async deleteLecturer(id: string) {
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
            throw new Error(err.message || 'Xóa giảng viên thất bại');
        }
        return res;
    }
}

const lecturerService = new LecturerService();
export default lecturerService; 