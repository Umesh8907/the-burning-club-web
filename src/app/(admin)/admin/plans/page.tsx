'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  X, 
  CreditCard,
  Clock,
  Zap,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Plan {
  _id: string;
  name: string;
  price: number;
  durationInMonths: number;
  isActive: boolean;
  features?: string[];
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationInMonths: '1',
    isActive: true
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/plans');
      setPlans(res.data.data);
    } catch (error) {
      toast.error('Failed to load transmission plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.loading('Forging new transmission plan...', { id: 'plan' });
      await axios.post('/plans', {
        ...formData,
        price: parseFloat(formData.price),
        durationInMonths: parseInt(formData.durationInMonths)
      });
      toast.success('New Plan Forged!', { id: 'plan' });
      setIsModalOpen(false);
      setFormData({ name: '', price: '', durationInMonths: '1', isActive: true });
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create plan', { id: 'plan' });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Transmission Plans</h1>
          <p className="text-zinc-500 mt-1 uppercase tracking-widest text-xs font-bold">Manage membership levels and pricing</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          FORGE NEW PLAN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="glass rounded-[32px] p-8 animate-pulse h-64" />
          ))
        ) : plans.map((plan, i) => (
          <motion.div
            key={plan._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
               "glass rounded-[32px] p-8 flex flex-col relative group transition-all duration-500",
               plan.isActive ? "border-zinc-800" : "border-red-500/20 opacity-50 gray-scale"
            )}
          >
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-black text-white uppercase mb-2 tracking-tighter">{plan.name}</h3>
                <div className={cn(
                  "p-2 rounded-xl border transition-colors",
                  plan.isActive ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                )}>
                  {plan.isActive ? <Zap className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-4xl font-black text-white">{formatCurrency(plan.price * 100)}</span>
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">/ {plan.durationInMonths}MO</span>
              </div>
            </div>

            <div className="space-y-3 mb-10 flex-1">
               <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand" />
                  <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">{plan.durationInMonths} Months Access</span>
               </div>
               <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest">All Gym Facilities</span>
               </div>
               <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-brand" />
                  <span className="text-zinc-400 text-sm font-bold uppercase tracking-widest underline italic">Priority Access</span>
               </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white font-black py-4 rounded-2xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> EDIT
              </button>
              <button className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

       {/* Create Plan Modal */}
       <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[32px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">FORGE PLAN</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Construct a new membership tier</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white bg-zinc-900 rounded-full border border-zinc-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Plan Display Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors uppercase"
                    placeholder="e.g. TITANIUM CORE"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Months</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.durationInMonths}
                      onChange={(e) => setFormData({...formData, durationInMonths: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors"
                      placeholder="e.g. 1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
                   <div className="flex items-center gap-3">
                     <div className={cn(
                       "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                       formData.isActive ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-600"
                     )}>
                       {formData.isActive ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                     </div>
                     <span className="text-[10px] font-black uppercase text-white tracking-widest">Active Status</span>
                   </div>
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                     className={cn(
                       "w-12 h-6 rounded-full relative transition-all",
                       formData.isActive ? "bg-brand" : "bg-zinc-800"
                     )}
                   >
                     <div className={cn(
                       "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                       formData.isActive ? "right-1" : "left-1"
                     )} />
                   </button>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-xl hover:shadow-brand/20 mt-4 uppercase italic tracking-tight"
                >
                  INITIALIZE PLAN
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
