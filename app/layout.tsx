import './globals.css';
import Sidebar from './components/layout/Sidebar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" className="min-h-screen w-full">
            <body className="m-0 p-0 min-h-screen w-full flex flex-col">
                <div className="flex flex-1 min-h-0 h-full w-full">
                    <Sidebar />
                    <main className="flex-1 min-h-screen flex flex-col">
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