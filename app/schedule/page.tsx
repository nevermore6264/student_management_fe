/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import registrationService, { Registration } from "../services/registrationService";
import scheduleService from "../services/scheduleService";
import type { Schedule } from "../services/scheduleService";
import { Scheduler } from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.light.css";

function mapSchedulesToDxEvents(schedules: Array<{ schedule: Schedule, registration: Registration }>) {
    // Map tiết/thứ sang thời gian thực tế (giả định tiết 1: 7h, mỗi tiết 50 phút)
    const tietToTime = (tiet: number) => {
        const startHour = 7 + Math.floor((tiet - 1) * 50 / 60);
        const startMin = ((tiet - 1) * 50) % 60;
        return { hour: startHour, min: startMin };
    };
    const events: any[] = [];
    schedules.forEach(({ schedule, registration }) => {
        const dayIdx = (schedule.thu ?? 2) - 1; // 1=Thứ 2
        if (dayIdx < 0 || dayIdx > 6) return;
        const start = tietToTime(schedule.tietBatDau ?? 1);
        const endTiet = (schedule.tietBatDau ?? 1) + (schedule.soTiet ?? 1) - 1;
        const end = tietToTime(endTiet + 1);
        // Tìm ngày thứ đầu tuần hiện tại
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
        const startDate = new Date(monday);
        startDate.setDate(monday.getDate() + (dayIdx));
        startDate.setHours(start.hour, start.min, 0, 0);
        const endDate = new Date(monday);
        endDate.setDate(monday.getDate() + (dayIdx));
        endDate.setHours(end.hour, end.min, 0, 0);
        events.push({
            text: `${registration.tenLopHP} (${registration.maLopHP})\n${registration.phongHoc}`,
            startDate,
            endDate,
            room: registration.phongHoc,
            lop: registration.tenLopHP,
            lecturer: registration.giangVien,
        });
    });
    return events;
}

function CustomAppointment({ data }: any) {
    const getEventTitle = () =>
        data.text || data.lop || data.title ||
        data.appointmentData?.text || data.appointmentData?.lop || data.appointmentData?.title ||
        "Không có tên lớp";

    const getLecturer = () =>
        data.lecturer || data.appointmentData?.lecturer || "";

    return (
        <div
            style={{
                background: '#10b981',
                color: '#fff',
                borderRadius: '0.5rem',
                fontWeight: 500,
                padding: 8,
                whiteSpace: 'pre-line',
                boxShadow: '0 2px 8px 0 rgba(16,185,129,0.10)',
                fontSize: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
            }}
        >
            <div>{getEventTitle()}</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>
                {(data.startDate && data.endDate)
                    ? `${new Date(data.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(data.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : ""}
            </div>
            {getLecturer() && (
                <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>
                    GV: {getLecturer()}
                </div>
            )}
        </div>
    );
}

export default function Schedule() {
    const [schedules, setSchedules] = useState<Array<{ schedule: Schedule, registration: Registration }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");
            try {
                const maSinhVien = localStorage.getItem("maNguoiDung") || "";
                if (!maSinhVien) {
                    setError("Không tìm thấy mã sinh viên trong localStorage");
                    setLoading(false);
                    return;
                }

                // Lấy danh sách các lớp học phần đã đăng ký
                const registeredClasses = await registrationService.getRegisteredClasses(maSinhVien);
                const allSchedules: Array<{ schedule: Schedule, registration: Registration }> = [];

                await Promise.all(
                    registeredClasses.map(async (registration) => {
                        try {
                            const tkbList = await scheduleService.getByLopHocPhan(registration.maLopHP);
                            tkbList.forEach((tkb) => {
                                allSchedules.push({ schedule: tkb, registration });
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

    const events = useMemo(() => mapSchedulesToDxEvents(schedules), [schedules]);

    // Việt hóa header DevExtreme Scheduler
    useEffect(() => {
        const viLabels = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
        const timer = setTimeout(() => {
            document.querySelectorAll('.dx-scheduler-header-panel-cell').forEach((el, idx) => {
                if (viLabels[idx]) el.textContent = viLabels[idx];
            });
            document.querySelectorAll('.dx-scheduler-time-panel-cell').forEach(el => {
                if (el.textContent && el.textContent.match(/\d{1,2}:\d{2}/)) {
                    el.textContent = el.textContent.replace(':00', '') + 'h';
                }
            });
        }, 300);
        return () => clearTimeout(timer);
    }, [events]);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card" style={{ borderRadius: '1rem', boxShadow: '0 4px 24px 0 rgba(30,64,175,0.10)', overflow: 'hidden', background: '#fff' }}>
                <h1 className="text-2xl font-bold mb-4 text-blue-700">Lịch học của tôi</h1>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading ? (
                    <div className="text-blue-500">Đang tải dữ liệu...</div>
                ) : (
                    <Scheduler
                        dataSource={events}
                        views={[{ type: "week", name: "Tuần" }]}
                        defaultCurrentView="week"
                        defaultCurrentDate={new Date()}
                        height={600}
                        startDayHour={7}
                        endDayHour={18}
                        firstDayOfWeek={1}
                        showAllDayPanel={false}
                        cellDuration={60}
                        showCurrentTimeIndicator={true}
                        groups={[]}
                        crossScrollingEnabled={true}
                        style={{ background: 'transparent' }}
                        appointmentComponent={CustomAppointment}
                    />
                )}
            </div>
        </div>
    );
} 