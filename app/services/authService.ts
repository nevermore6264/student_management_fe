const API_BASE = 'http://localhost:8080/api/auth';

export interface RegisterPayload {
    tenNguoiDung: string;
    email: string;
    matKhau: string;
    soDienThoai: string;
    diaChi: string;
}

export interface LoginPayload {
    email: string;
    matKhau: string;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    code: string;
    newPassword: string;
}

class AuthService {
    async register(data: RegisterPayload) {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Đăng ký thất bại');
        }
        return res.json();
    }

    async login(data: LoginPayload) {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Đăng nhập thất bại');
        }
        return res.json();
    }

    async forgotPassword(data: ForgotPasswordPayload) {
        const res = await fetch(`${API_BASE}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Gửi mã xác thực thất bại');
        }
        return res.json();
    }

    async resetPassword(data: ResetPasswordPayload) {
        const res = await fetch(`${API_BASE}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Đặt lại mật khẩu thất bại');
        }
        return res.json();
    }
}

const authService = new AuthService();
export default authService; 