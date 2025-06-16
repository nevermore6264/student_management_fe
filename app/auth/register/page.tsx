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
        <div className="register-page">
            <div className="register-container">
                {/* Left: Register Form */}
                <div className="form-box">
                    <div style={{ width: '100%', marginBottom: 32, textAlign: 'center' }}>
                        <Image src="/logo.png" alt="Logo" width={64} height={64} className="logo-img" />
                        <h1 className="form-title">Đăng ký tài khoản</h1>
                        <p className="form-subtitle">Tạo tài khoản mới trong hệ thống đăng ký tín chỉ</p>
                    </div>

                    {error && <Message severity="error" text={error} style={{ width: '100%', marginBottom: 16 }} />}
                    {success && <Message severity="success" text={success} style={{ width: '100%', marginBottom: 16 }} />}

                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        {/* Họ tên + Email */}
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="fullName" className="form-label">Họ và tên</label>
                                <InputText
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="p-inputtext-lg"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="p-inputtext-lg"
                                    placeholder="Nhập email"
                                    required
                                />
                            </div>
                        </div>

                        {/* SĐT + Địa chỉ */}
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                                <InputText
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="p-inputtext-lg"
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="address" className="form-label">Địa chỉ</label>
                                <InputText
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="p-inputtext-lg"
                                    placeholder="Nhập địa chỉ"
                                    required
                                />
                            </div>
                        </div>

                        {/* Mật khẩu + Xác nhận mật khẩu */}
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="password" className="form-label">Mật khẩu</label>
                                <Password
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="p-inputtext-lg"
                                    inputClassName="p-password-input"
                                    placeholder="Nhập mật khẩu"
                                    toggleMask
                                    feedback={false}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                <Password
                                    id="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="p-inputtext-lg"
                                    inputClassName="p-password-input"
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
                            className="p-button-lg p-button-primary submit-btn"
                            loading={loading}
                        />

                        <div style={{ textAlign: 'center', paddingTop: 16 }}>
                            <span style={{ color: '#6b7280' }}>Đã có tài khoản? </span>
                            <Link href="/auth/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'underline' }}>
                                Đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Right: Illustration */}
                <div className="illustration-box">
                    <Image src="/logo.png" alt="Logo" width={80} height={80} className="logo-img" />
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3678714-3098696.png"
                        alt="Education Illustration"
                        className="illustration-img"
                    />
                </div>
            </div>
        </div>
    );

} 