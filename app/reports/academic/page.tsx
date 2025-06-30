"use client";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

interface AcademicReport {
    maSinhVien: string;
    tenSinhVien: string;
    tongSoTinChi: number;
    diemTrungBinh: number;
    xepLoai: string;
}

const sampleData: AcademicReport[] = [
    {
        maSinhVien: "SV001",
        tenSinhVien: "Nguyễn Văn A",
        tongSoTinChi: 120,
        diemTrungBinh: 3.5,
        xepLoai: "Khá",
    },
    {
        maSinhVien: "SV002",
        tenSinhVien: "Trần Thị B",
        tongSoTinChi: 118,
        diemTrungBinh: 3.8,
        xepLoai: "Giỏi",
    },
];

export default function AcademicReportPage() {
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Khi có API, thay sampleData bằng state và fetch API
    const filteredData = sampleData.filter(
        (item) =>
            item.maSinhVien.toLowerCase().includes(search.toLowerCase()) ||
            item.tenSinhVien.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Báo cáo kết quả học tập</h1>
            {error && <div className="mb-4 w-full text-center text-red-500 font-semibold">{error}</div>}
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full md:w-1/2">
                    <InputText
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm kiếm theo mã sinh viên, tên sinh viên..."
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
                                <th className="px-4 py-2">Mã sinh viên</th>
                                <th className="px-4 py-2">Tên sinh viên</th>
                                <th className="px-4 py-2">Tổng số tín chỉ</th>
                                <th className="px-4 py-2">Điểm trung bình</th>
                                <th className="px-4 py-2">Xếp loại</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Không có dữ liệu phù hợp
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((row) => (
                                    <tr key={row.maSinhVien} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 font-mono">{row.maSinhVien}</td>
                                        <td className="px-4 py-2">{row.tenSinhVien}</td>
                                        <td className="px-4 py-2">{row.tongSoTinChi}</td>
                                        <td className="px-4 py-2">{row.diemTrungBinh}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${row.xepLoai === 'Giỏi' ? 'bg-green-100 text-green-700' : row.xepLoai === 'Khá' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{row.xepLoai}</span>
                                        </td>
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