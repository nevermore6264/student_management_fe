"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Message } from "primereact/message";

interface Student {
    maSinhVien: string;
    tenSinhVien: string;
    email: string;
    lop: string;
}

export default function ClassStudentsPage() {
    const { maLopHP } = useParams();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!maLopHP) return;
        setLoading(true);
        fetch(`/api/lophocphan/${maLopHP}/sinhvien`)
            .then((res) => res.json())
            .then((data) => {
                setStudents(data.data || []);
                setError("");
            })
            .catch(() => setError("Không thể tải danh sách sinh viên"))
            .finally(() => setLoading(false));
    }, [maLopHP]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Danh sách sinh viên lớp học phần</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            <DataTable value={students} loading={loading} paginator rows={10} emptyMessage="Không có sinh viên">
                <Column field="maSinhVien" header="Mã SV" sortable />
                <Column field="tenSinhVien" header="Tên sinh viên" sortable />
                <Column field="email" header="Email" />
                <Column field="lop" header="Lớp" />
            </DataTable>
        </div>
    );
} 