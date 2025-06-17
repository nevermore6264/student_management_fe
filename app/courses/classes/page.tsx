/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import classSectionService, { ClassSection } from '../../services/classSectionService';

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await classSectionService.getAllClassSections();
                setClasses(data);
            } catch (err: any) {
                setError(err.message || 'Có lỗi xảy ra');
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    return (
        <div className="w-4/5 max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg mt-12 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">Danh sách lớp học phần</h1>
            {error && <div className="mb-4 text-red-600 font-semibold">{error}</div>}
            {loading ? (
                <div className="text-center py-8 text-blue-500 font-semibold">Đang tải dữ liệu...</div>
            ) : (
                <div className="overflow-x-auto w-full">
                    <table className="w-full border rounded-lg overflow-hidden">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2">Mã lớp HP</th>
                                <th className="px-4 py-2">Tên lớp HP</th>
                                <th className="px-4 py-2">Số lượng</th>
                                <th className="px-4 py-2">Giảng viên</th>
                                <th className="px-4 py-2">Thời gian bắt đầu</th>
                                <th className="px-4 py-2">Thời gian kết thúc</th>
                                <th className="px-4 py-2">Phòng học</th>
                                <th className="px-4 py-2">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map(lop => (
                                <tr key={lop.maLopHP} className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 font-mono">{lop.maLopHP}</td>
                                    <td className="px-4 py-2">{lop.tenLopHP}</td>
                                    <td className="px-4 py-2">{lop.soLuong}</td>
                                    <td className="px-4 py-2">{lop.giangVien}</td>
                                    <td className="px-4 py-2">{new Date(lop.thoiGianBatDau).toLocaleString()}</td>
                                    <td className="px-4 py-2">{new Date(lop.thoiGianKetThuc).toLocaleString()}</td>
                                    <td className="px-4 py-2">{lop.phongHoc}</td>
                                    <td className="px-4 py-2">{lop.trangThai ? 'Hoạt động' : 'Ngừng'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 