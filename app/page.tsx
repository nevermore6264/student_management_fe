'use client';

import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<{ maNguoiDung: string, tenNguoiDung: string } | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                setUser({
                    maNguoiDung: localStorage.getItem('maNguoiDung') || '',
                    tenNguoiDung: localStorage.getItem('tenNguoiDung') || '',
                });
            } else {
                setUser(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        router.push('/auth/login');
    };

    const menuItems = [
        {
            label: 'Trang chủ',
            icon: 'pi pi-home',
            command: () => router.push('/')
        },
        {
            label: 'Đăng ký tín chỉ',
            icon: 'pi pi-book',
            command: () => router.push('/course-registration')
        },
        {
            label: 'Lịch học',
            icon: 'pi pi-calendar',
            command: () => router.push('/schedule')
        },
        {
            label: 'Kết quả học tập',
            icon: 'pi pi-chart-bar',
            command: () => router.push('/academic-results')
        }
    ];

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    const end = user ? (
        <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
                <span className="font-bold text-blue-700">{user.tenNguoiDung}</span>
                <span className="text-xs text-gray-500">{user.maNguoiDung}</span>
            </div>
            <Button
                label="Đăng xuất"
                icon="pi pi-sign-out"
                className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                onClick={handleLogout}
            />
        </div>
    ) : (
        <div className="flex items-center gap-2">
            <Button
                label="Đăng nhập"
                icon="pi pi-sign-in"
                className="bg-white text-blue-600 border border-blue-500 font-bold px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm"
                onClick={handleLogin}
            />
            <Button
                label="Đăng ký"
                icon="pi pi-user-plus"
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                onClick={handleRegister}
            />
        </div>
    );

    const features = [
        {
            title: 'Đăng ký tín chỉ',
            description: 'Đăng ký môn học nhanh chóng và dễ dàng với giao diện trực quan',
            icon: 'pi pi-book text-4xl text-primary'
        },
        {
            title: 'Lịch học',
            description: 'Xem lịch học chi tiết và quản lý thời gian hiệu quả',
            icon: 'pi pi-calendar text-4xl text-primary'
        },
        {
            title: 'Kết quả học tập',
            description: 'Theo dõi điểm số và tiến độ học tập của bạn',
            icon: 'pi pi-chart-bar text-4xl text-primary'
        }
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
            {/* Menubar */}
            <div className="sticky top-0 z-50 shadow-lg bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex items-center justify-between px-6 py-3 w-full">
                    <div className="flex items-center gap-3 font-extrabold leading-tight text-primary-900">
                        <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2 drop-shadow-lg" />
                        <h6 className="text-blue-700 text-2xl font-bold tracking-wide drop-shadow">Hệ thống Đăng ký tín chỉ</h6>
                    </div>
                    <Menubar
                        model={menuItems}
                        end={end}
                        className="border-none shadow-none font-semibold bg-transparent text-blue-800"
                        pt={{
                            root: { className: "gap-4" },
                            menu: { className: "flex gap-4" },
                            menuitem: { className: "rounded-lg px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors text-blue-800" },
                            action: { className: "flex items-center gap-2 text-blue-800" },
                            icon: { className: "text-blue-700" },
                            label: { className: "text-blue-800" }
                        }}
                    />
                </div>
            </div>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 drop-shadow-lg tracking-tight">
                    Tính năng nổi bật
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex justify-center"
                            style={{ animation: `fadeInUp 0.6s ${index * 0.15 + 0.2}s both` }}
                        >
                            <div className="w-full max-w-xs h-full rounded-3xl bg-white/90 shadow-2xl hover:shadow-blue-400/40 transition-all duration-300 border-0 flex flex-col items-center p-12 group hover:scale-110 hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200 relative overflow-hidden backdrop-blur-lg">
                                <div className="mb-8 flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-2xl group-hover:from-blue-400 group-hover:to-blue-600 transition-all duration-300 animate-pulse group-hover:animate-none">
                                    <i className={`${feature.icon} text-5xl text-white group-hover:text-yellow-200 transition-colors duration-200 group-hover:rotate-12`}></i>
                                </div>
                                <h3 className="text-2xl font-extrabold mb-4 text-blue-700 text-center group-hover:text-blue-900 transition-colors drop-shadow">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 text-base leading-relaxed text-center font-light">
                                    {feature.description}
                                </p>
                                {/* Hiệu ứng glow */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-300 rounded-full opacity-20 blur-2xl pointer-events-none"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <style>{`
                    @keyframes fadeInUp {
                        0% { opacity: 0; transform: translateY(40px);}
                        100% { opacity: 1; transform: translateY(0);}
                    }
                `}</style>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-100 via-blue-100 to-primary-200 py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-800 drop-shadow-lg">Sẵn sàng bắt đầu?</h2>
                        <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-2xl mx-auto font-light">
                            Đăng ký ngay để trải nghiệm hệ thống đăng ký tín chỉ hiện đại
                        </p>
                        <Button
                            label="Đăng ký tài khoản"
                            icon="pi pi-user-plus"
                            severity="success"
                            size="large"
                            className="p-button-raised px-10 py-5 text-xl rounded-full shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold border-0"
                            onClick={handleRegister}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
} 