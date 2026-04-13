'use client';

import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AttendanceRecord {
  _id: string;
  checkIn: string;
  checkOut?: string;
  status: string;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getAttendanceForDay = (day: Date) => {
    return records.filter(record => isSameDay(new Date(record.checkIn), day));
  };

  return (
    <div className="glass rounded-3xl p-6 border border-zinc-800/50">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
            <Trophy className="w-6 h-6 text-brand" />
            BATTLE LOG
          </h3>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] uppercase">
            {format(currentMonth, 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-zinc-800"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all border border-transparent hover:border-zinc-800"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 mb-4">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div key={day} className="text-center text-[10px] font-black text-zinc-600 tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-px bg-zinc-800/50 rounded-2xl overflow-hidden border border-zinc-800/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMonth.toString()}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-7 col-span-7 bg-zinc-950"
          >
            {days.map((day, idx) => {
              const attendance = getAttendanceForDay(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const hasAttendance = attendance.length > 0;

              return (
                <div 
                  key={day.toString()}
                  className={cn(
                    "min-h-[80px] p-2 border border-zinc-900 transition-all relative group",
                    !isCurrentMonth ? "opacity-20 pointer-events-none" : "hover:bg-zinc-900/50",
                    isToday && "bg-brand/5 shadow-[inset_0_0_20px_rgba(255,77,0,0.05)]"
                  )}
                >
                  <span className={cn(
                    "text-xs font-black",
                    isToday ? "text-brand" : "text-zinc-600",
                    hasAttendance && "text-white"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {hasAttendance && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative"
                       >
                          <Flame className="w-8 h-8 text-brand/20 blur-sm absolute inset-0 animate-pulse" />
                          <Flame className="w-8 h-8 text-brand relative z-10" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand rounded-full shadow-[0_0_10px_#ff4d00]" />
                       </motion.div>
                    </div>
                  )}

                  {/* Tooltip on Hover */}
                  <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    {attendance.map((rec, i) => (
                      <div key={i} className="bg-zinc-900 text-[8px] font-black text-white px-1.5 py-0.5 rounded border border-zinc-800 shadow-xl whitespace-nowrap">
                        {format(new Date(rec.checkIn), 'HH:mm')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand shadow-[0_0_10px_#ff4d00]" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Victory (Attended)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-brand bg-brand/10" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Today</span>
        </div>
      </div>
    </div>
  );
}
