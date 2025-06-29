/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import authService from '../../services/authService';
import './register.css';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        setLoading(true);
        try {
            await authService.register({
                tenNguoiDung: formData.fullName,
                email: formData.email,
                matKhau: formData.password,
                soDienThoai: formData.phone,
                diaChi: formData.address
            });
            setSuccess('Đăng ký thành công! Chuyển sang trang đăng nhập...');
            setTimeout(() => router.push('/auth/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
            <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-0 md:p-10 flex flex-col md:flex-row items-center gap-0 md:gap-10 backdrop-blur-lg hover:shadow-blue-300/40 transition-all duration-300">
                {/* Left: Register Form */}
                <div className="flex-1 w-full flex flex-col items-center md:items-start px-6 py-10 md:py-0">
                    <div className="w-full flex flex-col items-center mb-8">
                        <Image src="/logo.png" alt="Logo" width={64} height={64} className="rounded-full shadow-lg mb-2" />
                        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Đăng ký tài khoản</h1>
                        <p className="text-gray-500 text-center">Tạo tài khoản mới trong hệ thống đăng ký tín chỉ</p>
                    </div>

                    {error && <Message severity="error" text={error} className="w-full mb-4" />}
                    {success && <Message severity="success" text={success} className="w-full mb-4" />}

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                        {/* Họ tên + Email */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="fullName" className="text-gray-700 font-semibold">Họ và tên</label>
                                <InputText
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="p-inputtext-lg bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="p-inputtext-lg bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>
                        </div>

                        {/* SĐT + Địa chỉ */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="phone" className="text-gray-700 font-semibold">Số điện thoại</label>
                                <InputText
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="p-inputtext-lg bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="address" className="text-gray-700 font-semibold">Địa chỉ</label>
                                <InputText
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="p-inputtext-lg bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    placeholder="Nhập địa chỉ"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu + Xác nhận mật khẩu */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="password" className="text-gray-700 font-semibold">Mật khẩu</label>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="p-inputtext-lg w-full bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    inputClassName="w-full"
                                    placeholder="Nhập mật khẩu"
                                    toggleMask
                                    feedback={false}
                                    required
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Xác nhận mật khẩu</label>
                                <Password
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="p-inputtext-lg w-full bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                                    inputClassName="w-full"
                                    placeholder="Nhập lại mật khẩu"
                                    toggleMask
                                    feedback={false}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label="Đăng ký"
                            icon="pi pi-user-plus"
                            className="p-button-lg w-full h-12 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg hover:scale-105 transition-transform duration-200 text-white"
                            loading={loading}
                        />

                        <div className="text-center pt-4">
                            <span className="text-gray-500">Đã có tài khoản? </span>
                            <Link href="/auth/login" className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors">
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right: Illustration */}
                <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl p-10 h-full">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full shadow-lg mb-6" />
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3678714-3098696.png"
                        alt="Education Illustration"
                        className="w-full max-w-xs rounded-2xl shadow-xl border-4 border-white"
                    />
                </div>
            </div>
        </div>
    );

} 