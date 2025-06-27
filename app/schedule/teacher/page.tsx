/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import classSectionService, { ClassSection } from "../../services/classSectionService";
import Timetable from "react-timetable-events";

function mapClassSectionsToEvents(classSections: ClassSection[]) {
    // Map các tiết học sang thời gian thực tế (giả định tiết 1: 7h, mỗi tiết 50 phút)
    const tietToTime = (tiet: number) => {
        const startHour = 7 + Math.floor((tiet - 1) * 50 / 60);
        const startMin = ((tiet - 1) * 50) % 60;
        return { hour: startHour, min: startMin };
    };
    type EventsType = {
        [key: string]: Array<{
            id: string;
            name: string;
            type: string;
            startTime: Date;
            endTime: Date;
        }>;
    };
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const events: EventsType = {
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: []
    };
    classSections.forEach(cls => {
        // cls.thu: 2=Thứ 2, 3=Thứ 3,..., 8=Chủ nhật
        const dayIdx = (cls.thu ?? 2) - 2; // 0=monday
        if (dayIdx < 0 || dayIdx > 6) return;
        const start = tietToTime((cls as any).tietBatDau ?? 1);
        const endTiet = ((cls as any).tietBatDau ?? 1) + ((cls as any).soTiet ?? 1) - 1;
        const end = tietToTime(endTiet + 1); // kết thúc sau tiết cuối 10 phút
        const today = new Date();
        // Đặt ngày đúng thứ trong tuần hiện tại
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay() + (dayIdx + 1));
        startDate.setHours(start.hour, start.min, 0, 0);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() - today.getDay() + (dayIdx + 1));
        endDate.setHours(end.hour, end.min, 0, 0);
        events[days[dayIdx]].push({
            id: cls.maLopHP,
            name: `${cls.tenLopHP} (${cls.maLopHP})\n${cls.phongHoc}`,
            type: "class",
            startTime: startDate,
            endTime: endDate,
        });
    });
    return events;
}

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

    const events = useMemo(() => mapClassSectionsToEvents(classSections), [classSections]);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Lịch giảng dạy của tôi</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading ? (
                    <div className="text-blue-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Timetable
                            events={events}
                            hoursInterval={{ from: 7, to: 18 }}
                            style={{ height: 600 }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
} 