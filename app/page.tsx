'use client';

import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from 'primereact/avatar';

const features = [
    {
        title: 'Đăng ký tín chỉ',
        description: 'Đăng ký môn học nhanh chóng và dễ dàng với giao diện trực quan',
        icon: 'pi pi-book text-4xl text-primary',
        path: '/course-registration'
    },
    {
        title: 'Lịch học',
        description: 'Xem lịch học chi tiết và quản lý thời gian hiệu quả',
        icon: 'pi pi-calendar text-4xl text-primary',
        path: '/schedule'
    },
    {
        title: 'Kết quả học tập',
        description: 'Theo dõi điểm số và tiến độ học tập của bạn',
        icon: 'pi pi-chart-bar text-4xl text-primary',
        path: '/academic-results'
    }
];

const quickActions = [
    {
        title: 'Đăng ký môn học',
        description: 'Chọn và đăng ký các môn học cho học kỳ mới',
        icon: 'pi pi-plus-circle',
        path: '/course-registration',
        color: 'from-green-500 to-emerald-600'
    },
    {
        title: 'Xem lịch học',
        description: 'Kiểm tra lịch học và lịch thi của bạn',
        icon: 'pi pi-calendar-times',
        path: '/schedule',
        color: 'from-blue-500 to-cyan-600'
    },
    {
        title: 'Kết quả học tập',
        description: 'Xem điểm số và bảng điểm chi tiết',
        icon: 'pi pi-chart-line',
        path: '/academic-results',
        color: 'from-purple-500 to-pink-600'
    },
    {
        title: 'Thông tin cá nhân',
        description: 'Cập nhật thông tin cá nhân và mật khẩu',
        icon: 'pi pi-user-edit',
        path: '/profile',
        color: 'from-orange-500 to-red-600'
    }
];

const handleRegister = () => {
    window.location.href = '/auth/register';
};

const handleLogin = () => {
    window.location.href = '/auth/login';
};

export default function Home() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ maNguoiDung: string, tenNguoiDung: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                setUser({
                    maNguoiDung: localStorage.getItem('maNguoiDung') || '',
                    tenNguoiDung: localStorage.getItem('tenNguoiDung') || '',
                });
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setIsLoading(false);
        }
    }, []);

    const handleQuickAction = (path: string) => {
        router.push(path);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner text-6xl text-blue-600 mb-4"></i>
                    <p className="text-gray-600 text-lg">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated && user) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
                {/* Welcome Section */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                            <div className="flex-shrink-0">
                                <Avatar
                                    label={user.tenNguoiDung.charAt(0).toUpperCase()}
                                    size="xlarge"
                                    className="bg-white/20 text-white text-3xl font-bold border-4 border-white/30"
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                    Chào mừng trở lại, {user.tenNguoiDung}! 👋
                                </h1>
                                <p className="text-blue-100 text-lg mb-4">
                                    Sẵn sàng cho một ngày học tập hiệu quả?
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                                        Mã sinh viên: {user.maNguoiDung}
                                    </span>
                                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                                        Hệ thống đăng ký tín chỉ
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Actions Section */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Thao tác nhanh
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer flex flex-col items-center"
                                style={{ animation: `fadeInUp 0.6s ${index * 0.15 + 0.2}s both` }}
                                onClick={() => handleQuickAction(action.path)}
                            >
                                <div className={`w-16 h-16 mb-6 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                                    <i className={`${action.icon} text-white text-2xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-center text-gray-800">{action.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed text-sm">{action.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features Section */}
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                        Tính năng chính
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
                                style={{ animation: `fadeInUp 0.6s ${index * 0.15 + 0.2}s both` }}
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                                    <i className={`${feature.icon} text-white`}></i>
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-center text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <style>{`
                    @keyframes fadeInUp {
                        0% { opacity: 0; transform: translateY(40px);}
                        100% { opacity: 1; transform: translateY(0);}
                    }
                `}</style>
            </main>
        );
    }

    // UI cho người dùng chưa đăng nhập
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans">
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
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                label="Đăng nhập"
                                icon="pi pi-sign-in"
                                severity="info"
                                size="large"
                                className="p-button-raised px-8 py-4 text-lg rounded-full shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold border-0"
                                onClick={handleLogin}
                            />
                            <Button
                                label="Đăng ký tài khoản"
                                icon="pi pi-user-plus"
                                severity="success"
                                size="large"
                                className="p-button-raised px-8 py-4 text-lg rounded-full shadow-xl hover:scale-110 transition-transform duration-200 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold border-0"
                                onClick={handleRegister}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
} 