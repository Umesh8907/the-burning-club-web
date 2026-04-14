'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    branch: 'Main Branch'
  });
  const { register, customer, loading: authLoading, isInitialized } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side guard for cache hits / back button
  useEffect(() => {
    if (isInitialized && customer && mounted) {
      router.replace('/dashboard');
    }
  }, [customer, isInitialized, router, mounted]);

  // If we are still checking auth, or if we are logged in, don't show the form
  if (!mounted || (isInitialized && customer)) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } catch (err) {
      // Error handled by Toast
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/85 backdrop-grayscale-[0.5]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-8 rounded-3xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-4">
            <Flame className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-gradient uppercase tracking-tighter">Enter the Arena</h1>
          <p className="text-zinc-500 mt-1 italic font-bold tracking-widest uppercase text-[10px]">Start your transformation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
            <input
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
            <input
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
              placeholder="+91"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Secret Password</label>
            <input
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all text-white placeholder:text-zinc-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-muted disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)] transform active:scale-[0.98] uppercase tracking-widest text-sm mt-4"
          >
            {loading ? 'Igniting Soul...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-500 text-xs font-bold uppercase tracking-wide">
          Already a warrior?{' '}
          <Link href="/login" className="text-brand hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
