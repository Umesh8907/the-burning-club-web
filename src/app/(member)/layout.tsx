'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { Shell } from "@/components/layout/Shell";
import { useEffect } from "react";

export default function MemberLayout({
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

  // Loading Guard: Prevent mismatched renders or blank screens during auth check
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand/20 border-t-brand rounded-full animate-spin mb-4" />
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-xs">Initializing Session</p>
      </div>
    );
  }

  return <Shell>{children}</Shell>;
}
