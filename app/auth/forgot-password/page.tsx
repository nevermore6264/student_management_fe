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
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

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
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="card w-full max-w-md bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
                <img src="/logo.png" alt="Logo" width={72} height={72} className="rounded-full shadow mb-4" />
                <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">Quên mật khẩu</h1>
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

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-envelope" />
                            <InputText
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-inputtext-lg w-full bg-blue-50 border border-gray-200 rounded-md h-11 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </span>
                    </div>

                    <Button
                        type="submit"
                        label="Gửi yêu cầu"
                        icon="pi pi-send"
                        className="p-button-lg p-button-primary w-full h-11 font-bold text-lg rounded-md shadow-md hover:shadow-lg transition"
                    />

                    <div className="text-center pt-4">
                        <span className="text-gray-500">Quay lại </span>
                        <Link href="/auth/login" className="text-blue-600 font-medium underline hover:text-blue-800 transition">
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 