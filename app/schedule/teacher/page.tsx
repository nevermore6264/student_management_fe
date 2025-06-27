/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import classSectionService, { ClassSection } from "../../services/classSectionService";
import scheduleService, { Schedule } from "../../services/scheduleService";
import Timetable from "react-timetable-events";

function mapSchedulesToEvents(schedules: Array<{ schedule: Schedule, classInfo: ClassSection }>) {
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
    schedules.forEach(({ schedule, classInfo }) => {
        const dayIdx = (schedule.thu ?? 2) - 2; // 0=monday
        if (dayIdx < 0 || dayIdx > 6) return;
        const start = tietToTime(schedule.tietBatDau ?? 1);
        const endTiet = (schedule.tietBatDau ?? 1) + (schedule.soTiet ?? 1) - 1;
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
            id: schedule.id + "-" + classInfo.maLopHP,
            name: `${classInfo.tenLopHP} (${classInfo.maLopHP})\n${classInfo.phongHoc}`,
            type: "class",
            startTime: startDate,
            endTime: endDate,
        });
    });
    return events;
}

export default function TeacherSchedule() {
    // const [classSections, setClassSections] = useState<ClassSection[]>([]); // Không dùng nữa
    const [schedules, setSchedules] = useState<Array<{ schedule: Schedule, classInfo: ClassSection }>>([]);
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
                const classSectionsData = await classSectionService.getClassSectionsByTeacher(maGiangVien);
                // setClassSections(classSectionsData); // Không dùng nữa
                // Lấy lịch từng lớp học phần
                const allSchedules: Array<{ schedule: Schedule, classInfo: ClassSection }> = [];
                await Promise.all(
                    classSectionsData.map(async (cls) => {
                        try {
                            const tkbList = await scheduleService.getByLopHocPhan(cls.maLopHP);
                            tkbList.forEach((tkb) => {
                                allSchedules.push({ schedule: tkb, classInfo: cls });
                            });
                        } catch {
                            // Bỏ qua lỗi từng lớp
                        }
                    })
                );
                setSchedules(allSchedules);
            } catch (err: any) {
                setError(err.message || "Không thể tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const events = useMemo(() => mapSchedulesToEvents(schedules), [schedules]);

    // Việt hóa header timetable bằng MutationObserver
    useEffect(() => {
        const dayMap = [
            "Tiết", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"
        ];
        function vietHoaHeader() {
            const headerCells = document.querySelectorAll('.custom-timetable th');
            headerCells.forEach((th, idx) => {
                if (dayMap[idx]) th.textContent = dayMap[idx];
            });
        }
        vietHoaHeader();
        const table = document.querySelector('.custom-timetable table');
        if (!table) return;
        const observer = new MutationObserver(() => {
            vietHoaHeader();
        });
        observer.observe(table, { childList: true, subtree: true });
        return () => observer.disconnect();
    }, [schedules]);

    return (
        <div className="container mx-auto px-4 py-4">
            <style>{`
                .custom-timetable {
                    border-radius: 1rem;
                    box-shadow: 0 4px 24px 0 rgba(30,64,175,0.10);
                    overflow: hidden;
                    background: #fff;
                }
                .custom-timetable table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
                }
                .custom-timetable th {
                    background: #e0e7ff;
                    color: #1e40af;
                    font-weight: 700;
                    padding: 0.75rem 0.5rem;
                    text-align: center;
                    font-size: 1rem;
                }
                .custom-timetable td {
                    padding: 0.5rem;
                    border-bottom: 1px solid #e5e7eb;
                    text-align: center;
                    font-size: 0.95rem;
                }
                .custom-timetable tr:hover td {
                    background: #f0f6ff;
                }
                .custom-timetable .event {
                    background: #3b82f6;
                    color: #fff;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 2px 8px 0 rgba(59,130,246,0.10);
                }

         
                .custom-timetable th {
                    position: relative;
                }
                .custom-timetable th[data-day="monday"]::after { content: "Thứ 2"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="tuesday"]::after { content: "Thứ 3"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="wednesday"]::after { content: "Thứ 4"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="thursday"]::after { content: "Thứ 5"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="friday"]::after { content: "Thứ 6"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="saturday"]::after { content: "Thứ 7"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day="sunday"]::after { content: "Chủ nhật"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-time]::after { content: "Tiết"; position: absolute; left: 0; right: 0; top: 0; bottom: 0; color: #1e40af; font-weight: 700; background: #e0e7ff; z-index: 2; }
                .custom-timetable th[data-day], .custom-timetable th[data-time] { color: transparent !important; }
                `}
            </style>
            <div className="card custom-timetable">
                <h1 className="text-2xl font-bold mb-4 text-blue-700">Lịch giảng dạy của tôi</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading ? (
                    <div className="text-blue-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Timetable
                            events={events}
                            hoursInterval={{ from: 7, to: 18 }}
                            style={{ height: 600, background: 'transparent' }}
                        />
                    </div>
                )}
            </div>
        </div >
    );
} 