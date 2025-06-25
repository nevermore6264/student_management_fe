"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function ClassReportPage() {
    const { maLopHP } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleExport = async () => {
        if (!maLopHP) return;
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch(`/api/lophocphan/${maLopHP}/baocao`);
            if (!res.ok) throw new Error("Không thể xuất báo cáo");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `baocao_lophocphan_${maLopHP}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setSuccess("Xuất báo cáo thành công!");
        } catch {
            setError("Không thể xuất báo cáo");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Xuất báo cáo điểm lớp học phần</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {success && <Message severity="success" text={success} className="mb-4" />}
            <Button label="Xuất báo cáo" icon="pi pi-download" loading={loading} onClick={handleExport} className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm" />
        </div>
    );
} 