'use client';

import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Target, 
  Users, 
  Trophy, 
  Activity, 
  MapPin,
  Flame,
  Zap,
  LayoutGrid
} from 'lucide-react';

const features = [
  {
    title: "The Arsenal",
    description: "Professional grade bodybuilding and powerlifting equipment forged to handle the most brutal training sessions.",
    icon: LayoutGrid,
    color: "text-brand"
  },
  {
    title: "Tactical Intel",
    description: "Real-time measurement tracking, attendance streaks, and evolution insights to monitor your transformation.",
    icon: Target,
    color: "text-brand"
  },
  {
    title: "The Inner Circle",
    description: "Access an elite community of dedicated agents pursuing absolute strength. No influencers, just results.",
    icon: Users,
    color: "text-brand"
  },
  {
    title: "Cryo-Recovery",
    description: "Advanced recovery protocols and post-mission nutrition guidance to ensure you ignite every single day.",
    icon: ShieldCheck,
    color: "text-brand"
  },
  {
    title: "Global Operations",
    description: "Seamless membership checks and attendance via dynamic QR protocols. Integrated across all club sectors.",
    icon: MapPin,
    color: "text-brand"
  },
  {
    title: "Elite Milestones",
    description: "Unlock tiered achievements and rank up as you crush your physical barriers. Gamified strength evolution.",
    icon: Trophy,
    color: "text-brand"
  }
];

export function LandingFeatures() {
  return (
    <section id="benefits" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-sm font-black text-brand uppercase tracking-[0.4em] mb-4">Tactical Advantages</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-tight">
              WHY THE CLUB <br />
              <span className="text-brand">SURPASSES</span> THE GYM.
            </h3>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-500 max-w-sm font-bold uppercase tracking-tight text-xs md:text-sm leading-relaxed"
          >
            We don't offer lifestyle packages. We offer transformation protocols. Level up your physical existence with elite surveillance technologies.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[40px] group transition-all duration-500 hover:border-brand/40 hover:-translate-y-2"
            >
              <div className="w-16 h-16 rounded-[24px] bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-10 group-hover:bg-brand group-hover:shadow-[0_0_30px_rgba(255,77,0,0.3)] transition-all duration-500">
                <feature.icon className={cn("w-8 h-8 group-hover:text-white transition-colors", feature.color)} />
              </div>
              <h4 className="text-xl font-black text-white mb-4 uppercase italic tracking-tight">{feature.title}</h4>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-relaxed group-hover:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Ensure cn is imported
import { cn } from '@/lib/utils';
