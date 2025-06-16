/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = 'http://localhost:8080/api/sinhvien';

class StudentService {
    async getAllStudents(): Promise<any> {
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
            throw new Error(err.message || 'Không thể lấy danh sách sinh viên');
        }
        return res.json();
    }

    async createStudent(data: any) {
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
            throw new Error(err.message || 'Thêm sinh viên thất bại');
        }
        return res.json();
    }

    async updateStudent(id: string, data: any) {
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
            throw new Error(err.message || 'Cập nhật sinh viên thất bại');
        }
        return res.json();
    }

    async deleteStudent(id: string) {
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
            throw new Error(err.message || 'Xóa sinh viên thất bại');
        }
        return res;
    }
}

const studentService = new StudentService();
export default studentService; 