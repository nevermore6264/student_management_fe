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
                router.push('/dashboard');
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
        <div className="p-d-flex p-jc-center p-ai-center" style={{ background: '#f4f6fb' }}>
            <div style={{ width: 400, background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)', padding: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Logo và tiêu đề */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <Image src="/logo.png" alt="Logo" width={72} height={72} style={{ borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#2563eb', marginBottom: 8, textAlign: 'center' }}>Hệ thống Đăng ký học phần</h1>
                    <p style={{ color: '#6b7280', textAlign: 'center' }}>Đăng nhập để tiếp tục sử dụng</p>
                </div>
                {error && (
                    <Message severity="error" text={error} style={{ width: '100%', marginBottom: 16 }} />
                )}
                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label htmlFor="email" style={{ color: '#374151', fontWeight: 500 }}>Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-inputtext-lg"
                            placeholder="Nhập email của bạn"
                            required
                            style={{ width: '100%', background: '#eff6ff', borderRadius: 8, border: '1px solid #e5e7eb', height: 48, fontSize: 16 }}
                        />
                    </div>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <label htmlFor="password" style={{ color: '#374151', fontWeight: 500 }}>Mật khẩu</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-inputtext-lg"
                            inputClassName="p-password-input"
                            placeholder="Nhập mật khẩu của bạn"
                            toggleMask
                            feedback={false}
                            required
                        />
                    </div>
                    <div className="p-d-flex p-jc-between p-ai-center" style={{ margin: '8px 0' }}>
                        <Link
                            href="/auth/forgot-password"
                            style={{ color: '#2563eb', fontWeight: 500, fontSize: 14, textDecoration: 'underline' }}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        label="Đăng nhập"
                        icon="pi pi-sign-in"
                        className="p-button-lg p-button-primary"
                        loading={loading}
                        style={{ width: '100%', height: 48, fontWeight: 700, fontSize: 18, borderRadius: 8, boxShadow: '0 2px 8px 0 rgba(37,99,235,0.10)' }}
                    />
                    <div style={{ textAlign: 'center', paddingTop: 16 }}>
                        <span style={{ color: '#6b7280' }}>Chưa có tài khoản? </span>
                        <Link
                            href="/auth/register"
                            style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'underline' }}
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
} 