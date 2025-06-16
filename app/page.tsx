'use client';

import { Button } from 'primereact/button';

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

const handleRegister = () => {
    window.location.href = '/auth/register';
};

export default function Home() {
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