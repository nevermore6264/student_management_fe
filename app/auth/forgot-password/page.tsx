/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import Link from 'next/link';
import './forgot.css';
import authService from '../../services/authService';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);
        try {
            await authService.forgotPassword({ email });
            setSuccess(true);
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                setError((error as { message?: string }).message || 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.');
            } else {
                setError('Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
            <button
                onClick={() => router.push('/')}
                className="absolute top-6 left-6 p-button-lg font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg hover:scale-105 transition-transform duration-200 text-white z-10 cursor-pointer"
                style={{ minWidth: 'auto', padding: '0.5rem 1.25rem' }}
                title="Về trang chủ"
            >
                Về trang chủ
            </button>

            <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-lg hover:shadow-blue-300/40 transition-all duration-300">
                <img src="/logo.png" alt="Logo" width={72} height={72} className="rounded-full shadow-lg mb-4" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Quên mật khẩu</h1>
                <p className="text-gray-500 text-center mb-4">Nhập email của bạn để đặt lại mật khẩu</p>

                {error && (
                    <Message severity="error" text={error} className="w-full mb-2" />
                )}

                {success && (
                    <Message
                        severity="success"
                        text="Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn."
                        className="w-full mb-2"
                    />
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
                        <span className="p-input-icon-left w-full">
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-inputtext-lg w-full bg-blue-50 border border-blue-200 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition pl-10"
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </span>
                    </div>

                    <Button
                        type="submit"
                        label="Gửi yêu cầu"
                        icon="pi pi-send"
                        className="p-button-lg w-full h-12 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg hover:scale-105 transition-transform duration-200 text-white"
                        loading={loading}
                    />

                    <div className="text-center pt-4">
                        <span className="text-gray-500">Quay lại </span>
                        <Link href="/auth/login" className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors">
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 