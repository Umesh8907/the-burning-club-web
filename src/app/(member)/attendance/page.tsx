'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import axios from '@/lib/axios';
import { formatDate } from '@/lib/utils';
import { 
  QrCode, 
  History, 
  CheckCircle2, 
  MapPin, 
  Clock,
  Flame,
  X,
  Camera,
  LayoutGrid,
  List,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { isSameDay, subDays } from 'date-fns';

interface AttendanceRecord {
  _id: string;
  checkIn: string;
  checkOut?: string;
  status: string;
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('calendar');
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/attendance');
      setRecords(res.data.data);
    } catch (error) {
      console.error('Failed to fetch attendance', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // Calculate Streak
  const currentStreak = useMemo(() => {
    if (records.length === 0) return 0;
    
    let streak = 0;
    let checkDate = new Date();
    
    // Sort records by checkIn descending
    const sorted = [...records].sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    
    // Today session check
    const hasToday = sorted.some(r => isSameDay(new Date(r.checkIn), new Date()));
    if (!hasToday) {
      checkDate = subDays(new Date(), 1);
    }

    for (let i = 0; i < 365; i++) {
      const hasAttendance = sorted.some(r => isSameDay(new Date(r.checkIn), checkDate));
      if (hasAttendance) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return streak;
  }, [records]);

  const startScanner = async () => {
    setIsScanning(true);
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        async (decodedText) => {
          await handleCheckIn(decodedText);
          stopScanner();
        },
        (errorMessage) => {}
      ).catch((err) => {
        console.error("Scanner failed to start", err);
        toast.error("Camera access denied or error occurred");
        setIsScanning(false);
      });
    }, 100);
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner", err);
      }
    }
    setIsScanning(false);
  };

  const handleCheckIn = async (qrSecret: string) => {
    try {
      toast.loading('Verifying location and membership...', { id: 'checkin' });
      
      let location = {};
      try {
        const pos: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (err) {
        console.warn("Geolocation failed", err);
      }

      await axios.post('/attendance/check-in', { 
        qrSecret,
        ...location
      });

      toast.success('BATTLE LOGGED! Welcome back.', { id: 'checkin' });
      fetchAttendance();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Check-in failed', { id: 'checkin' });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            BATTLE <span className="text-brand">STATIONS</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">
            Log your arrival. Claim your glory.
          </p>
        </div>

        {/* Streak Meter */}
        <div className="glass rounded-2xl px-6 py-4 flex items-center gap-4 border border-brand/20 shadow-[0_0_30px_rgba(255,77,0,0.1)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-r from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/30 relative">
             <Flame className="w-6 h-6 text-brand animate-pulse" />
             <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Burning Streak</p>
            <p className="text-2xl font-black text-white leading-none">
              {currentStreak} <span className="text-sm text-zinc-500">DAYS</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar: Scanner */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass rounded-3xl p-6 flex flex-col items-center justify-center text-center group border-zinc-800/50">
            <div className="w-full aspect-square bg-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-6 relative overflow-hidden flex items-center justify-center">
              {!isScanning ? (
                  <>
                    <div className="relative z-10">
                      <QrCode className="w-24 h-24 text-zinc-800 group-hover:text-brand transition-all duration-700" />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-br from-brand/10 to-transparent" />
                  </>
              ) : (
                  <div id="reader" className="w-full h-full overflow-hidden rounded-xl"></div>
              )}
            </div>
            
            <h3 className="text-lg font-black text-white mb-2 italic">
              {isScanning ? 'SCAN QR' : 'READY?'}
            </h3>
            
            <button 
              onClick={isScanning ? stopScanner : startScanner}
              className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 border ${
                isScanning 
                  ? 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800' 
                  : 'bg-brand text-white border-brand hover:shadow-[0_0_30px_rgba(255,77,0,0.4)] shadow-xl shadow-brand/20'
              }`}
            >
              {isScanning ? (
                <><X className="w-4 h-4" /> CANCEL</>
              ) : (
                <><Camera className="w-4 h-4" /> START CHECK-IN</>
              )}
            </button>
          </div>

          <div className="glass rounded-3xl p-6 border-zinc-800/50">
             <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-brand" />
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Daily Bonus</p>
             </div>
             <p className="text-xs text-zinc-500 font-bold leading-relaxed">
               Every check-in earns you <span className="text-white">50 XP</span> and keeps your burning streak alive.
             </p>
          </div>
        </div>

        {/* Main Content: Tabs + Log */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50">
              <button 
                onClick={() => setView('calendar')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                  view === 'calendar' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <LayoutGrid className="w-4 h-4" /> BATTLE MAP
              </button>
              <button 
                onClick={() => setView('list')}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all",
                  view === 'list' ? "bg-zinc-800 text-white shadow-xl" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <List className="w-4 h-4" /> WAR LOG
              </button>
            </div>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {view === 'calendar' ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AttendanceCalendar records={records} />
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <div key={i} className="glass p-8 rounded-3xl animate-pulse h-28" />
                    ))
                  ) : records.length > 0 ? (
                    records.map((record) => (
                      <div 
                         key={record._id} 
                         className="glass p-6 rounded-3xl flex items-center justify-between group hover:border-brand/30 transition-all border-l-4 border-l-brand"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-brand/5 flex items-center justify-center border border-brand/10">
                            <Flame className="w-7 h-7 text-brand" />
                          </div>
                          <div>
                            <p className="text-xl font-black text-white uppercase italic">SESSION COMPLETED</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                <Clock className="w-3 h-3" />
                                {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                                <MapPin className="w-3 h-3" />
                                THE BURNING CLUB
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-black text-lg">{formatDate(record.checkIn)}</p>
                          <p className="text-brand text-[8px] font-black uppercase tracking-[0.2em]">+50 XP</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="glass p-20 rounded-[3rem] text-center border-dashed border-zinc-800">
                      <p className="text-zinc-600 font-black uppercase tracking-[0.3em] italic">No battle logs found.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
