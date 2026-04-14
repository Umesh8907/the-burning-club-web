'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Zap, 
  Calendar, 
  ChevronRight, 
  Activity, 
  QrCode,
  Flame,
  Clock
} from 'lucide-react';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Link from "next/link";

interface AttendanceRecord {
  _id: string;
  checkIn: string;
}

interface Subscription {
  _id: string;
  planId: {
    name: string;
    price: number;
  };
  endDate: string;
  status: string;
}

export default function DashboardPage() {
  const { customer, isInitialized } = useAuthStore();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  if (!isInitialized || !customer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-pulse">
        <Flame className="w-12 h-12 text-zinc-800" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Initializing Command Room...</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attRes, subRes] = await Promise.all([
          axios.get('/users/attendance'),
          axios.get('/users/subscriptions')
        ]);
        setAttendance(attRes.data.data);
        // Get the latest active subscription
        const activeSub = subRes.data.data.find((s: any) => s.status === 'active');
        setSubscription(activeSub || subRes.data.data[0]);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const isActive = customer?.membershipStatus === 'active';

  // Calculate streak (simple version: count consecutive days in recent attendance)
  const calculateStreak = () => {
    if (attendance.length === 0) return 0;
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let lastDate = new Date(attendance[0].checkIn);
    lastDate.setHours(0, 0, 0, 0);
    
    // If last check-in was today or yesterday, start counting
    const diff = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff > 1) return 0;

    streak = 1;
    for (let i = 1; i < attendance.length; i++) {
       const currentDate = new Date(attendance[i].checkIn);
       currentDate.setHours(0, 0, 0, 0);
       const dayDiff = (lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);
       if (dayDiff === 1) {
         streak++;
         lastDate = currentDate;
       } else if (dayDiff > 1) {
         break;
       }
    }
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            PUSH YOUR <span className="text-brand">LIMITS</span>, {customer?.name?.split(' ')[0]?.toUpperCase() || 'SOLDIER'}
          </h1>
          <p className="text-zinc-500 mt-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            TODAY IS {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
          </p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-brand/10 border border-brand/20 rounded-full">
           <div className={`w-2 h-2 rounded-full animate-pulse ${isActive ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
           <span className="text-xs font-bold uppercase tracking-wider text-brand">
             {isActive ? 'Membership Active' : 'Membership Inactive'}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Status Card */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 transform group-hover:scale-110 transition-transform duration-500 opacity-10">
            <Flame className="w-48 h-48 text-brand" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-1">Your Plan</p>
            <h2 className="text-3xl font-black text-white mb-6">
              {subscription?.planId?.name || 'NO ACTIVE PLAN'}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Daily Streak</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-white">{streak}</span>
                  <span className="text-zinc-500 text-xs mb-1">DAYS</span>
                </div>
              </div>
              <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Valid Until</p>
                <div className="flex items-end gap-2 text-white">
                  <span className="text-sm font-bold truncate">
                    {subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/attendance"
              className="mt-8 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-brand hover:text-white transition-all text-center"
            >
              <QrCode className="w-5 h-5" />
              GO TO CHECK-IN
            </Link>
          </div>
        </div>

        {/* Side Stats */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 border-l-4 border-l-yellow-500">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Total Sessions</p>
                <p className="text-xl font-black text-white">{attendance.length}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 border-l-4 border-l-brand">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-brand" />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Body Weight</p>
                <p className="text-xl font-black text-white">{customer?.metadata?.weight || '--'} <span className="text-[10px] text-zinc-500">KG</span></p>
              </div>
            </div>
          </div>

          {!isActive && (
            <Link href="/plans" className="block">
              <div className="bg-brand rounded-3xl p-6 text-white group cursor-pointer hover:shadow-[0_0_30px_rgba(255,77,0,0.4)] transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-lg">RENEWAL REQUIRED</p>
                    <p className="text-white/70 text-xs font-bold uppercase">Membership is {customer?.membershipStatus}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          )}

          {isActive && subscription && (
            <div className="glass rounded-3xl p-6 text-white border-l-4 border-l-green-500">
               <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Membership</p>
               <div className="text-lg font-black">{subscription?.planId?.name || 'ACTIVE TRANSFORMATION'}</div>
               <p className="text-xs text-zinc-500 font-bold mt-1">Status: <span className="text-green-500">ACTIVE</span></p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4 pt-4">
        <h3 className="text-xl font-black text-white px-2">RECENT WAR STORIES</h3>
        <div className="space-y-3">
          {loading ? (
             [1, 2, 3].map((i) => (
              <div key={i} className="glass p-4 rounded-2xl animate-pulse h-16" />
            ))
          ) : attendance.length > 0 ? (
            attendance.slice(0, 5).map((record) => (
              <div key={record._id} className="glass p-4 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs">
                    <Clock className="w-4 h-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase italic">GYM SESSION</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest">
                      {formatDate(record.checkIn)} AT {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className="text-green-500 text-xs font-black">+50 XP</div>
              </div>
            ))
          ) : (
            <div className="glass p-8 rounded-2xl text-center">
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest italic">No battles fought yet. Start your journey!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
