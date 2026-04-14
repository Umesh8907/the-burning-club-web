'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Ticket, 
  QrCode, 
  LineChart, 
  LogOut,
  Menu,
  X,
  Flame,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Shell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { customer, logout } = useAuthStore();

  const isAdmin = customer?.role === 'admin';

  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/admin/users', icon: Users },
    { name: 'Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  ];

  const memberLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Attendance', href: '/attendance', icon: QrCode },
    { name: 'Progress', href: '/measurements', icon: LineChart },
    { name: 'Membership', href: '/plans', icon: CreditCard },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Top Nav */}
      <div className="lg:hidden flex items-center justify-between p-4 glass border-b border-zinc-800/50 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-brand" />
          <span className="font-bold text-lg tracking-tight">THE BURNING CLUB</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-zinc-400">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen glass border-r border-zinc-800/50 sticky top-0 p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <Flame className="w-10 h-10 text-brand" />
            <h2 className="font-black text-xl tracking-tighter text-white">THE BURNING CLUB</h2>
          </div>

          <nav className="flex-1 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                  pathname === link.href 
                    ? "bg-brand/10 text-brand shadow-[inset_0_0_15px_rgba(255,77,0,0.1)]" 
                    : "text-zinc-500 hover:text-white hover:bg-zinc-800/50"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <div className="flex items-center gap-3 px-2 py-3 border-t border-zinc-800/50 pt-6">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                <UserIcon className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{customer?.name}</p>
                <p className="text-xs text-zinc-500 uppercase tracking-widest">{customer?.role}</p>
              </div>
            </div>
            
            <button 
              onClick={() => logout('customer')}
              className="flex items-center gap-3 w-full px-4 py-3 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 lg:hidden"
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-y-0 left-0 w-72 bg-zinc-950 border-r border-zinc-800 z-70 p-6 lg:hidden"
              >
                <div className="flex items-center justify-between mb-10">
                   <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8 text-brand" />
                    <span className="font-bold text-white">TBC</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="text-zinc-400">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* ... same link map ... */}
                <nav className="space-y-2">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                        pathname === link.href ? "bg-brand/10 text-brand" : "text-zinc-500 hover:text-white"
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
