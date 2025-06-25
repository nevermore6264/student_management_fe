"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Message } from "primereact/message";

interface Overview {
    tongSoSinhVien: number;
    diemTrungBinh: number;
    soLuongDat: number;
    soLuongKhongDat: number;
}

export default function ClassOverviewPage() {
    const { maLopHP } = useParams();
    const [overview, setOverview] = useState<Overview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!maLopHP) return;
        setLoading(true);
        fetch(`/api/lophocphan/${maLopHP}/tongquan`)
            .then((res) => res.json())
            .then((data) => {
                setOverview(data.data || null);
                setError("");
            })
            .catch(() => setError("Không thể tải tổng quan lớp học phần"))
            .finally(() => setLoading(false));
    }, [maLopHP]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Tổng quan điểm lớp học phần</h1>
            {error && <Message severity="error" text={error} className="mb-4" />}
            {overview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg shadow">
                        <div className="font-semibold">Tổng số sinh viên</div>
                        <div className="text-2xl font-bold text-blue-700">{overview.tongSoSinhVien}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg shadow">
                        <div className="font-semibold">Điểm trung bình</div>
                        <div className="text-2xl font-bold text-green-700">{overview.diemTrungBinh}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg shadow">
                        <div className="font-semibold">Số lượng đạt</div>
                        <div className="text-2xl font-bold text-yellow-700">{overview.soLuongDat}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg shadow">
                        <div className="font-semibold">Số lượng không đạt</div>
                        <div className="text-2xl font-bold text-red-700">{overview.soLuongKhongDat}</div>
                    </div>
                </div>
            )}
        </div>
    );
} 