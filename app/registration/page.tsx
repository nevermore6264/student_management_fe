/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { useRouter, useSearchParams } from 'next/navigation';
import registrationService, { CourseClass, RegistrationPeriod, Registration } from '../services/registrationService';

export default function CourseRegistrationPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);
    const [toastMessage, setToastMessage] = useState<{ severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string } | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod | null>(null);
    const [availableClasses, setAvailableClasses] = useState<CourseClass[]>([]);
    const [registeredClasses, setRegisteredClasses] = useState<Registration[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

    // Mock student ID - in real app this would come from user context/auth
    const maSinhVien = localStorage.getItem('maNguoiDung') || '';

    // Get selected period from URL
    const selectedPeriodId = searchParams.get('period');

    // Check if registration period is currently active
    const isRegistrationActive = () => {
        if (!registrationPeriod) return false;
        const now = new Date();
        const startDate = new Date(registrationPeriod.ngayGioBatDau);
        const endDate = new Date(registrationPeriod.ngayGioKetThuc);
        return registrationPeriod.trangThai && now >= startDate && now <= endDate;
    };

    useEffect(() => {
        loadData();
    }, [selectedPeriodId]);

    // Effect to show toast when toastMessage changes
    useEffect(() => {
        if (toastMessage && toast.current) {
            toast.current.show({
                severity: toastMessage.severity,
                summary: toastMessage.summary,
                detail: toastMessage.detail,
                life: 3000
            });
            setToastMessage(null); // Clear the message after showing
        }
    }, [toastMessage]);

    const loadData = async () => {
        try {
            setLoading(true);
            let period;
            if (selectedPeriodId) {
                period = await registrationService.getRegistrationPeriodById(selectedPeriodId);
            } else {
                period = await registrationService.getCurrentRegistrationPeriod();
            }
            const classes = selectedPeriodId
                ? await registrationService.getAvailableClassesByPeriod(selectedPeriodId)
                : await registrationService.getAvailableClasses();
            const registrations = await registrationService.getRegisteredClasses(maSinhVien);
            setRegistrationPeriod(period || null);
            setAvailableClasses(Array.isArray(classes) ? classes : []);
            setRegisteredClasses(Array.isArray(registrations) ? registrations : []);
        } catch (error: unknown) {
            console.error('Error loading data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu';
            showToast('error', 'Lỗi', errorMessage);
            setRegistrationPeriod(null);
            setAvailableClasses([]);
            setRegisteredClasses([]);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        console.log('Showing toast:', { severity, summary, detail });
        setToastMessage({ severity, summary, detail });
    };

    const actionTemplate = (rowData: CourseClass) => {
        if (!rowData) return null;

        // Check if class is available for registration
        const isClassAvailable = rowData.trangThai &&
            rowData.siSoHienTai < rowData.soLuong &&
            isRegistrationActive();

        // Check if student is already registered for this class
        const isAlreadyRegistered = registeredClasses.some(reg =>
            reg.maLopHP === rowData.maLopHP && reg.trangThai
        );

        if (isClassAvailable && !isAlreadyRegistered) {
            return (
                <Button
                    label="Đăng ký"
                    icon="pi pi-plus"
                    className="p-button-success"
                    onClick={() => {
                        setSelectedClass(rowData);
                        setRegisterDialogVisible(true);
                    }}
                />
            );
        } else if (isAlreadyRegistered) {
            return (
                <span className="text-blue-600 text-sm font-medium">Đã đăng ký</span>
            );
        } else if (!rowData.trangThai) {
            return (
                <span className="text-red-600 text-sm font-medium">Hết chỗ</span>
            );
        } else if (rowData.siSoHienTai >= rowData.soLuong) {
            return (
                <span className="text-red-600 text-sm font-medium">Đầy lớp</span>
            );
        } else if (!isRegistrationActive()) {
            return (
                <span className="text-orange-600 text-sm font-medium">Chưa mở đăng ký</span>
            );
        }

        return null;
    };

    const registeredActionTemplate = (rowData: Registration) => {
        if (!rowData) return null;

        // Only allow cancellation for active registrations during registration period
        const canCancel = rowData.trangThai && isRegistrationActive();

        if (canCancel) {
            return (
                <Button
                    label="Hủy đăng ký"
                    icon="pi pi-times"
                    className="p-button-danger"
                    onClick={() => {
                        setSelectedRegistration(rowData);
                        setCancelDialogVisible(true);
                    }}
                />
            );
        } else if (!rowData.trangThai) {
            return (
                <span className="text-red-600 text-sm font-medium">Đã hủy</span>
            );
        } else if (!isRegistrationActive()) {
            return (
                <span className="text-gray-600 text-sm font-medium">Không thể hủy</span>
            );
        }

        return null;
    };

    const handleRegister = async () => {
        if (!selectedClass) return;

        try {
            const currentTime = new Date().toISOString();
            // Get maPhienDK from registration period if available
            const maPhienDK = registrationPeriod ? parseInt(registrationPeriod.maDotDK.replace(/\D/g, '')) || 1 : 1;

            await registrationService.registerClass({
                maSinhVien,
                maLopHP: selectedClass.maLopHP,
                maPhienDK: maPhienDK,
                thoiGianDangKy: currentTime,
                trangThai: true,
                ketQuaDangKy: 1 // Default to 1 (success)
            });

            console.log('Registration successful, showing toast...');
            setRegisterDialogVisible(false);
            showToast('success', 'Thành công', 'Đăng ký lớp học phần thành công');
            loadData(); // Reload data to update lists
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';

            // Show specific error messages for common cases
            if (errorMessage.includes('đã đăng ký')) {
                showToast('warn', 'Đã đăng ký', 'Bạn đã đăng ký lớp học phần này rồi!');
            } else if (errorMessage.includes('hết chỗ')) {
                showToast('error', 'Hết chỗ', 'Lớp học phần này đã hết chỗ!');
            } else if (errorMessage.includes('đợt đăng ký')) {
                showToast('error', 'Đợt đăng ký', 'Hiện tại không có đợt đăng ký nào đang mở!');
            } else {
                showToast('error', 'Lỗi đăng ký', errorMessage);
            }

            // Don't close dialog on error so user can try again
            console.error('Registration error:', error);
        }
    };

    const handleCancel = async () => {
        if (!selectedRegistration) return;

        try {
            // Get maPhienDK from registration period if available
            const maPhienDK = registrationPeriod ? parseInt(registrationPeriod.maDotDK.replace(/\D/g, '')) || 1 : 1;

            await registrationService.cancelRegistration(
                maPhienDK,
                selectedRegistration.maSinhVien,
                selectedRegistration.maLopHP
            );
            console.log('Cancel successful, showing toast...');
            setCancelDialogVisible(false);
            showToast('success', 'Thành công', 'Hủy đăng ký thành công');
            loadData(); // Reload data to update lists
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Hủy đăng ký thất bại';

            // Show specific error messages for common cases
            if (errorMessage.includes('không tìm thấy')) {
                showToast('error', 'Không tìm thấy', 'Không tìm thấy thông tin đăng ký này!');
            } else if (errorMessage.includes('đã hủy')) {
                showToast('warn', 'Đã hủy', 'Đăng ký này đã được hủy rồi!');
            } else {
                showToast('error', 'Lỗi hủy đăng ký', errorMessage);
            }

            // Don't close dialog on error so user can try again
            console.error('Cancel registration error:', error);
        }
    };

    const filteredAvailableClasses = availableClasses.filter(cls =>
        cls && (
            (cls.tenLopHP?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (cls.tenHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (cls.maLopHP?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (cls.maHocPhan?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        )
    );

    if (loading) {
        return (
            <div className="card">
                <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                    <div className="text-center">
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <Toast ref={toast} />

            <div className="flex justify-content-between align-items-center mb-4">
                <div className="flex align-items-center">
                    <Button
                        icon="pi pi-arrow-left"
                        label="Quay lại"
                        className="p-button-text mr-4"
                        onClick={() => router.push('/registration/select-period')}
                    />

                    <h1 className="text-2xl font-bold ml-4">Đăng ký học phần</h1>
                </div>

            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Đợt đăng ký đã chọn</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-4 py-2 border border-gray-300">Tên đợt đăng ký</th>
                                <th className="px-4 py-2 border border-gray-300">Ngày bắt đầu</th>
                                <th className="px-4 py-2 border border-gray-300">Ngày kết thúc</th>
                                <th className="px-4 py-2 border border-gray-300">Khoa</th>
                                <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!registrationPeriod ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        {selectedPeriodId ? 'Không tìm thấy đợt đăng ký đã chọn' : 'Không có đợt đăng ký nào'}
                                    </td>
                                </tr>
                            ) : (
                                <tr className="border-b hover:bg-blue-50">
                                    <td className="px-4 py-2 border border-gray-300">{registrationPeriod.tenDotDK}</td>
                                    <td className="px-4 py-2 border border-gray-300">{new Date(registrationPeriod.ngayGioBatDau).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-2 border border-gray-300">{new Date(registrationPeriod.ngayGioKetThuc).toLocaleDateString('vi-VN')}</td>
                                    <td className="px-4 py-2 border border-gray-300">{registrationPeriod.tenKhoa}</td>
                                    <td className="px-4 py-2 border border-gray-300">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${isRegistrationActive()
                                            ? 'bg-green-100 text-green-700'
                                            : registrationPeriod.trangThai
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}>
                                            {isRegistrationActive()
                                                ? 'Đang mở'
                                                : registrationPeriod.trangThai
                                                    ? 'Chưa đến thời gian'
                                                    : 'Đã đóng'}
                                        </span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Registration Summary */}
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Thống kê đăng ký</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {registeredClasses.filter(reg => reg.trangThai).length}
                        </div>
                        <div className="text-sm text-gray-600">Lớp đã đăng ký</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {registeredClasses
                                .filter(reg => reg.trangThai)
                                .reduce((total, reg) => total + (reg.soTinChi || 0), 0)
                            }
                        </div>
                        <div className="text-sm text-gray-600">Tổng số tín chỉ</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {isRegistrationActive() ? 'Đang mở' : 'Đã đóng'}
                        </div>
                        <div className="text-sm text-gray-600">Trạng thái đăng ký</div>
                    </div>
                </div>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Lớp học phần có thể đăng ký">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <InputText
                                placeholder="Tìm kiếm lớp học phần..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-300">Mã lớp</th>
                                    <th className="px-4 py-2 border border-gray-300">Tên lớp</th>
                                    <th className="px-4 py-2 border border-gray-300">Mã học phần</th>
                                    <th className="px-4 py-2 border border-gray-300">Tên học phần</th>
                                    <th className="px-4 py-2 border border-gray-300">Số tín chỉ</th>
                                    <th className="px-4 py-2 border border-gray-300">Giảng viên</th>
                                    <th className="px-4 py-2 border border-gray-300">Phòng học</th>
                                    <th className="px-4 py-2 border border-gray-300">Sĩ số hiện tại</th>
                                    <th className="px-4 py-2 border border-gray-300">Sĩ số tối đa</th>
                                    <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                                    <th className="px-4 py-2 border border-gray-300 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAvailableClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-4 text-gray-500">
                                            {searchTerm ? 'Không tìm thấy lớp học phần nào phù hợp' : 'Không có lớp học phần nào'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAvailableClasses.map((rowData) => (
                                        <tr key={rowData?.maLopHP || 'unknown'} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData?.maLopHP || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.tenLopHP || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData?.maHocPhan || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.tenHocPhan || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.soTinChi || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.giangVien || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.phongHoc || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.siSoHienTai || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.soLuong || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData?.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {rowData?.trangThai ? 'Còn chỗ' : 'Hết chỗ'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">
                                                {actionTemplate(rowData)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>

                <TabPanel header="Lớp học phần đã đăng ký">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-blue-100">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-300">Mã lớp</th>
                                    <th className="px-4 py-2 border border-gray-300">Tên lớp</th>
                                    <th className="px-4 py-2 border border-gray-300">Mã học phần</th>
                                    <th className="px-4 py-2 border border-gray-300">Tên học phần</th>
                                    <th className="px-4 py-2 border border-gray-300">Số tín chỉ</th>
                                    <th className="px-4 py-2 border border-gray-300">Giảng viên</th>
                                    <th className="px-4 py-2 border border-gray-300">Phòng học</th>
                                    <th className="px-4 py-2 border border-gray-300">Ngày đăng ký</th>
                                    <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                                    <th className="px-4 py-2 border border-gray-300 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-4 text-gray-500">
                                            Chưa đăng ký lớp học phần nào
                                        </td>
                                    </tr>
                                ) : (
                                    registeredClasses.map((rowData) => (
                                        <tr key={`${rowData?.maSinhVien}-${rowData?.maLopHP}`} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData?.maLopHP || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.tenLopHP || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData?.maHocPhan || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.tenHocPhan || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.soTinChi || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.giangVien || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.phongHoc || ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData?.thoiGianDangKy ? new Date(rowData.thoiGianDangKy).toLocaleDateString('vi-VN') : ''}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData?.trangThai ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                    {rowData?.trangThai ? 'Đã đăng ký' : 'Đã hủy'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300 text-center">
                                                {registeredActionTemplate(rowData)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabPanel>
            </TabView>

            {/* Register Dialog */}
            <Dialog
                visible={registerDialogVisible}
                onHide={() => setRegisterDialogVisible(false)}
                header="Xác nhận đăng ký"
                modal
                footer={
                    <div>
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={() => setRegisterDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Đăng ký"
                            icon="pi pi-check"
                            onClick={handleRegister}
                            className="p-button-success"
                        />
                    </div>
                }
            >
                <p>
                    Bạn có chắc chắn muốn đăng ký lớp học phần{' '}
                    <strong>{selectedClass?.tenLopHP}</strong>?
                </p>
                <div className="mt-4">
                    <p><strong>Mã học phần:</strong> {selectedClass?.maHocPhan}</p>
                    <p><strong>Tên học phần:</strong> {selectedClass?.tenHocPhan}</p>
                    <p><strong>Số tín chỉ:</strong> {selectedClass?.soTinChi}</p>
                    <p><strong>Giảng viên:</strong> {selectedClass?.giangVien}</p>
                    <p><strong>Phòng học:</strong> {selectedClass?.phongHoc}</p>
                </div>
            </Dialog>

            {/* Cancel Dialog */}
            <Dialog
                visible={cancelDialogVisible}
                onHide={() => setCancelDialogVisible(false)}
                header="Xác nhận hủy đăng ký"
                modal
                footer={
                    <div>
                        <Button
                            label="Hủy"
                            icon="pi pi-times"
                            onClick={() => setCancelDialogVisible(false)}
                            className="p-button-text"
                        />
                        <Button
                            label="Xác nhận"
                            icon="pi pi-check"
                            onClick={handleCancel}
                            className="p-button-danger"
                        />
                    </div>
                }
            >
                <p>
                    Bạn có chắc chắn muốn hủy đăng ký lớp học phần{' '}
                    <strong>{selectedRegistration?.tenLopHP || 'N/A'}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 