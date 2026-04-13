'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { Shell } from "@/components/layout/Shell";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized, checkAuth]);

  return <Shell>{children}</Shell>;
}
