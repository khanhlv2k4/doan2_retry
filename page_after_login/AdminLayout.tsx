'use client';

import { ReactNode, useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  // Mặc định sidebar đóng (không hiển thị)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router, user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!isLoggedIn || user?.role !== 'admin') return null;

  return (
    <div className="relative h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {/* Main Content: đẩy qua phải khi sidebar mở */}
      <div
        className={`transition-all duration-300 h-full flex flex-col ${
          isSidebarOpen ? 'ml-64' : ''
        }`}
      >
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}