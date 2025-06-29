'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import registrationService, { RegistrationPeriod } from '../../services/registrationService';

export default function SelectRegistrationPeriodPage() {
    const [loading, setLoading] = useState(true);
    const [registrationPeriods, setRegistrationPeriods] = useState<RegistrationPeriod[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<RegistrationPeriod | null>(null);
    const toast = useRef<Toast>(null);
    const router = useRouter();

    useEffect(() => {
        loadRegistrationPeriods();
    }, []);

    const loadRegistrationPeriods = async () => {
        try {
            setLoading(true);
            const periods = await registrationService.getAllRegistrationPeriods();
            setRegistrationPeriods(Array.isArray(periods) ? periods : []);
        } catch (error: unknown) {
            console.error('Error loading registration periods:', error);
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách đợt đăng ký';
            showToast('error', 'Lỗi', errorMessage);
            setRegistrationPeriods([]);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        if (toast.current) {
            toast.current.show({
                severity,
                summary,
                detail,
                life: 3000
            });
        }
    };

    const handleSelectPeriod = (period: RegistrationPeriod) => {
        setSelectedPeriod(period);
    };

    const handleContinue = () => {
        if (!selectedPeriod) {
            showToast('warn', 'Cảnh báo', 'Vui lòng chọn một đợt đăng ký');
            return;
        }

        // Navigate to registration page with selected period
        router.push(`/registration?period=${selectedPeriod.maDotDK}`);
    };

    const isPeriodActive = (period: RegistrationPeriod) => {
        const now = new Date();
        const startDate = new Date(period.ngayGioBatDau);
        const endDate = new Date(period.ngayGioKetThuc);
        return period.trangThai && now >= startDate && now <= endDate;
    };

    const isPeriodUpcoming = (period: RegistrationPeriod) => {
        const now = new Date();
        const startDate = new Date(period.ngayGioBatDau);
        return period.trangThai && now < startDate;
    };

    const isPeriodExpired = (period: RegistrationPeriod) => {
        const now = new Date();
        const endDate = new Date(period.ngayGioKetThuc);
        return now > endDate;
    };

    const getPeriodStatus = (period: RegistrationPeriod) => {
        if (!period.trangThai) return { text: 'Đã đóng', color: 'text-red-600', bgColor: 'bg-red-100' };
        if (isPeriodActive(period)) return { text: 'Đang mở', color: 'text-green-600', bgColor: 'bg-green-100' };
        if (isPeriodUpcoming(period)) return { text: 'Sắp mở', color: 'text-blue-600', bgColor: 'bg-blue-100' };
        if (isPeriodExpired(period)) return { text: 'Đã kết thúc', color: 'text-gray-600', bgColor: 'bg-gray-100' };
        return { text: 'Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    };

    if (loading) {
        return (
            <div className="card">
                <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2">Đang tải danh sách đợt đăng ký...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold mr-4">Chọn đợt đăng ký</h1>
                <Button
                    icon="pi pi-refresh"
                    label="Làm mới"
                    className="p-button-outlined"
                    onClick={loadRegistrationPeriods}
                    disabled={loading}
                />
            </div>

            {registrationPeriods.length === 0 ? (
                <div className="text-center py-8">
                    <i className="pi pi-calendar-times" style={{ fontSize: '3rem', color: '#6b7280' }}></i>
                    <h3 className="text-xl font-semibold mt-4 text-gray-600">Không có đợt đăng ký nào</h3>
                    <p className="text-gray-500 mt-2">Hiện tại không có đợt đăng ký nào được thiết lập.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {registrationPeriods.map((period) => {
                        const status = getPeriodStatus(period);
                        const isSelected = selectedPeriod?.maDotDK === period.maDotDK;
                        const canSelect = period.trangThai && (isPeriodActive(period) || isPeriodUpcoming(period));

                        return (
                            <Card
                                key={period.maDotDK}
                                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                    } ${!canSelect ? 'opacity-60' : ''}`}
                                onClick={() => canSelect && handleSelectPeriod(period)}
                            >
                                <div className="p-4">
                                    <div className="flex justify-content-between align-items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {period.tenDotDK}
                                        </h3>
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${status.bgColor} ${status.color}`}>
                                            {status.text}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-content-between">
                                            <span>Bắt đầu:</span>
                                            <span className="font-medium">
                                                {new Date(period.ngayGioBatDau).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span>Kết thúc:</span>
                                            <span className="font-medium">
                                                {new Date(period.ngayGioKetThuc).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <div className="flex justify-content-between">
                                            <span>Khoa:</span>
                                            <span className="font-medium">{period.tenKhoa}</span>
                                        </div>
                                        {period.moTa && (
                                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                                                {period.moTa}
                                            </div>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="mt-3 text-center">
                                            <i className="pi pi-check-circle text-green-600 mr-2"></i>
                                            <span className="text-green-600 font-medium">Đã chọn</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {registrationPeriods.length > 0 && (
                <div className="flex justify-content-center mt-6">
                    <Button
                        label="Tiếp tục"
                        icon="pi pi-arrow-right"
                        className="p-button-success"
                        onClick={handleContinue}
                        disabled={!selectedPeriod}
                    />
                </div>
            )}
        </div>
    );
} 