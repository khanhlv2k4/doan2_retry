'use client';

import React from 'react';
import RoleBasedLayout from '@/components/RoleBasedLayout';

function AdminLayout({ children, isSidebarExpanded = false }) {
  return (
    <RoleBasedLayout
      requiredRole="admin"
      title="Admin Dashboard"
      isSidebarExpanded={isSidebarExpanded}
    >
      {children}
    </RoleBasedLayout>
  );
}

export default AdminLayout;