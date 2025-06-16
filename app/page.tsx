'use client';

import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Card } from 'primereact/card';

export default function Home() {
    const router = useRouter();

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

    const end = (
        <div className="flex align-items-center gap-2">
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
            <div className="bg-primary shadow-2 sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2 font-extrabold leading-tight text-primary-900 drop-shadow-lg">
                        <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-2" />
                        <h6 className="text-white text-xl font-bold tracking-wide">Hệ thống Đăng ký tín chỉ</h6>
                    </div>
                    <Menubar
                        model={menuItems}
                        end={end}
                        className="bg-transparent border-none shadow-none text-white font-semibold"
                        pt={{
                            root: { className: "gap-4" },
                            menu: { className: "flex gap-4" },
                            menuitem: { className: "rounded-lg px-4 py-2 hover:bg-blue-100 hover:text-blue-700 transition-colors" },
                            action: { className: "flex items-center gap-2" },
                        }}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative flex flex-col md:flex-row items-center justify-between container mx-auto px-4 py-16 md:py-24 gap-8">
                <div className="flex-1 flex flex-col justify-center items-start text-left z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-primary-900 drop-shadow-lg">Hệ thống đăng ký tín chỉ</h1>
                    <p className="text-lg md:text-2xl mb-8 text-gray-700 max-w-xl">Giải pháp toàn diện giúp sinh viên quản lý việc học tập một cách hiệu quả</p>
                </div>
                <div className="flex-1 flex justify-center items-center relative z-10">
                    <img
                        src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3678714-3098696.png"
                        alt="Education Illustration"
                        className="w-full max-w-lg rounded-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform duration-300"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
                {/* Gradient background shape */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-14 text-primary-900">Tính năng nổi bật</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex justify-center">
                            <Card className="w-full max-w-xs h-full rounded-2xl shadow-lg hover:shadow-3xl transition-all duration-300 border-0 bg-white flex flex-col items-center p-8 group">
                                <i className={`${feature.icon} mb-6 text-5xl group-hover:text-primary-600 transition-colors duration-200`}></i>
                                <h3 className="text-xl font-bold mb-3 text-primary-800">{feature.title}</h3>
                                <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-100 via-blue-100 to-primary-200 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-primary-900">Sẵn sàng bắt đầu?</h2>
                        <p className="text-lg md:text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
                            Đăng ký ngay để trải nghiệm hệ thống đăng ký tín chỉ hiện đại
                        </p>
                        <Button
                            label="Đăng ký tài khoản"
                            icon="pi pi-user-plus"
                            severity="success"
                            size="large"
                            className="p-button-raised px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition-transform duration-200"
                            onClick={handleRegister}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
} 