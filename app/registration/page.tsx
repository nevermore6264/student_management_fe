'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { Tag } from 'primereact/tag';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
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

    const statusTemplate = (rowData: CourseClass) => {
        const status = rowData.trangThai;
        const severity = status === 'Còn chỗ' ? 'success' : 'info';
        return <Tag value={status} severity={severity} />;
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
                <DataTable
                    value={registrationPeriods}
                    className="p-datatable-sm"
                    emptyMessage="Không có đợt đăng ký nào"
                >
                    <Column field="tenDotDangKy" header="Tên đợt đăng ký" />
                    <Column field="ngayBatDau" header="Ngày bắt đầu" />
                    <Column field="ngayKetThuc" header="Ngày kết thúc" />
                    <Column field="trangThai" header="Trạng thái" />
                </DataTable>
            </div>

            <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)}>
                <TabPanel header="Lớp học phần có thể đăng ký">
                    <div className="flex justify-content-between mb-4">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText placeholder="Tìm kiếm lớp học phần..." />
                        </span>
                    </div>

                    <DataTable
                        value={availableClasses}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Không tìm thấy lớp học phần nào"
                    >
                        <Column field="maLopHocPhan" header="Mã lớp" sortable />
                        <Column field="tenLopHocPhan" header="Tên lớp" sortable />
                        <Column field="maHocPhan" header="Mã học phần" sortable />
                        <Column field="tenHocPhan" header="Tên học phần" sortable />
                        <Column field="soTinChi" header="Số tín chỉ" sortable />
                        <Column field="giangVien" header="Giảng viên" sortable />
                        <Column field="phongHoc" header="Phòng học" sortable />
                        <Column field="siSoHienTai" header="Sĩ số hiện tại" sortable />
                        <Column field="siSoToiDa" header="Sĩ số tối đa" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '8rem' }} />
                    </DataTable>
                </TabPanel>

                <TabPanel header="Lớp học phần đã đăng ký">
                    <DataTable
                        value={registeredClasses}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        className="p-datatable-sm"
                        emptyMessage="Chưa đăng ký lớp học phần nào"
                    >
                        <Column field="maLopHocPhan" header="Mã lớp" sortable />
                        <Column field="tenLopHocPhan" header="Tên lớp" sortable />
                        <Column field="maHocPhan" header="Mã học phần" sortable />
                        <Column field="tenHocPhan" header="Tên học phần" sortable />
                        <Column field="soTinChi" header="Số tín chỉ" sortable />
                        <Column field="giangVien" header="Giảng viên" sortable />
                        <Column field="phongHoc" header="Phòng học" sortable />
                        <Column field="trangThai" header="Trạng thái" body={statusTemplate} sortable />
                        <Column body={actionTemplate} style={{ width: '8rem' }} />
                    </DataTable>
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