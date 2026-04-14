'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { AdminShell } from "@/components/admin/AdminShell";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isInitialized, admin } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  useEffect(() => {
    if (isInitialized && !admin && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [isInitialized, admin, pathname, router]);

  // If it's the login page, don't wrap in AdminShell
  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  // Prevent flash of content if not logged in
  if (isInitialized && !admin) {
    return null;
  }

  return <AdminShell>{children}</AdminShell>;
}
