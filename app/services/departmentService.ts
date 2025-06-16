const API_BASE = 'http://localhost:8080/api/khoa';

interface Department {
    maKhoa: string;
    tenKhoa: string;
    moTa: string;
}

class DepartmentService {
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
        return res.json();
    }
}

const departmentService = new DepartmentService();
export default departmentService;
export type { Department }; 