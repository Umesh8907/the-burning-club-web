'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Flame, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';

export function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { admin, customer } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Benefits', href: '#benefits' },
    { name: 'Arsenal', href: '#arsenal' },
    { name: 'Plans', href: '#plans' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-100 transition-all duration-500 py-4 px-6 lg:px-12",
      isScrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.4)] group-hover:scale-110 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tighter text-white italic">THE BURNING <span className="text-brand">CLUB</span></span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-brand transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="h-6 w-px bg-white/10" />

          {admin && (
            <Link 
              href="/admin/dashboard"
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand transition-colors mr-6"
            >
              Admin Portal
            </Link>
          )}

          {customer ? (
            <Link 
              href="/dashboard"
              className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-white transition-all shadow-lg"
            >
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                href="/login" 
                className="text-[10px] font-black uppercase tracking-widest text-white hover:text-brand transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register"
                className="bg-brand text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(255,77,0,0.4)] transition-all"
              >
                Join the Fire
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-zinc-950 border-b border-white/5 p-6 md:hidden flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-black uppercase tracking-widest text-zinc-400"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/5 w-full" />
            
            {admin && (
              <Link 
                href="/admin/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-center py-4 text-zinc-400 font-black uppercase tracking-widest border border-zinc-800 rounded-xl"
              >
                Go to Admin Portal
              </Link>
            )}

            {customer ? (
              <Link 
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="bg-white text-black py-4 rounded-xl text-center font-black uppercase tracking-widest"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col gap-4">
                <Link 
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-4 text-zinc-400 font-black uppercase tracking-widest border border-zinc-800 rounded-xl"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-brand text-white py-4 rounded-xl text-center font-black uppercase tracking-widest shadow-xl shadow-brand/20"
                >
                  Join the Fire
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
