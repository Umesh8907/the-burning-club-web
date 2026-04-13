'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, Ghost, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-brand/20 rounded-full flex items-center justify-center mb-8 relative">
            <Flame className="w-12 h-12 text-brand absolute animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center opacity-50">
              <span className="text-[20vw] font-black text-white/2 select-none tracking-tighter italic">404</span>
            </div>
          </div>

          <h1 className="text-8xl font-black text-white mb-2 tracking-tighter">404</h1>
          <div className="h-1 w-20 bg-brand mb-6" />
          
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-widest italic">Route Not Found</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-10 font-medium">
            Even warriors get lost sometimes. The path you are looking for has been extinguished or never existed.
          </p>

          <Link 
            href="/dashboard"
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:border-brand/50 text-white px-8 py-4 rounded-xl transition-all group font-bold uppercase tracking-widest text-sm"
          >
            <Home className="w-4 h-4 text-brand group-hover:scale-110 transition-transform" />
            Return to Base
          </Link>
        </motion.div>
      </div>
      
      {/* Decorative Text */}
      <div className="absolute bottom-10 left-10 text-[10vw] font-black text-white/2 select-none pointer-events-none uppercase">
        Lost Arena
      </div>
    </div>
  );
}
