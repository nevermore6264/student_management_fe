/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { MultiSelect } from 'primereact/multiselect';
import { Message } from 'primereact/message';
import { useRouter } from 'next/navigation';

interface Role {
    label: string;
    value: string;
}

export default function AddUserPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        maNguoiDung: '',
        tenNguoiDung: '',
        email: '',
        soDienThoai: '',
        diaChi: '',
        matKhau: '',
        confirmPassword: '',
        vaiTros: [] as string[]
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const roles: Role[] = [
        { label: 'Sinh viên', value: 'student' },
        { label: 'Giảng viên', value: 'lecturer' },
        { label: 'Quản trị viên', value: 'admin' }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.matKhau !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        try {
            // TODO: Implement actual user creation logic here
            console.log('Creating user:', formData);
            setSuccess(true);
            setTimeout(() => {
                router.push('/users/list');
            }, 2000);
        } catch (error) {
            setError('Không thể tạo người dùng. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="card">
            <div className="flex justify-content-between align-items-center mb-4">
                <h1 className="text-2xl font-bold">Thêm người dùng mới</h1>
                <Button
                    label="Quay lại"
                    icon="pi pi-arrow-left"
                    className="p-button-text"
                    onClick={() => router.push('/users/list')}
                />
            </div>

            {error && (
                <Message severity="error" text={error} className="w-full mb-4" />
            )}

            {success && (
                <Message
                    severity="success"
                    text="Tạo người dùng thành công! Đang chuyển hướng..."
                    className="w-full mb-4"
                />
            )}

            <form onSubmit={handleSubmit} className="flex flex-column gap-4">
                <div className="grid">
                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="maNguoiDung" className="font-medium">
                                Mã người dùng
                            </label>
                            <InputText
                                id="maNguoiDung"
                                value={formData.maNguoiDung}
                                onChange={(e) => setFormData({ ...formData, maNguoiDung: e.target.value })}
                                className="w-full"
                                placeholder="Nhập mã người dùng"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="tenNguoiDung" className="font-medium">
                                Họ và tên
                            </label>
                            <InputText
                                id="tenNguoiDung"
                                value={formData.tenNguoiDung}
                                onChange={(e) => setFormData({ ...formData, tenNguoiDung: e.target.value })}
                                className="w-full"
                                placeholder="Nhập họ và tên"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email" className="font-medium">
                                Email
                            </label>
                            <InputText
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full"
                                placeholder="Nhập email"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="soDienThoai" className="font-medium">
                                Số điện thoại
                            </label>
                            <InputText
                                id="soDienThoai"
                                value={formData.soDienThoai}
                                onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                                className="w-full"
                                placeholder="Nhập số điện thoại"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="diaChi" className="font-medium">
                                Địa chỉ
                            </label>
                            <InputText
                                id="diaChi"
                                value={formData.diaChi}
                                onChange={(e) => setFormData({ ...formData, diaChi: e.target.value })}
                                className="w-full"
                                placeholder="Nhập địa chỉ"
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="matKhau" className="font-medium">
                                Mật khẩu
                            </label>
                            <Password
                                id="matKhau"
                                value={formData.matKhau}
                                onChange={(e) => setFormData({ ...formData, matKhau: e.target.value })}
                                className="w-full"
                                placeholder="Nhập mật khẩu"
                                toggleMask
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="confirmPassword" className="font-medium">
                                Xác nhận mật khẩu
                            </label>
                            <Password
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full"
                                placeholder="Nhập lại mật khẩu"
                                toggleMask
                                feedback={false}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="vaiTros" className="font-medium">
                                Vai trò
                            </label>
                            <MultiSelect
                                id="vaiTros"
                                value={formData.vaiTros}
                                options={roles}
                                onChange={(e) => setFormData({ ...formData, vaiTros: e.value })}
                                className="w-full"
                                placeholder="Chọn vai trò"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-content-end gap-2">
                    <Button
                        type="button"
                        label="Hủy"
                        icon="pi pi-times"
                        className="p-button-text"
                        onClick={() => router.push('/users/list')}
                    />
                    <Button
                        type="submit"
                        label="Lưu"
                        icon="pi pi-check"
                    />
                </div>
            </form>
        </div>
    );
} 