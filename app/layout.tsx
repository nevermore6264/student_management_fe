/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import './globals.css';
import Sidebar from './components/layout/Sidebar';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ToastProvider } from './context/ToastContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<{ maNguoiDung: string, tenNguoiDung: string } | null>(null);

    // Check if current page is auth page
    const isAuthPage = pathname?.startsWith('/auth');

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
        window.location.href = '/auth/login';
    };

    const menuItems = [
        {
            label: 'Trang chủ',
            icon: 'pi pi-home',
            command: () => router.push('/')
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
            <head>
                <title>Hệ thống đăng ký tín chỉ</title>
                <meta name="description" content="Hệ thống đăng ký tín chỉ, quản lý học tập cho sinh viên đại học." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="theme-color" content="#2563eb" />
                <link rel="icon" type="image/png" href="/logo.png" />
            </head>
            <body className={`m-0 p-0 min-h-screen w-full flex flex-col ${user ? 'pl-[285px]' : ''}`}>
                <ToastProvider>
                    {isAuthPage ? (
                        // Auth pages layout - no header/footer/sidebar
                        <div className="min-h-screen w-full">
                            {children}
                        </div>
                    ) : (
                        // Main app layout with header/footer/sidebar
                        <div className="flex min-h-screen w-full">
                            <Sidebar />
                            <main className="flex-1 flex flex-col">
                                {/* Menubar */}
                                <div className="sticky top-0 z-50 shadow-lg bg-white/80 backdrop-blur-md">
                                    <div className="mx-auto flex items-center justify-between px-6 py-3 w-full">
                                        <div className="flex items-center gap-3 font-extrabold leading-tight text-primary-900">
                                            <img
                                                src="/logo.png"
                                                alt="Logo"
                                                className="h-10 w-10 mr-2 drop-shadow-lg cursor-pointer"
                                                onClick={() => router.push('/')}
                                            />
                                            <h6 className="text-blue-700 text-2xl font-bold tracking-wide drop-shadow cursor-pointer"
                                                onClick={() => router.push('/')}
                                            >Hệ thống Đăng ký tín chỉ</h6>
                                        </div>
                                        <Menubar
                                            model={menuItems}
                                            end={end}
                                            className="border-none shadow-none font-semibold bg-transparent text-blue-800   "
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
                    )}
                    {!isAuthPage && (
                        <footer className="w-full bg-blue-100 text-slate-500 py-4 px-8 text-center mt-auto">
                            © {new Date().getFullYear()} Hệ thống Đăng ký tín chỉ. All rights reserved.
                        </footer>
                    )}
                </ToastProvider>
            </body>
        </html>
    );
}