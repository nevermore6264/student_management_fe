'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import registrationService, { CourseClass, RegistrationPeriod, Registration } from '../services/registrationService';

export default function CourseRegistrationPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const [registrationPeriods, setRegistrationPeriods] = useState<RegistrationPeriod[]>([]);
    const [availableClasses, setAvailableClasses] = useState<CourseClass[]>([]);
    const [registeredClasses, setRegisteredClasses] = useState<Registration[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
    const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

    // Mock student ID - in real app this would come from user context/auth
    const maSinhVien = 'SV001';

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            console.log('Loading data...');

            const [periods, classes, registrations] = await Promise.all([
                registrationService.getCurrentRegistrationPeriod(),
                registrationService.getAvailableClasses(),
                registrationService.getRegisteredClasses(maSinhVien)
            ]);

            console.log('API Response - periods:', periods);
            console.log('API Response - classes:', classes);
            console.log('API Response - registrations:', registrations);

            // Handle single registration period object
            const periodsArray = periods ? [periods] : [];
            console.log('Periods array:', periodsArray);

            setRegistrationPeriods(periodsArray);
            setAvailableClasses(classes);
            setRegisteredClasses(registrations);
        } catch (error: unknown) {
            console.error('Error loading data:', error);
            const errorMessage = error instanceof Error ? error.message : 'Không thể tải dữ liệu';
            showToast('error', 'Lỗi', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (severity: 'success' | 'error' | 'info' | 'warn', summary: string, detail: string) => {
        toast.current?.show({ severity, summary, detail, life: 3000 });
    };

    const actionTemplate = (rowData: CourseClass) => {
        if (rowData.trangThai === 'Còn chỗ') {
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
        }
        return null;
    };

    const registeredActionTemplate = (rowData: Registration) => {
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
    };

    const handleRegister = async () => {
        if (!selectedClass) return;

        try {
            await registrationService.registerClass({
                maSinhVien,
                maLopHocPhan: selectedClass.maLopHocPhan
            });

            showToast('success', 'Thành công', 'Đăng ký lớp học phần thành công');
            setRegisterDialogVisible(false);
            loadData(); // Reload data to update lists
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Đăng ký thất bại';
            showToast('error', 'Lỗi', errorMessage);
        }
    };

    const handleCancel = async () => {
        if (!selectedRegistration) return;

        try {
            await registrationService.cancelRegistration(selectedRegistration.id);
            showToast('success', 'Thành công', 'Hủy đăng ký thành công');
            setCancelDialogVisible(false);
            loadData(); // Reload data to update lists
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Hủy đăng ký thất bại';
            showToast('error', 'Lỗi', errorMessage);
        }
    };

    const filteredAvailableClasses = availableClasses.filter(cls =>
        cls.tenLopHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.tenHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.maLopHocPhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.maHocPhan.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-2xl font-bold">Đăng ký học phần</h1>
            </div>

            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Đợt đăng ký hiện tại</h2>
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
                            {registrationPeriods.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-gray-500">
                                        Không có đợt đăng ký nào
                                    </td>
                                </tr>
                            ) : (
                                registrationPeriods.map((period) => (
                                    <tr key={period.maDotDK} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 border border-gray-300">{period.tenDotDK}</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            {new Date(period.ngayGioBatDau).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            {new Date(period.ngayGioKetThuc).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-2 border border-gray-300">{period.tenKhoa}</td>
                                        <td className="px-4 py-2 border border-gray-300">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${period.trangThai ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {period.trangThai ? 'Đang mở' : 'Đã đóng'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Lớp học phần có thể đăng ký">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
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
                                        <tr key={rowData.maLopHocPhan} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.maLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.tenLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.maHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.tenHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.soTinChi}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.giangVien}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.phongHoc}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.siSoHienTai}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.siSoToiDa}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.trangThai === 'Còn chỗ' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {rowData.trangThai}
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
                                        <tr key={rowData.id} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.lopHocPhan.maLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.lopHocPhan.tenLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.lopHocPhan.maHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.lopHocPhan.tenHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.lopHocPhan.soTinChi}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.lopHocPhan.giangVien}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.lopHocPhan.phongHoc}</td>
                                            <td className="px-4 py-2 border border-gray-300">{new Date(rowData.ngayDangKy).toLocaleDateString('vi-VN')}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.trangThai === 'Đã đăng ký' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {rowData.trangThai}
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
                    <strong>{selectedClass?.tenLopHocPhan}</strong>?
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
                    <strong>{selectedRegistration?.lopHocPhan.tenLopHocPhan}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 