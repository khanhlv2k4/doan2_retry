'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  BarChart,
  Settings,
  LogOut,
  User,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';

const navItems = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { path: '/admin/users', label: 'Người dùng', icon: Users },
  { path: '/admin/students', label: 'Sinh viên', icon: GraduationCap },
  { path: '/admin/instructors', label: 'Giảng viên', icon: Users },
  { path: '/admin/courses', label: 'Khóa học', icon: BookOpen },
  { path: '/admin/attendance', label: 'Điểm danh', icon: ClipboardCheck },
  { path: '/admin/logs', label: 'Nhật ký hệ thống', icon: FileText },
  { path: '/admin/reports', label: 'Báo cáo', icon: BarChart },
  { path: '/admin/settings', label: 'Hệ thống', icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay khi sidebar mở */}
      <div
        className={cn(
          'fixed inset-0 z-30 bg-black bg-opacity-40 transition-opacity duration-300',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={onClose}
        aria-label="Close sidebar"
      />
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ paddingLeft: '20px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo and title */}
          <div className="flex items-center justify-start h-16 px-4 bg-gray-800 border-b border-gray-700" style={{ position: 'relative' }}>
            <div className="relative w-full" style={{ position: 'relative', height: '100%' }}>
              {/* Add an empty space div for the hamburger button area */}
              <div className="w-12 absolute left-0"></div>



              {/* Close button */}
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          {/* Nav Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname ? (pathname === item.path || pathname.startsWith(item.path)) : false;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                        isActive
                          ? "bg-indigo-700 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {/* User Profile Section */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border border-gray-600">
                {user?.avatarUrl || user?.user_image ? (
                  <Image
                    src={user.avatarUrl || user.user_image || '/avatars/avatar1.png'}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <User size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.email || ''}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="p-3 text-center border-t border-gray-800">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Attendance System
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}