'use client';

import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

interface ScheduleItem {
    id: string;
    courseCode: string;
    courseName: string;
    day: string;
    period: string;
    room: string;
    lecturer: string;
}

export default function Schedule() {
    const [date, setDate] = useState<Date | null>(null);
    const [schedule] = useState<ScheduleItem[]>([
        {
            id: '1',
            courseCode: 'INT1234',
            courseName: 'Lập trình Web',
            day: 'Thứ 2',
            period: 'Tiết 1-3',
            room: 'A101',
            lecturer: 'Nguyễn Văn A'
        },
        {
            id: '2',
            courseCode: 'INT1235',
            courseName: 'Cơ sở dữ liệu',
            day: 'Thứ 3',
            period: 'Tiết 4-6',
            room: 'B203',
            lecturer: 'Trần Thị B'
        }
    ]);

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Lịch học</h1>

                <div className="flex justify-content-between mb-4">
                    <div className="flex align-items-center gap-2">
                        <span className="font-semibold">Học kỳ:</span>
                        <select className="p-inputtext">
                            <option>Học kỳ 1 - Năm học 2023-2024</option>
                            <option>Học kỳ 2 - Năm học 2023-2024</option>
                        </select>
                    </div>
                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value)}
                        showIcon
                        placeholder="Chọn ngày"
                    />
                </div>

                <DataTable
                    value={schedule}
                    className="p-datatable-sm"
                    emptyMessage="Không có lịch học nào"
                >
                    <Column field="day" header="Thứ" sortable />
                    <Column field="period" header="Tiết học" sortable />
                    <Column field="courseCode" header="Mã môn" sortable />
                    <Column field="courseName" header="Tên môn học" sortable />
                    <Column field="room" header="Phòng học" sortable />
                    <Column field="lecturer" header="Giảng viên" sortable />
                </DataTable>
            </div>
        </div>
    );
} 