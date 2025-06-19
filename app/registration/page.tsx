'use client';

import { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';

interface CourseClass {
    maLopHocPhan: string;
    tenLopHocPhan: string;
    maHocPhan: string;
    tenHocPhan: string;
    soTinChi: number;
    hocKy: string;
    namHoc: string;
    siSoToiDa: number;
    siSoHienTai: number;
    giangVien: string;
    phongHoc: string;
    trangThai: string;
}

interface RegistrationPeriod {
    maDotDangKy: string;
    tenDotDangKy: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    trangThai: string;
}

export default function CourseRegistrationPage() {
    const [activeTab, setActiveTab] = useState(0);

    const [registrationPeriods] = useState<RegistrationPeriod[]>([
        {
            maDotDangKy: 'DK001',
            tenDotDangKy: 'Đăng ký học kỳ 1 năm 2023-2024',
            ngayBatDau: '2023-08-01',
            ngayKetThuc: '2023-08-15',
            trangThai: 'Đang mở'
        }
    ]);

    const [availableClasses] = useState<CourseClass[]>([
        {
            maLopHocPhan: 'LHP001',
            tenLopHocPhan: 'Lập trình Web - Nhóm 1',
            maHocPhan: 'INT1234',
            tenHocPhan: 'Lập trình Web',
            soTinChi: 3,
            hocKy: '1',
            namHoc: '2023-2024',
            siSoToiDa: 50,
            siSoHienTai: 30,
            giangVien: 'Nguyễn Văn A',
            phongHoc: 'A101',
            trangThai: 'Còn chỗ'
        },
        {
            maLopHocPhan: 'LHP002',
            tenLopHocPhan: 'Cơ sở dữ liệu - Nhóm 1',
            maHocPhan: 'INT1235',
            tenHocPhan: 'Cơ sở dữ liệu',
            soTinChi: 3,
            hocKy: '1',
            namHoc: '2023-2024',
            siSoToiDa: 50,
            siSoHienTai: 25,
            giangVien: 'Trần Thị B',
            phongHoc: 'A102',
            trangThai: 'Còn chỗ'
        }
    ]);

    const [registeredClasses] = useState<CourseClass[]>([
        {
            maLopHocPhan: 'LHP001',
            tenLopHocPhan: 'Lập trình Web - Nhóm 1',
            maHocPhan: 'INT1234',
            tenHocPhan: 'Lập trình Web',
            soTinChi: 3,
            hocKy: '1',
            namHoc: '2023-2024',
            siSoToiDa: 50,
            siSoHienTai: 30,
            giangVien: 'Nguyễn Văn A',
            phongHoc: 'A101',
            trangThai: 'Đã đăng ký'
        }
    ]);

    const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null);
    const [registerDialogVisible, setRegisterDialogVisible] = useState(false);
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);

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
        } else if (rowData.trangThai === 'Đã đăng ký') {
            return (
                <Button
                    label="Hủy đăng ký"
                    icon="pi pi-times"
                    className="p-button-danger"
                    onClick={() => {
                        setSelectedClass(rowData);
                        setCancelDialogVisible(true);
                    }}
                />
            );
        }
        return null;
    };

    const handleRegister = () => {
        // TODO: Implement registration logic
        console.log('Registering for class:', selectedClass);
        setRegisterDialogVisible(false);
    };

    const handleCancel = () => {
        // TODO: Implement cancel registration logic
        console.log('Canceling registration for class:', selectedClass);
        setCancelDialogVisible(false);
    };

    return (
        <div className="card">
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
                                <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrationPeriods.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-500">
                                        Không có đợt đăng ký nào
                                    </td>
                                </tr>
                            ) : (
                                registrationPeriods.map((period) => (
                                    <tr key={period.maDotDangKy} className="border-b hover:bg-blue-50">
                                        <td className="px-4 py-2 border border-gray-300">{period.tenDotDangKy}</td>
                                        <td className="px-4 py-2 border border-gray-300">{period.ngayBatDau}</td>
                                        <td className="px-4 py-2 border border-gray-300">{period.ngayKetThuc}</td>
                                        <td className="px-4 py-2 border border-gray-300">{period.trangThai}</td>
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
                            <InputText placeholder="Tìm kiếm lớp học phần..." />
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
                                {availableClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={11} className="text-center py-4 text-gray-500">
                                            Không tìm thấy lớp học phần nào
                                        </td>
                                    </tr>
                                ) : (
                                    availableClasses.map((rowData) => (
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
                                    <th className="px-4 py-2 border border-gray-300">Trạng thái</th>
                                    <th className="px-4 py-2 border border-gray-300 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registeredClasses.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="text-center py-4 text-gray-500">
                                            Chưa đăng ký lớp học phần nào
                                        </td>
                                    </tr>
                                ) : (
                                    registeredClasses.map((rowData) => (
                                        <tr key={rowData.maLopHocPhan} className="border-b hover:bg-blue-50">
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.maLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.tenLopHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300 font-mono">{rowData.maHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.tenHocPhan}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.soTinChi}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.giangVien}</td>
                                            <td className="px-4 py-2 border border-gray-300">{rowData.phongHoc}</td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${rowData.trangThai === 'Đã đăng ký' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
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
                    <strong>{selectedClass?.tenLopHocPhan}</strong>?
                </p>
            </Dialog>
        </div>
    );
} 