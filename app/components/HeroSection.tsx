"use client";

export default function HeroSection() {
    return (
        <section className="relative flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-20 md:py-28 gap-12">
            <div className="flex-1 flex flex-col justify-center items-start text-left z-10">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-blue-700 drop-shadow-xl">
                    Hệ thống đăng ký tín chỉ
                </h1>
                <p className="text-xl md:text-2xl mb-10 text-gray-700 max-w-xl font-light">Giải pháp toàn diện giúp sinh viên quản lý việc học tập một cách hiệu quả</p>
                <div className="flex flex-wrap gap-6">
                    <button
                        className="p-button-raised shadow-xl px-8 py-4 text-xl rounded-full hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold border-0 flex items-center gap-2"
                        onClick={() => window.location.href = '/course-registration'}
                    >
                        <i className="pi pi-arrow-right"></i>
                        Bắt đầu ngay
                    </button>
                    <button
                        className="p-button-outlined px-8 py-4 text-xl rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200 border-2 border-blue-400 text-blue-700 font-bold flex items-center gap-2"
                    >
                        <i className="pi pi-info-circle"></i>
                        Tìm hiểu thêm
                    </button>
                </div>
            </div>
            <div className="flex-1 flex justify-center items-center relative z-10">
                <img
                    src="https://cdni.iconscout.com/illustration/premium/thumb/online-education-3678714-3098696.png"
                    alt="Education Illustration"
                    className="w-full max-w-lg rounded-3xl shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300 bg-white/70 backdrop-blur-lg"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </div>
            {/* Gradient background shape */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl"></div>
            </div>
        </section>
    );
} 