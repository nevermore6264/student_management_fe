const API_BASE = 'http://localhost:8080/api/vai-tro';

export interface Role {
    maVaiTro: string;
    tenVaiTro: string;
    moTa: string;
}

class RoleService {
    async getAllRoles() {
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
            throw new Error(err.message || 'Không thể lấy danh sách vai trò');
        }
        return res.json();
    }

    async updateRole(maVaiTro: string, data: Role) {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/${maVaiTro}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Cập nhật vai trò thất bại');
        }
        return res.json();
    }
}

const roleService = new RoleService();
export default roleService; 