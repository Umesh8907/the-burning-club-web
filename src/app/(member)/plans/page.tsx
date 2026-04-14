'use client';

import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axios";
import { useEffect, useState } from "react";
import { 
  Check, 
  Flame, 
  Zap, 
  ShieldCheck,
  CreditCard,
  Activity
} from 'lucide-react';
import { motion } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { customer } = useAuthStore();

  const activePlanId = (customer as any)?.activeSubscription?.planId;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('/plans');
        setPlans(res.data.data);
      } catch (err) {
        toast.error('Failed to load transmission plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getDummyFeatures = (months: number) => {
    const base = [
      'Unlimited High-Intensity Access',
      'Tactical Training Modules',
      'Performance Analytics'
    ];
    if (months >= 6) {
      return [...base, 'Steam & Sauna Recovery', 'Locker Command', 'Nutrition Protocol'];
    }
    return base;
  };

  const handlePurchase = async (planId: string) => {
    if (planId === activePlanId) {
      toast.error('This plan is already active on your account');
      return;
    }

    try {
      toast.loading('Initializing secure payment...', { id: 'payment' });
      const orderRes = await axios.post('/payments/create-order', { planId });
      const { orderId, amount, currency, keyId } = orderRes.data.data;

      const options = {
        key: keyId,
        amount,
        currency,
        name: 'The Burning Club',
        description: 'Membership Purchase',
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await axios.post('/payments/verify', response);
            toast.success('Your soul is now burning! Membership active.', { id: 'payment' });
            window.location.reload();
          } catch (err) {
            toast.error('Payment verification failed', { id: 'payment' });
          }
        },
        prefill: {
          name: customer?.name,
          contact: customer?.phone,
        },
        theme: {
          color: '#FF4D00',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start payment', { id: 'payment' });
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <Flame className="w-12 h-12 text-brand animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Syncing Fire...</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 h-full flex flex-col items-center py-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Pick Your <span className="text-brand">Fire</span></h1>
        <p className="text-zinc-500 max-w-lg mx-auto font-bold uppercase tracking-widest text-xs">
          Select the intensity of your transformation. No refunds. No excuses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {plans.map((plan, i) => {
          const isActive = plan._id === activePlanId;
          const features = getDummyFeatures(plan.durationInMonths);

          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "glass rounded-[32px] p-8 flex flex-col relative group transition-all duration-500",
                isActive ? "border-brand shadow-[0_0_50px_rgba(255,77,0,0.15)] bg-brand/5 scale-105" : "border-zinc-800/50 hover:border-zinc-700"
              )}
            >
              {isActive && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2 shadow-[0_4px_20px_rgba(255,77,0,0.4)]">
                  <Activity className="w-3 h-3" />
                  CURRENT PLAN
                </div>
              )}

              <div className="mb-10 text-center md:text-left">
                <h3 className="text-3xl font-black text-white uppercase italic mb-3 tracking-tighter">{plan.name}</h3>
                <div className="flex items-baseline justify-center md:justify-start gap-1">
                  <span className="text-5xl font-black text-white tracking-tighter">₹{plan.price}</span>
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">/ {plan.durationInMonths}MO</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {features.map((feat) => (
                  <div key={feat} className="flex items-center gap-4 group/item">
                    <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800 group-hover/item:border-brand/40 transition-colors">
                      <Check className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wide group-hover/item:text-white transition-colors">{feat}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePurchase(plan._id)}
                disabled={isActive}
                className={cn(
                  "w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all text-sm tracking-widest",
                  isActive 
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" 
                    : "bg-brand text-white hover:bg-brand-muted shadow-[0_10px_30px_rgba(255,77,0,0.2)] hover:shadow-brand/40"
                )}
              >
                {isActive ? (
                  <><ShieldCheck className="w-5 h-5" /> ALREADY BURNING</>
                ) : (
                  <><CreditCard className="w-5 h-5" /> REIGNITE NOW</>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t border-zinc-900 w-full opacity-30">
        <div className="flex items-center justify-center gap-2 grayscale brightness-50">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">SECURE PAYMENT</span>
        </div>
        <div className="flex items-center justify-center gap-2 grayscale brightness-50">
          <Flame className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">ELITE FACILITY</span>
        </div>
        <div className="flex items-center justify-center gap-2 grayscale brightness-50">
          <Zap className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">INSTANT ACTIVATION</span>
        </div>
        <div className="flex items-center justify-center gap-2 grayscale brightness-50">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">PERFORMANCE DATA</span>
        </div>
      </div>
    </div>
  );
}
