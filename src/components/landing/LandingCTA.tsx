'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function LandingCTA() {
  const { customer } = useAuthStore();

  return (
    <section id="plans" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative glass rounded-[64px] p-12 md:p-20 overflow-hidden text-center group">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-brand/20 via-transparent to-brand/10 -z-10 group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,77,0,0.05)_0%,transparent_70%)] animate-slow-spin -z-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-8"
          >
            <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,77,0,0.5)] mb-4">
              <Flame className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-none">
               READY TO <span className="text-gradient">IGNITE?</span>
            </h2>

            <p className="text-zinc-500 max-w-xl font-bold uppercase tracking-widest text-xs md:text-sm leading-relaxed">
               Admittance to The Burning Club is reserved for those dedicated to absolute transformation. No excuses. No compromises. Reclaim your biological superiority.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
               <Link 
                  href={customer ? "/dashboard" : "/register"}
                  className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-brand hover:text-white transition-all flex items-center gap-3 shadow-2xl"
               >
                  {customer ? 'Return to HQ' : 'Join the Operation'}
                  <ArrowRight className="w-5 h-5" />
               </Link>
               
               {!customer && (
                 <Link 
                    href="/login" 
                    className="text-white hover:text-brand font-black uppercase tracking-widest text-xs transition-colors py-4 px-8"
                 >
                    Existing Agent Login
                 </Link>
               )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
