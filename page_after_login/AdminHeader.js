'use client';

import React, { useState } from 'react';
import {
  Bell,
  UserCircle,
  Settings,
  LogOut,
  Search,
  ChevronDown
} from 'lucide-react';
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

function AdminHeader() {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mẫu thông báo
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

  return (
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
      {/* Search with 10% left margin */}
      <div className="relative w-64 hidden md:block ml-[78%]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm..."
          className="pl-8 bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification dropdown */}
          <div
            className={cn(
              "absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200",
              showNotifications ? "block" : "hidden"
            )}
          >
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-medium">Thông báo</h3>
              <button className="text-xs text-blue-600 hover:underline">Đánh dấu tất cả đã đọc</button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 border-b border-gray-100 hover:bg-gray-50",
                    !notification.read && "bg-blue-50"
                  )}
                >
                  <div className="flex justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              ))}
            </div>
            <div className="p-2 text-center border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:underline">Xem tất cả thông báo</button>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              <UserCircle className="h-6 w-6" />
              <span className="hidden md:inline-block">{user?.fullName || 'Admin'}</span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
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

export default AdminHeader;