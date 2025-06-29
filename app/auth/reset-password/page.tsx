/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import Link from 'next/link';
import authService from '../../services/authService';
import './reset.css';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }
        try {
            await authService.resetPassword({ email, code, newPassword });
            setSuccess(true);
            router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error: unknown) {
            if (typeof error === 'object' && error !== null && 'message' in error) {
                setError((error as { message?: string }).message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
            } else {
                setError('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
            }
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
            <div className="w-full max-w-md bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center backdrop-blur-lg hover:shadow-blue-300/40 transition-all duration-300">
                <img src="/logo.png" alt="Logo" width={72} height={72} className="rounded-full shadow-lg mb-4" />
                <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-2 text-center drop-shadow">Đặt lại mật khẩu</h1>
                <p className="text-gray-500 text-center mb-4">Nhập email, mã xác thực và mật khẩu mới</p>

                {error && (
                    <Message severity="error" text={error} className="w-full mb-2" />
                )}

                {success && (
                    <Message
                        severity="success"
                        text="Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập lại."
                        className="w-full mb-2"
                    />
                )}

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-semibold">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-blue-200 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="code" className="text-gray-700 font-semibold">Mã xác thực</label>
                        <InputText
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-blue-200 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            placeholder="Nhập mã xác thực từ email"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="newPassword" className="text-gray-700 font-semibold">Mật khẩu mới</label>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-blue-200 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            inputClassName="w-full"
                            placeholder="Nhập mật khẩu mới"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-gray-700 font-semibold">Xác nhận mật khẩu mới</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-blue-200 rounded-xl h-12 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            inputClassName="w-full"
                            placeholder="Nhập lại mật khẩu mới"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        label="Đặt lại mật khẩu"
                        icon="pi pi-refresh"
                        className="p-button-lg w-full h-12 font-bold text-lg rounded-xl bg-gradient-to-r from-blue-500 to-blue-700 border-0 shadow-lg hover:scale-105 transition-transform duration-200 text-white"
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