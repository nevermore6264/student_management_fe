"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        // Nếu chưa đăng nhập thì chuyển hướng về login
        if (typeof window !== 'undefined' && !localStorage.getItem('token')) {
            router.push('/auth/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Main content */}
            <main className="flex-1 flex items-center justify-center">
                <div className="text-2xl font-bold text-primary">Chào mừng đến với Dashboard!</div>
            </main>
        </div>
    );
} 