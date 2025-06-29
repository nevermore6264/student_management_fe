'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistrationIndexPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to select period page
        router.push('/registration/select-period');
    }, [router]);

    return (
        <div className="card">
            <div className="flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2">Đang chuyển hướng...</p>
                </div>
            </div>
        </div>
    );
} 