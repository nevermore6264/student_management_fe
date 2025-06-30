"use client";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

interface RegistrationReport {
    maLopHP: string;
    tenLopHP: string;
    tenHocPhan: string;
    soTinChi: number;
    soLuongDangKy: number;
    giangVien: string;
}

const sampleData: RegistrationReport[] = [
    {
        maLopHP: "INT1234A",
        tenLopHP: "Lập trình Web - Nhóm 1",
        tenHocPhan: "Lập trình Web",
        soTinChi: 3,
        soLuongDangKy: 45,
        giangVien: "Nguyễn Văn A",
    },
    {
        maLopHP: "INT1235B",
        tenLopHP: "Cơ sở dữ liệu - Nhóm 2",
        tenHocPhan: "Cơ sở dữ liệu",
        soTinChi: 3,
        soLuongDangKy: 38,
        giangVien: "Trần Thị B",
    },
];

export default function RegistrationReportPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Khi có API, thay sampleData bằng state và fetch API
    const filteredData = sampleData.filter(
        (item) =>
            item.maLopHP.toLowerCase().includes(search.toLowerCase()) ||
            item.tenLopHP.toLowerCase().includes(search.toLowerCase()) ||
            item.tenHocPhan.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Báo cáo đăng ký học phần</h1>
            {error && <div className="mb-4 w-full text-center text-red-500 font-semibold">{error}</div>}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm theo mã lớp, tên lớp, tên học phần..."
                        className="w-full"
                    />
                </div>
            </div>
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2">Mã lớp HP</th>
                                <th className="px-4 py-2">Tên lớp HP</th>
                                <th className="px-4 py-2">Tên học phần</th>
                                <th className="px-4 py-2">Số tín chỉ</th>
                                <th className="px-4 py-2">Số lượng đăng ký</th>
                                <th className="px-4 py-2">Giảng viên</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        Không có dữ liệu phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.maLopHP} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{row.maLopHP}</td>
                                        <td className="px-4 py-2">{row.tenLopHP}</td>
                                        <td className="px-4 py-2">{row.tenHocPhan}</td>
                                        <td className="px-4 py-2">{row.soTinChi}</td>
                                        <td className="px-4 py-2">{row.soLuongDangKy}</td>
                                        <td className="px-4 py-2">{row.giangVien}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 