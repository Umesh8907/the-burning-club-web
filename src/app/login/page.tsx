'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const { login, customer, loading: authLoading, isInitialized } = useAuthStore();
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
      await login(phone, password);
    } catch (err) {
      // Error handled by Toast in Context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-black/80 backdrop-grayscale-[0.5]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md p-8 rounded-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-brand/20 rounded-full flex items-center justify-center mb-4">
            <Flame className="w-10 h-10 text-brand" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">The Burning Club</h1>
          <p className="text-zinc-400 mt-2 italic font-bold tracking-widest uppercase text-[10px]">Enter the arena</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-zinc-600 text-white"
              placeholder="+91 99999 99999"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-400">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition-all placeholder:text-zinc-600 text-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-muted disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)] transform active:scale-[0.98] uppercase tracking-widest text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-zinc-500 text-xs font-bold uppercase tracking-wide">
          New to the club?{' '}
          <Link href="/register" className="text-brand hover:underline">
            Join Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
