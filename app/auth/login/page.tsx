/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import './login.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Message } from 'primereact/message';
import authService from '../../services/authService';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.login({
                email,
                matKhau: password,
            });
            if (res.success && res.data) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('maNguoiDung', res.data.maNguoiDung);
                localStorage.setItem('tenNguoiDung', res.data.tenNguoiDung);
                localStorage.setItem('email', res.data.email);
                localStorage.setItem('vaiTros', JSON.stringify(res.data.vaiTros));
                window.location.href = '/';
            } else {
                setError(res.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'message' in err) {
                setError((err as { message?: string }).message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            } else {
                setError('Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-12 px-4">
            <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-lg hover:shadow-blue-300/40 transition-all duration-300">
                {/* Logo và tiêu đề */}
                <div className="w-full flex flex-col items-center mb-8">
                    <div className="w-full flex justify-center mb-4">
                        <Image src="/logo.png" alt="Logo" width={72} height={72} className="rounded-full shadow-lg" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Hệ thống Đăng ký học phần</h1>
                    <p className="text-gray-500 text-center">Đăng nhập để tiếp tục sử dụng</p>
                </div>
                {error && (
                    <Message severity="error" text={error} className="w-full mb-4" />
                )}
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-inputtext-lg bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="password" className="text-gray-700 font-semibold">Mật khẩu</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 rounded-xl border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 h-12 text-base"
                            inputClassName="p-password-input"
                            placeholder="Nhập mật khẩu của bạn"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center mt-1 mb-2">
                        <Link
                            href="/auth/forgot-password"
                            className="text-blue-600 font-medium text-sm underline hover:text-blue-800 transition-colors"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        label="Đăng nhập"
                        icon="pi pi-sign-in"
                        className="p-button-lg w-full h-12 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg hover:scale-105 transition-transform duration-200 text-white"
                        loading={loading}
                    />
                    <div className="text-center pt-4">
                        <span className="text-gray-500">Chưa có tài khoản? </span>
                        <Link
                            href="/auth/register"
                            className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 