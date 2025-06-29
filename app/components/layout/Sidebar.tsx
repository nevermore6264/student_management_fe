'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const menuItems = [
    {
        label: 'Trang chủ',
        icon: 'pi pi-home',
        path: '/',
        roles: ['admin', 'sv', 'gv']
    },
    {
        label: 'Thông tin cá nhân',
        icon: 'pi pi-user',
        path: '/profile/teacher',
        roles: ['gv']
    },
    {
        label: 'Thông tin cá nhân',
        icon: 'pi pi-user',
        path: '/profile',
        roles: ['sv']
    },
    {
        label: 'Quản lý người dùng',
        icon: 'pi pi-users',
        path: '/users',
        roles: ['admin'],
        subItems: [
            { label: 'Quản lý sinh viên', path: '/users/students', roles: ['admin'] },
            { label: 'Quản lý giảng viên', path: '/users/lecturers', roles: ['admin'] },
            { label: 'Phân quyền', path: '/users/roles', roles: ['admin'] }
        ]
    },
    {
        label: 'Quản lý Khoa & Lớp',
        icon: 'pi pi-building',
        path: '/departments',
        roles: ['admin'],
        subItems: [
            { label: 'Danh sách Khoa', path: '/departments', roles: ['admin'] },
            { label: 'Danh sách Lớp', path: '/departments/classes', roles: ['admin'] }
        ]
    },
    {
        label: 'Quản lý Học phần',
        icon: 'pi pi-book',
        path: '/courses',
        roles: ['admin'],
        subItems: [
            { label: 'Danh sách Học phần', path: '/courses/list', roles: ['admin'] },
            { label: 'Lớp học phần', path: '/courses/classes', roles: ['admin'] },
            { label: 'Thời khóa biểu', path: '/courses/schedule', roles: ['admin'] }
        ]
    },
    {
        label: 'Quản lý đăng ký',
        icon: 'pi pi-calendar',
        path: '/registration-management',
        roles: ['admin'],
        subItems: [
            { label: 'Đợt đăng ký', path: '/registration-management/periods', roles: ['admin'] },
            { label: 'Danh sách đăng ký', path: '/registration-management/list', roles: ['admin'] }
        ]
    },
    {
        label: 'Giảng dạy',
        icon: 'pi pi-book',
        path: '',
        roles: ['gv'],
        subItems: [
            {
                label: 'Lịch giảng dạy',
                icon: 'pi pi-calendar',
                path: '/schedule/teacher',
                roles: ['gv']
            },
            {
                label: 'Quản lý học phần',
                icon: 'pi pi-users',
                path: '/courses',
                roles: ['gv']
            },
            {
                label: 'Tổng quan điểm',
                icon: 'pi pi-chart-bar',
                path: '/grades/teacher',
                roles: ['gv']
            },
        ]
    },
    {
        label: 'Học tập',
        icon: 'pi pi-book',
        path: '',
        roles: ['sv'],
        subItems: [
            {
                label: 'Đăng ký học phần',
                icon: 'pi pi-calendar-plus',
                path: '/registration',
                subItems: [
                    { label: 'Đợt đăng ký', path: '/registration/periods', roles: ['sv'] },
                    { label: 'Đăng ký môn học', path: '/registration/courses', roles: ['sv'] },
                    { label: 'Lịch sử đăng ký', path: '/registration/history', roles: ['sv'] }
                ]
            },
            {
                label: 'Kế hoạch học tập',
                icon: 'pi pi-list',
                path: '/study-plan',
                roles: ['sv']
            },
            {
                label: 'Thời khoá biểu',
                icon: 'pi pi-list',
                path: '/schedule',
                roles: ['sv']
            },
            {
                label: 'Kết quả học tập',
                icon: 'pi pi-chart-bar',
                path: '/academic-results',
                roles: ['sv']
            }
        ]
    },
    {
        label: 'Báo cáo',
        icon: 'pi pi-file',
        path: '/reports',
        roles: ['admin'],
        subItems: [
            { label: 'Thống kê đăng ký', path: '/reports/registration', roles: ['admin'] },
            { label: 'Kết quả học tập', path: '/reports/academic', roles: ['admin'] },
            { label: 'Báo cáo tổng hợp', path: '/reports/summary', roles: ['admin'] }
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string>("");

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        try {
            const storedRoles = JSON.parse(localStorage.getItem('vaiTros') || '[]');
            setRoles(storedRoles.toString().toLowerCase());
        } catch {
            setRoles("");
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 w-72 min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 flex flex-col shadow-xl rounded-r-2xl border-r border-blue-100 pb-6 z-40">
            {/* Header */}
            <div className="p-4 border-b border-blue-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-md">
                        <i className="pi pi-graduation-cap text-white text-2xl font-bold"></i>
                    </div>
                    <div>
                        <h1 className="text-blue-900 font-extrabold text-l leading-tight">Hệ thống đăng ký tín chỉ</h1>
                        <p className="text-blue-400 pt-2 text-xs font-medium">Trường Đại học Sư Phạm Kỹ thuật</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {menuItems
                    .filter(item => !item.roles || item.roles.some(r => roles == (r)))
                    .map((item) => (
                        <div key={item.path} className="mb-1">
                            <Link
                                href={item.path}
                                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 text-lg font-semibold
                                    ${pathname === item.path
                                        ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md'
                                        : 'text-blue-900 hover:bg-blue-100 hover:text-blue-700 hover:shadow'}
                                `}
                            >
                                <span className={`p-2 rounded-xl flex items-center justify-center text-xl transition-all duration-200
                                    ${pathname === item.path
                                        ? 'bg-white/20 text-white'
                                        : 'bg-blue-100 text-blue-500 group-hover:bg-blue-200 group-hover:text-blue-700'}
                                `}>
                                    <i className={`${item.icon}`}></i>
                                </span>
                                <span>{item.label}</span>
                            </Link>
                            {item.subItems && (
                                <div className="ml-7 mt-1 space-y-1">
                                    {item.subItems
                                        .filter(sub => !sub.roles || sub.roles.some(r => roles.includes(r)))
                                        .map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                href={subItem.path}
                                                className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-all duration-200 text-base
                                                    ${pathname === subItem.path
                                                        ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow'
                                                        : 'text-blue-700 hover:bg-blue-100 hover:text-blue-700'}
                                                `}
                                            >
                                                <span className={`w-2 h-2 rounded-full mr-2
                                                    ${pathname === subItem.path ? 'bg-white' : 'bg-blue-400'}
                                                `}></span>
                                                <span>{subItem.label}</span>
                                            </Link>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-100 mt-2">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <i className="pi pi-user text-white text-xl"></i>
                    </div>
                    <div className="flex-1">
                        <p className="text-blue-900 text-base font-bold">{user?.tenNguoiDung}</p>
                        <p className="text-blue-500 text-sm capitalize">{user?.maNguoiDung}</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 