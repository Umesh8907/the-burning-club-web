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
  ExternalLink
} from 'lucide-react';
import { motion } from "framer-motion";
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-black uppercase tracking-widest animate-pulse">Igniting Intelligence...</p>
      </div>
    </div>
  );

  const statCards = [
    { 
      name: 'Active Members', 
      value: stats?.activeMembers || 0, 
      icon: Users, 
      change: '+12%', 
      trend: 'up',
      detail: `${stats?.totalMembers || 0} TOTAL`
    },
    { 
      name: "Today's Attendance", 
      value: stats?.attendanceToday || 0, 
      icon: Activity, 
      change: '+5%', 
      trend: 'up',
      detail: 'STABLE LOAD'
    },
    { 
      name: 'Monthly Revenue', 
      value: formatCurrency((stats?.revenueThisMonth || 0) * 100), 
      icon: Wallet, 
      change: '+18%', 
      trend: 'up',
      detail: 'RECORD HIGH'
    },
    { 
      name: 'Total Revenue', 
      value: formatCurrency((stats?.totalRevenue || 0) * 100), 
      icon: TrendingUp, 
      change: '+24%', 
      trend: 'up',
      detail: 'LIFE-TIME'
    },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Command Center</h1>
          <p className="text-zinc-500 mt-1 uppercase tracking-widest text-xs font-bold">Real-time gym intelligence & tactical overview</p>
        </div>
        <div className="hidden md:block">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">System Status: <span className="text-green-500">OPTIMAL</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-[32px] group hover:border-brand/30 transition-all border border-zinc-800/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-brand/10 rounded-2xl group-hover:bg-brand group-hover:text-white transition-all duration-500">
                <stat.icon className="w-6 h-6 text-brand group-hover:text-white" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter",
                stat.trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{stat.name}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              <span className="text-[10px] font-black text-brand uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{stat.detail}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 glass rounded-[32px] p-8 h-[450px] flex flex-col relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Revenue Trajectory</h3>
            <div className="flex gap-2">
               {['7D', '1M', '1Y'].map(t => (
                 <button key={t} className="px-3 py-1 rounded-lg text-[10px] font-black bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700 transition-all">{t}</button>
               ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-zinc-900/40 rounded-3xl border border-zinc-800/50 flex flex-col items-center justify-center border-dashed relative z-10">
            <TrendingUp className="w-12 h-12 text-zinc-800 mb-4 group-hover:text-brand/20 transition-colors" />
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-[0.2em] italic">Intelligence Visualization Ready</p>
          </div>
          {/* Decorative background flare */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand/5 rounded-full blur-[100px]" />
        </div>

        {/* Live Check-ins Feed */}
        <div className="glass rounded-[32px] p-8 flex flex-col border border-zinc-800/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Live Records</h3>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             {stats?.recentAttendance && stats.recentAttendance.length > 0 ? (
               stats.recentAttendance.map((log: any, i: number) => (
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={log._id} 
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-brand/50 transition-colors">
                      <Users className="w-5 h-5 text-zinc-500 group-hover:text-brand" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-brand transition-colors truncate">{log.userId?.name || 'Unknown User'}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {formatDate(log.checkIn)}
                      </p>
                    </div>
                 </motion.div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
                 <Activity className="w-8 h-8 opacity-20" />
                 <p className="text-[10px] font-black uppercase tracking-widest">No activity logged today</p>
               </div>
             )}
          </div>
          
          <Link 
            href="/admin/users" 
            className="mt-8 text-brand text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors text-center flex items-center justify-center gap-2 group"
          >
            Tactical Member List
            <ExternalLink className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
