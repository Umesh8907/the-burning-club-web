'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, ChevronRight, Activity, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function LandingHero() {
  const { user } = useAuthStore();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black/20 z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center lg:text-left grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse shadow-[0_0_10px_#FF4D00]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand">Now Launching Elite Operations</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] mb-8">
             FORGED IN <span className="text-gradient">FIRE.</span> <br />
             REBORN IN <span className="text-gradient">STRENGTH.</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-lg mb-10 font-bold uppercase tracking-tight leading-relaxed">
            The world doesn't need another gym. It needs a proving ground. Join the elite. Track your evolution. Burn the weakness.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href={user ? "/dashboard" : "/register"}
              className="group relative bg-brand text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(255,77,0,0.5)] transition-all flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {user ? 'Enter Dashboard' : 'Initiate Transformation'}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              href="#arsenal"
              className="text-zinc-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors py-4 px-6 border border-zinc-900 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/50"
            >
              View Arsenal
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-brand" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Tactical Tracking</span>
             </div>
             <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-brand" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Elite Tech</span>
             </div>
             <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-brand" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">No Excuses</span>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden lg:block relative"
        >
          <div className="relative z-10 glass rounded-[48px] p-2 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
             <div className="bg-zinc-950 rounded-[40px] p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Active Operations</span>
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-500 text-[8px] font-black">LIVE FEED</div>
                </div>
                
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-xs group-hover:text-brand">
                      {i}
                    </div>
                    <div className="flex-1">
                      <div className="h-2 w-24 bg-zinc-800 rounded-full mb-2" />
                      <div className="h-1.5 w-16 bg-zinc-900 rounded-full" />
                    </div>
                    <div className="text-zinc-500 text-[8px] font-black uppercase tracking-widest italic opacity-0 group-hover:opacity-100">+50 XP</div>
                  </div>
                ))}

                <div className="pt-6 border-t border-zinc-900 space-y-4">
                   <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                      <span>Daily Burn Goal</span>
                      <span className="text-brand">85%</span>
                   </div>
                   <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-brand" 
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* Floating abstract elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand/20 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand/10 rounded-full blur-[100px] animate-pulse" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-[8px] font-black uppercase tracking-[0.4em]">Initialize Scroll</span>
        <div className="w-px h-12 bg-linear-to-b from-brand to-transparent" />
      </motion.div>
    </section>
  );
}
