const API_BASE = 'http://localhost:8080/api/admin/reports';

export interface ThongKeTongQuan {
    tongSoSinhVien: number;
    tongSoGiangVien: number;
    tongSoLopHocPhan: number;
    tongSoHocPhan: number;
    tongSoKhoa: number;
    tongSoLop: number;
    tyLeDangKyTrungBinh: number;
    diemTrungBinhToanTruong: number;
}

export interface ThongKeTheoKhoa {
    maKhoa: string;
    tenKhoa: string;
    soSinhVien: number;
    soGiangVien: number;
    soLopHocPhan: number;
    soHocPhan: number;
    diemTrungBinh: number;
    tyLeDangKy: number;
}

export interface PhanBoDiem {
    soSinhVienDiemDuoi4: number;
    soSinhVienDiem4Den55: number;
    soSinhVienDiem55Den7: number;
    soSinhVienDiem7Den85: number;
    soSinhVienDiem85Den10: number;
    xepLoai: {
        A: number;
        B: number;
        C: number;
    };
}

export interface TopGiangVien {
    maGiangVien: string;
    tenGiangVien: string;
    tenKhoa: string;
    soLopPhuTrach: number;
    tongSoSinhVien: number;
    diemTrungBinh: number;
}

export interface TopSinhVien {
    maSinhVien: string;
    hoTenSinhVien: string;
    tenLop: string;
    tenKhoa: string;
    diemTrungBinh: number;
    soTinChiHoanThanh: number;
}

export interface ThongKeDangKy {
    tongSoDangKy: number;
    soDangKyThanhCong: number;
    soDangKyThatBai: number;
    tyLeThanhCong: number;
    dangKyTheoHocPhan: Record<string, number>;
}

export interface ThongKeTheoHocKy {
    hocKy: string;
    namHoc: string;
    soLopHocPhan: number;
    soSinhVienDangKy: number;
    diemTrungBinh: number;
    tyLeDangKy: number;
}

export interface AdminReportResponse {
    thongKeTongQuan: ThongKeTongQuan;
    thongKeTheoKhoa: ThongKeTheoKhoa[];
    phanBoDiem: PhanBoDiem;
    topGiangVien: TopGiangVien[];
    topSinhVien: TopSinhVien[];
    thongKeDangKy: ThongKeDangKy;
    thongKeTheoHocKy: ThongKeTheoHocKy[];
}

class AdminReportService {
    private getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
        };
    }

    async getTongHopBaoCao(): Promise<AdminReportResponse> {
        const res = await fetch(`${API_BASE}/tonghop`, {
            method: 'GET',
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Không thể lấy báo cáo tổng hợp');
        return data.data;
    }
}

const adminReportService = new AdminReportService();
export default adminReportService; 