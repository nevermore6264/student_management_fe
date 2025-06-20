"use client";
import './globals.css';
import Sidebar from './components/layout/Sidebar';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

    return (
        <html lang="vi" className="min-h-screen w-full">
            <body className="m-0 p-0 min-h-screen w-full flex flex-col">
                <div className="flex flex-1 min-h-0 h-full w-full">
                    <Sidebar />
                    <main className="flex-1 min-h-screen flex flex-col">
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
                        {children}
                    </main>
                </div>
                <footer className="w-full bg-blue-100 text-slate-500 py-4 px-8 text-center mt-auto">
                    © {new Date().getFullYear()} Hệ thống Đăng ký tín chỉ. All rights reserved.
                </footer>
            </body>
        </html>
    );
}