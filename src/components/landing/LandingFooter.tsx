'use client';

import Link from 'next/link';
import { Flame, Camera, Send, Play } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter text-white italic">THE BURNING <span className="text-brand">CLUB</span></span>
          </div>
          <p className="text-zinc-600 font-bold uppercase tracking-tighter text-[10px] leading-relaxed">
            ELITE TRANSFORMATION HQ. <br />
            NO EXCUSES. NO COMPROMISE. <br />
            FORGED IN STRENGTH.
          </p>
          <div className="flex gap-4">
            <Camera className="w-4 h-4 text-zinc-600 hover:text-brand transition-colors cursor-pointer" />
            <Send className="w-4 h-4 text-zinc-600 hover:text-brand transition-colors cursor-pointer" />
            <Play className="w-4 h-4 text-zinc-600 hover:text-brand transition-colors cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">Operations</h4>
          <ul className="space-y-4">
            <li><Link href="#benefits" className="text-zinc-500 hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors">Tactical Intel</Link></li>
            <li><Link href="#arsenal" className="text-zinc-500 hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors">Equipment</Link></li>
            <li><Link href="#plans" className="text-zinc-500 hover:text-brand text-[10px] font-black uppercase tracking-widest transition-colors">Transmission Plans</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">HQ</h4>
          <ul className="space-y-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
            <li>Sector 17, Elite Zone</li>
            <li>Bangalore, KA 560102</li>
            <li className="text-brand">hq@theburningclub.com</li>
          </ul>
        </div>

        <div>
           <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">Transmission</h4>
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-4 italic">Get weekly tactical insights.</p>
           <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-[10px] text-white focus:border-brand outline-none flex-1"
              />
              <button className="bg-brand text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase">Send</button>
           </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
         <p className="text-[8px] font-black uppercase text-zinc-700 tracking-[0.4em]">© 2026 THE BURNING CLUB. ALL RIGHTS RESERVED.</p>
         <div className="flex gap-8">
            <span className="text-[8px] font-black uppercase text-zinc-700 tracking-[0.4em] hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="text-[8px] font-black uppercase text-zinc-700 tracking-[0.4em] hover:text-white cursor-pointer transition-colors">Terms of Engagement</span>
         </div>
      </div>
    </footer>
  );
}
