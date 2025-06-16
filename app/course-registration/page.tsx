'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';

interface Course {
    id: string;
    code: string;
    name: string;
    credits: number;
    lecturer: string;
    schedule: string;
    capacity: number;
    registered: number;
}

export default function CourseRegistration() {
    const [courses] = useState<Course[]>([
        {
            id: '1',
            code: 'INT1234',
            name: 'Lập trình Web',
            credits: 3,
            lecturer: 'Nguyễn Văn A',
            schedule: 'Thứ 2, Tiết 1-3',
            capacity: 50,
            registered: 30
        },
        {
            id: '2',
            code: 'INT1235',
            name: 'Cơ sở dữ liệu',
            credits: 3,
            lecturer: 'Trần Thị B',
            schedule: 'Thứ 3, Tiết 4-6',
            capacity: 45,
            registered: 35
        },
        // Add more sample courses here
    ]);

    const actionTemplate = (rowData: Course) => {
        return (
            <Button
                icon="pi pi-plus"
                className="p-button-rounded p-button-success"
                tooltip="Đăng ký"
                tooltipOptions={{ position: 'top' }}
            />
        );
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Đăng ký tín chỉ</h1>

                <div className="flex justify-content-between mb-4">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText placeholder="Tìm kiếm môn học..." />
                    </span>
                    <Button label="Xem môn đã đăng ký" icon="pi pi-list" />
                </div>

                <DataTable
                    value={courses}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    className="p-datatable-sm"
                    emptyMessage="Không tìm thấy môn học nào"
                >
                    <Column field="code" header="Mã môn" sortable />
                    <Column field="name" header="Tên môn học" sortable />
                    <Column field="credits" header="Số tín chỉ" sortable />
                    <Column field="lecturer" header="Giảng viên" sortable />
                    <Column field="schedule" header="Lịch học" sortable />
                    <Column
                        field="registered"
                        header="Đã đăng ký"
                        sortable
                        body={(rowData) => `${rowData.registered}/${rowData.capacity}`}
                    />
                    <Column body={actionTemplate} style={{ width: '4rem' }} />
                </DataTable>
            </div>
        </div>
    );
} 