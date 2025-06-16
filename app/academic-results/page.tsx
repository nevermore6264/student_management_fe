'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';

interface AcademicResult {
    id: string;
    courseCode: string;
    courseName: string;
    credits: number;
    midtermGrade: number;
    finalGrade: number;
    averageGrade: number;
    letterGrade: string;
}

export default function AcademicResults() {
    const [results] = useState<AcademicResult[]>([
        {
            id: '1',
            courseCode: 'INT1234',
            courseName: 'Lập trình Web',
            credits: 3,
            midtermGrade: 8.5,
            finalGrade: 9.0,
            averageGrade: 8.8,
            letterGrade: 'A'
        },
        {
            id: '2',
            courseCode: 'INT1235',
            courseName: 'Cơ sở dữ liệu',
            credits: 3,
            midtermGrade: 7.5,
            finalGrade: 8.0,
            averageGrade: 7.8,
            letterGrade: 'B+'
        }
    ]);

    const chartData = {
        labels: ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
        datasets: [
            {
                data: [2, 3, 1, 0, 1, 0, 0, 0],
                backgroundColor: [
                    '#4CAF50',
                    '#8BC34A',
                    '#CDDC39',
                    '#FFEB3B',
                    '#FFC107',
                    '#FF9800',
                    '#FF5722',
                    '#F44336'
                ]
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="card">
                <h1 className="text-2xl font-bold mb-4">Kết quả học tập</h1>

                <div className="grid">
                    <div className="col-12 md:col-8">
                        <DataTable
                            value={results}
                            className="p-datatable-sm"
                            emptyMessage="Không có kết quả học tập nào"
                        >
                            <Column field="courseCode" header="Mã môn" sortable />
                            <Column field="courseName" header="Tên môn học" sortable />
                            <Column field="credits" header="Số tín chỉ" sortable />
                            <Column field="midtermGrade" header="Điểm giữa kỳ" sortable />
                            <Column field="finalGrade" header="Điểm cuối kỳ" sortable />
                            <Column field="averageGrade" header="Điểm trung bình" sortable />
                            <Column field="letterGrade" header="Xếp loại" sortable />
                        </DataTable>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="card">
                            <h2 className="text-xl font-bold mb-4">Thống kê điểm</h2>
                            <Chart type="pie" data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 