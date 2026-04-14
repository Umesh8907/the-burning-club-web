'use client';

import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink,
  Plus,
  Ticket,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import Link from "next/link";

interface AdminStats {
  activeMembers: number;
  totalMembers: number;
  attendanceToday: number;
  revenueThisMonth: number;
  totalRevenue: number;
  recentAttendance: any[];
}

export default function AdminDashboard() {
  const { admin } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/dashboard');
        setStats(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  const statCards = [
    { 
      name: 'Active Members', 
      value: stats?.activeMembers || 0, 
      icon: Users, 
      change: '+12%', 
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      name: "Today's Attendance", 
      value: stats?.attendanceToday || 0, 
      icon: Activity, 
      change: '+5%', 
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      name: 'Monthly Revenue', 
      value: formatCurrency((stats?.revenueThisMonth || 0) * 100), 
      icon: Wallet, 
      change: '+18%', 
      trend: 'up',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      name: 'Total Revenue', 
      value: formatCurrency((stats?.totalRevenue || 0) * 100), 
      icon: TrendingUp, 
      change: '+24%', 
      trend: 'up',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back, {admin?.name || 'Admin'}. Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
            <Link href="/admin/plans" className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-50 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Manage Plans
            </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
                stat.trend === 'up' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-lg">Recent Check-ins</h3>
            <Link href="/admin/attendance" className="text-indigo-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Member</th>
                        <th className="px-6 py-3 font-semibold">Time</th>
                        <th className="px-6 py-3 font-semibold">Date</th>
                        <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {stats?.recentAttendance && stats.recentAttendance.length > 0 ? (
                        stats.recentAttendance.map((log: any) => (
                            <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                            {log.userId?.name?.charAt(0) || '?'}
                                        </div>
                                        <span className="font-medium text-gray-900">{log.userId?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {formatDate(log.checkIn)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-indigo-600">
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                                No check-ins recorded today
                            </td>
                        </tr>
                    )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Quick Actions / Stats */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg border-b border-gray-50 pb-2">System Health</h3>
                <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">API Status</span>
                        <span className="flex items-center gap-1.5 text-green-600 font-medium">
                            <span className="w-2 h-2 rounded-full bg-green-600"></span>
                            Online
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Storage</span>
                        <span className="text-gray-900 font-medium">42% Used</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-50">
                        <Link href="/admin/users" className="flex items-center justify-between text-sm text-gray-600 hover:text-indigo-600 transition-colors group">
                            <span>Manage Members</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-indigo-600 rounded-xl shadow-sm p-6 text-white overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="font-bold mb-1">New Features!</h3>
                    <p className="text-indigo-100 text-sm mb-4">The coupon management system is now live. Start creating offers!</p>
                    <Link href="/admin/coupons" className="inline-block px-4 py-2 bg-white text-indigo-600 text-sm font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm">
                        Manage Coupons
                    </Link>
                </div>
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500 rounded-full opacity-20"></div>
                <div className="absolute bottom-0 right-0 mr-8 mb-4">
                    <Ticket className="w-12 h-12 text-indigo-400 opacity-30 rotate-12" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
