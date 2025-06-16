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
        roles: ['admin', 'gv'],
        subItems: [
            { label: 'Danh sách Học phần', path: '/courses/list', roles: ['admin', 'gv'] },
            { label: 'Lớp học phần', path: '/courses/classes', roles: ['admin', 'gv'] },
            { label: 'Thời khóa biểu', path: '/courses/schedule', roles: ['admin', 'gv'] }
        ]
    },
    {
        label: 'Đăng ký học phần',
        icon: 'pi pi-calendar-plus',
        path: '/registration',
        roles: ['sv'],
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
        roles: ['sv', 'gv']
    },
    {
        label: 'Quản lý điểm',
        icon: 'pi pi-chart-bar',
        path: '/grades',
        roles: ['admin', 'gv', 'sv'],
        subItems: [
            { label: 'Nhập điểm', path: '/grades/input', roles: ['gv'] },
            { label: 'Xem điểm', path: '/grades/view', roles: ['sv', 'gv'] }
        ]
    },
    {
        label: 'Báo cáo',
        icon: 'pi pi-file',
        path: '/reports',
        roles: ['admin', 'sv', 'gv'],
        subItems: [
            { label: 'Thống kê đăng ký', path: '/reports/registration', roles: ['admin', 'sv', 'gv'] },
            { label: 'Kết quả học tập', path: '/reports/academic', roles: ['admin', 'sv', 'gv'] }
        ]
    }
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [roles, setRoles] = useState<string>("");

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
        <div className="h-screen w-64 bg-blue-50 flex flex-col">
            <nav className="mt-4 flex-1">
                {menuItems
                    .filter(item => !item.roles || item.roles.some(r => roles == (r)))
                    .map((item) => (
                        <div key={item.path} className="mb-2">
                            <Link
                                href={item.path}
                                className={`flex items-center gap-2 w-full p-3 rounded-lg transition
                                    ${pathname === item.path
                                        ? 'bg-white text-primary font-semibold shadow'
                                        : 'text-gray-700 hover:bg-blue-100'}
                                `}
                            >
                                <i className={`${item.icon} text-lg`}></i>
                                <span>{item.label}</span>
                            </Link>
                            {item.subItems && (
                                <div className="ml-4">
                                    {item.subItems
                                        .filter(sub => !sub.roles || sub.roles.some(r => roles.includes(r)))
                                        .map((subItem) => (
                                            <Link
                                                key={subItem.path}
                                                href={subItem.path}
                                                className={`flex items-center gap-2 w-full p-2 rounded-lg transition text-sm
                                                    ${pathname === subItem.path
                                                        ? 'bg-white text-primary font-semibold shadow'
                                                        : 'text-gray-600 hover:bg-blue-100'}
                                                `}
                                            >
                                                <span>{subItem.label}</span>
                                            </Link>
                                        ))}
                                </div>
                            )}
                        </div>
                    ))}
            </nav>
        </div>
    );
} 