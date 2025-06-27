"use client";

import { useEffect, useState } from "react";
import classSectionService, { ClassSection } from "../../services/classSectionService";

export default function TeacherSchedule() {
    const [classSections, setClassSections] = useState<ClassSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const maGiangVien = localStorage.getItem("maNguoiDung") || "";
                if (!maGiangVien) {
                    setError("Không tìm thấy mã giảng viên trong localStorage");
                    setLoading(false);
                    return;
                }
                const data = await classSectionService.getClassSectionsByTeacher(maGiangVien);
                setClassSections(data);
            } catch (err: any) {
                setError(err.message || "Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Lịch giảng dạy của tôi</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading ? (
                    <div className="text-blue-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border rounded-lg overflow-hidden">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2">Mã lớp HP</th>
                                    <th className="px-4 py-2">Tên lớp HP</th>
                                    <th className="px-4 py-2">Thời gian bắt đầu</th>
                                    <th className="px-4 py-2">Thời gian kết thúc</th>
                                    <th className="px-4 py-2">Phòng học</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classSections.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">Không có lịch giảng dạy nào</td>
                                    </tr>
                                ) : (
                                    classSections.map((cls) => (
                                        <tr key={cls.maLopHP} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 font-mono">{cls.maLopHP}</td>
                                            <td className="px-4 py-2">{cls.tenLopHP}</td>
                                            <td className="px-4 py-2">{cls.thoiGianBatDau}</td>
                                            <td className="px-4 py-2">{cls.thoiGianKetThuc}</td>
                                            <td className="px-4 py-2">{cls.phongHoc}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
} 