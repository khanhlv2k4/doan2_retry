'use client';

import { Bell, UserCircle, Settings, LogOut, Search, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface AdminHeaderProps {
  toggleSidebar: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  // Mẫu thông báo (giữ nguyên nếu đã có logic fetch real notifications)
  const notifications = [
    {
      id: 1,
      title: 'Điểm danh lớp CNTT đã hoàn thành',
      time: '10 phút trước',
      read: false,
    },
    {
      id: 2,
      title: 'Yêu cầu phê duyệt khóa học mới',
      time: '1 giờ trước',
      read: false,
    },
    {
      id: 3,
      title: 'Báo cáo điểm danh tháng đã sẵn sàng',
      time: 'Hôm qua',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Generate a default avatar URL based on user's name
  const getDefaultAvatarUrl = () => {
    const name = user?.name || 'Admin User';
    const color = '6366F1';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff`;
  };

  return (
    <header className="w-full h-16 bg-black text-white border-b border-gray-800 flex items-center justify-between px-6">
      {/* Left side - Logo + title area */}
      <div className="flex items-center">
        {/* Hamburger menu button is rendered elsewhere */}
        <h1 className="text-xl font-semibold text-white ml-16">Admin Dashboard</h1>
      </div>

      {/* Empty space to prevent search box from overlapping with hamburger button */}
      <div className="w-240 flex-shrink-0"></div>

      {/* Search - positioned with absolute to avoid conflicts */}
      <div className="absolute left-[280px] lg:left-[320px] top-4">
        <div id="admin-header-search" className="relative w-60 hidden md:block">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-8 bg-gray-800 border-gray-700 text-white focus:bg-gray-700"
          />
        </div>
      </div>

      {/* Right Actions - always positioned at the right edge */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto mr-5">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 text-white hover:text-gray-300 relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1 md:gap-2 text-sm font-medium text-white hover:text-gray-300">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center border border-gray-600">
                {user?.avatarUrl || user?.user_image ? (
                  <Image
                    src={user.avatarUrl || user.user_image || ''}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src={getDefaultAvatarUrl()}
                    alt="Default Avatar"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                )}
              </div>
              <span className="hidden md:inline-block truncate max-w-[100px]">{user?.name || 'Admin'}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white text-gray-900">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/profile" className="flex items-center w-full">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Hồ sơ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/profile/avatar" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Đổi ảnh đại diện</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}