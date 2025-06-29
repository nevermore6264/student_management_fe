/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
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
        // Only allow selecting active periods
        if (isPeriodActive(period)) {
            setSelectedPeriod(period);
        } else if (isPeriodUpcoming(period)) {
            // For upcoming periods, show info but don't select
            setSelectedPeriod(period);
            showToast('info', 'Thông báo', 'Đợt đăng ký này chưa mở. Bạn có thể xem thông tin chi tiết.');
        } else {
            // For expired/closed periods, show info but don't select
            setSelectedPeriod(period);
            showToast('warn', 'Cảnh báo', 'Đợt đăng ký này không khả dụng.');
        }
    };

    const handleContinue = () => {
        if (!selectedPeriod) {
            showToast('warn', 'Cảnh báo', 'Vui lòng chọn một đợt đăng ký');
            return;
        }

        // Check if period is active
        if (!isPeriodActive(selectedPeriod)) {
            if (isPeriodUpcoming(selectedPeriod)) {
                showToast('info', 'Thông báo', 'Đợt đăng ký này chưa mở. Vui lòng chờ đến thời gian bắt đầu.');
            } else {
                showToast('error', 'Lỗi', 'Đợt đăng ký này không khả dụng.');
            }
            return;
        }

        // Navigate to registration page with selected period
        router.push(`/registration?period=${selectedPeriod.maDotDK}`);
    };

    const getTimeUntilStart = (startDate: string) => {
        const now = new Date();
        const start = new Date(startDate);
        const diff = start.getTime() - now.getTime();

        if (diff <= 0) return null;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days} ngày ${hours} giờ`;
        if (hours > 0) return `${hours} giờ ${minutes} phút`;
        return `${minutes} phút`;
    };

    const getActionButton = () => {
        if (!selectedPeriod) return null;

        if (isPeriodActive(selectedPeriod)) {
            return (
                <Button
                    label="Tiếp tục với đợt đăng ký đã chọn"
                    icon="pi pi-arrow-right"
                    className="p-button-success p-button-lg"
                    onClick={handleContinue}
                    size="large"
                />
            );
        } else if (isPeriodUpcoming(selectedPeriod)) {
            const timeUntilStart = getTimeUntilStart(selectedPeriod.ngayGioBatDau);
            return (
                <div className="text-center">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center space-x-2 text-yellow-800 mb-2">
                            <i className="pi pi-clock text-lg"></i>
                            <span className="font-semibold">Đợt đăng ký chưa mở</span>
                        </div>
                        {timeUntilStart && (
                            <p className="text-yellow-700">
                                Còn <span className="font-bold">{timeUntilStart}</span> nữa sẽ mở đăng ký
                            </p>
                        )}
                        <p className="text-yellow-600 text-sm mt-2">
                            Bắt đầu: {formatDate(selectedPeriod.ngayGioBatDau)}
                        </p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-center space-x-2 text-red-800 mb-2">
                            <i className="pi pi-times-circle text-lg"></i>
                            <span className="font-semibold">Đợt đăng ký không khả dụng</span>
                        </div>
                        <p className="text-red-700">
                            Đợt đăng ký này đã kết thúc hoặc bị đóng
                        </p>
                    </div>
                </div>
            );
        }
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
        if (!period.trangThai) return { text: 'Đã đóng', color: 'text-red-600', bgColor: 'bg-red-100', icon: 'pi-times-circle' };
        if (isPeriodActive(period)) return { text: 'Đang mở', color: 'text-green-600', bgColor: 'bg-green-100', icon: 'pi-check-circle' };
        if (isPeriodUpcoming(period)) return { text: 'Sắp mở', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: 'pi-clock' };
        if (isPeriodExpired(period)) return { text: 'Đã kết thúc', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: 'pi-calendar-times' };
        return { text: 'Không xác định', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: 'pi-question-circle' };
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải danh sách đợt đăng ký...</h3>
                    <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Toast ref={toast} />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-600 rounded-lg p-3">
                                <i className="pi pi-calendar text-white text-2xl"></i>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Chọn đợt đăng ký</h1>
                                <p className="text-gray-600 mt-1">Vui lòng chọn đợt đăng ký học phần bạn muốn tham gia</p>
                            </div>
                        </div>
                        <Button
                            icon="pi pi-refresh"
                            label="Làm mới"
                            className="p-button-outlined p-button-secondary"
                            onClick={loadRegistrationPeriods}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {registrationPeriods.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <i className="pi pi-calendar-times text-4xl text-gray-400"></i>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Không có đợt đăng ký nào</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Hiện tại không có đợt đăng ký nào được thiết lập. Vui lòng liên hệ với phòng đào tạo để biết thêm thông tin.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Period Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {registrationPeriods.map((period) => {
                                const status = getPeriodStatus(period);
                                const isSelected = selectedPeriod?.maDotDK === period.maDotDK;
                                const canSelect = period.trangThai && (isPeriodActive(period) || isPeriodUpcoming(period));

                                return (
                                    <div
                                        key={period.maDotDK}
                                        className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${isSelected ? 'ring-4 ring-blue-500 shadow-2xl' : 'hover:shadow-xl'
                                            } ${!canSelect ? 'opacity-75' : ''}`}
                                        onClick={() => canSelect && handleSelectPeriod(period)}
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${status.bgColor} ${status.color} flex items-center space-x-1`}>
                                            <i className={`pi ${status.icon}`}></i>
                                            <span>{status.text}</span>
                                        </div>

                                        {/* Card Content */}
                                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                            <div className="p-6">
                                                {/* Header */}
                                                <div className="mb-4">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                        {period.tenDotDK}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <i className="pi pi-building mr-2"></i>
                                                        <span>{period.tenKhoa}</span>
                                                    </div>
                                                </div>

                                                {/* Time Information */}
                                                <div className="space-y-3 mb-4">
                                                    <div className="flex items-start space-x-3">
                                                        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                                            <i className="pi pi-calendar-plus text-green-600"></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Bắt đầu</p>
                                                            <p className="text-sm text-gray-600">{formatDate(period.ngayGioBatDau)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start space-x-3">
                                                        <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                                                            <i className="pi pi-calendar-minus text-red-600"></i>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-700">Kết thúc</p>
                                                            <p className="text-sm text-gray-600">{formatDate(period.ngayGioKetThuc)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                {period.moTa && (
                                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                                        <p className="text-sm text-gray-700 italic">&ldquo;{period.moTa}&rdquo;</p>
                                                    </div>
                                                )}

                                                {/* Selection Indicator */}
                                                {isSelected && (
                                                    <div className="flex items-center justify-center space-x-2 text-green-600 font-medium">
                                                        <i className="pi pi-check-circle text-lg"></i>
                                                        <span>Đã chọn</span>
                                                    </div>
                                                )}

                                                {/* Disabled Overlay */}
                                                {!canSelect && (
                                                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-xl flex items-center justify-center">
                                                        <span className="text-gray-600 font-medium">Không khả dụng</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Period Action + Summary */}
                        {selectedPeriod && (
                            <div className="flex flex-col items-center mt-8">
                                {getActionButton()}
                                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 w-full max-w-3xl mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                        <i className="pi pi-info-circle text-blue-600 mr-2"></i>
                                        Đợt đăng ký đã chọn
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Tên đợt</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedPeriod.tenDotDK}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Khoa</p>
                                            <p className="text-lg font-semibold text-gray-900">{selectedPeriod.tenKhoa}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPeriodStatus(selectedPeriod).bgColor} ${getPeriodStatus(selectedPeriod).color}`}>
                                                <i className={`pi ${getPeriodStatus(selectedPeriod).icon} mr-1`}></i>
                                                {getPeriodStatus(selectedPeriod).text}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
} 