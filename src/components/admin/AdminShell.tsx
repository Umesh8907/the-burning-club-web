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
  LogOut,
  Menu,
  X,
  Flame,
  User as UserIcon,
  ChevronRight,
  Bell,
  Search,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { admin, logout } = useAuthStore();

  const links = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Members', href: '/admin/users', icon: Users },
    { name: 'Plans', href: '/admin/plans', icon: CreditCard },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Attendance', href: '/admin/attendance', icon: QrCode },
    { name: 'Measurements', href: '/admin/measurements', icon: Activity },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
  ];

  const breadcrumbs = pathname?.split('/').filter(Boolean).map((segment, index, array) => {
      const href = `/${array.slice(0, index + 1).join('/')}`;
      return { name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '), href };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar for desktop */}
      <aside className="hidden lg:flex lg:shrink-0">
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white shadow-sm">
          <div className="flex items-center h-16 shrink-0 px-6 border-b border-gray-100">
            <Flame className="w-8 h-8 text-indigo-600" />
            <span className="ml-3 text-lg font-bold tracking-tight text-gray-900 uppercase">Admin Portal</span>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-4 py-6 space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors group",
                      isActive 
                        ? "bg-indigo-50 text-indigo-700" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <link.icon className={cn(
                      "mr-3 h-5 w-5",
                      isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
                    )} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="shrink-0 flex border-t border-gray-200 p-4">
            <div className="shrink-0 w-full group block">
                <div className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700">{admin?.name}</p>
                        <button 
                            onClick={() => logout('admin')}
                            className="text-xs font-medium text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                            <LogOut className="w-3 h-3" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                 <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500">
                    <Menu className="w-6 h-6" />
                </button>
                <div className="hidden sm:flex items-center text-xs text-gray-400 gap-2 uppercase tracking-widest font-bold">
                    {breadcrumbs?.map((crumb, i) => (
                        <React.Fragment key={crumb.href}>
                            {i > 0 && <ChevronRight className="w-3 h-3 text-gray-300" />}
                            <Link href={crumb.href} className={cn(
                                "hover:text-gray-700 transition-colors",
                                i === breadcrumbs.length - 1 && "text-indigo-600"
                            )}>
                                {crumb.name}
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Quick search..." 
                        className="block w-64 pl-10 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-500 relative transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 focus:outline-none bg-gray-50">
            <div className="max-w-7xl mx-auto h-full">
                {children}
            </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
              <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" aria-hidden="true" onClick={() => setSidebarOpen(false)}></div>
              <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 h-full">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button onClick={() => setSidebarOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                          <X className="h-6 w-6 text-white" />
                      </button>
                  </div>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="shrink-0 flex items-center px-4">
                        <Flame className="w-8 h-8 text-indigo-600" />
                        <span className="ml-3 text-lg font-bold text-gray-900 uppercase">Admin</span>
                    </div>
                    <nav className="mt-5 px-4 space-y-1">
                         {links.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                                    pathname === link.href ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <link.icon className="mr-4 h-5 w-5 text-gray-400" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                  </div>
                  <div className="shrink-0 flex border-t border-gray-200 p-4">
                      <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                          <div className="ml-3">
                              <p className="text-sm font-medium text-gray-700">{admin?.name}</p>
                              <button onClick={() => logout('admin')} className="text-xs text-gray-500">Sign out</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
