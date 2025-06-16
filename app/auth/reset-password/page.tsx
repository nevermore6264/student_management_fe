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
        <div className="min-h-screen flex items-center justify-center">
            <div className="card w-full max-w-md bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center">
                <img src="/logo.png" alt="Logo" width={72} height={72} className="rounded-full shadow mb-4" />
                <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">Đặt lại mật khẩu</h1>
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

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-2">
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-gray-200 rounded-md h-11 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="code" className="text-gray-700 font-medium">Mã xác thực</label>
                        <InputText
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-gray-200 rounded-md h-11 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            placeholder="Nhập mã xác thực từ email"
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="newPassword" className="text-gray-700 font-medium">Mật khẩu mới</label>
                        <Password
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-gray-200 rounded-md h-11 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
                            inputClassName="w-full"
                            placeholder="Nhập mật khẩu mới"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-gray-700 font-medium">Xác nhận mật khẩu mới</label>
                        <Password
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="p-inputtext-lg w-full bg-blue-50 border border-gray-200 rounded-md h-11 text-base focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
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