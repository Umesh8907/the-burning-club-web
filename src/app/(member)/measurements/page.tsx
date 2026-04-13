'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  LineChart, 
  TrendingUp, 
  Scale, 
  Calendar,
  ChevronRight,
  Plus,
  Activity,
  Award,
  X,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Measurement {
  _id: string;
  weight: number;
  height?: number;
  bodyFat?: number;
  date: string;
}

export default function MeasurementsPage() {
  const [history, setHistory] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users/measurements');
      setHistory(res.data.data);
    } catch (error) {
      console.error('Failed to fetch measurements', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight) return toast.error('Weight is required');
    
    try {
      toast.loading('Saving transformation data...', { id: 'measure' });
      await axios.post('/users/measurements', {
        weight: parseFloat(formData.weight),
        bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
        date: new Date(formData.date).toISOString()
      });
      toast.success('Battle metrics updated!', { id: 'measure' });
      setIsModalOpen(false);
      fetchHistory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save', { id: 'measure' });
    }
  };

  const latest = history[0];
  const previous = history[1];
  const weightDiff = (latest && previous) ? (latest.weight - previous.weight).toFixed(1) : '0.0';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            BODY <span className="text-brand">PROGRESS</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">TRACK YOUR TRANSFORMATION EVOLUTION</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-brand hover:text-white transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          NEW ENTRY
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Cards */}
        <div className="glass rounded-3xl p-6 border-l-4 border-l-brand">
          <div className="flex items-center gap-3 mb-4 text-brand">
            <Scale className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Weight</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white">{latest?.weight || '--'}</h3>
            <span className="text-zinc-500 text-xs mb-1 font-bold">KG</span>
          </div>
          <div className="mt-2 text-xs font-bold text-zinc-500">
            {Number(weightDiff) > 0 ? `+${weightDiff} kg from last` : `${weightDiff} kg from last`}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-4 text-blue-500">
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">BMI Index</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white">24.5</h3>
            <span className="text-blue-500 text-xs mb-1 font-black px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">Normal</span>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Body Fat</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white">{latest?.bodyFat || '--'}</h3>
            <span className="text-zinc-500 text-xs mb-1 font-bold">%</span>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3 mb-4 text-green-500">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Milestones</span>
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-3xl font-black text-white">08</h3>
            <span className="text-zinc-500 text-xs mb-1 font-bold italic underline tracking-tighter uppercase">ACHIEVED</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* History Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand" />
              <h3 className="text-xl font-black text-white italic uppercase tracking-wider">Historical Data</h3>
            </div>
          </div>

          <div className="glass rounded-3xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800/50 bg-zinc-900/30 font-black text-[10px] text-zinc-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Weight (kg)</th>
                  <th className="px-6 py-4">Body Fat (%)</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/20">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse px-6 py-4 h-16" />
                  ))
                ) : history.length > 0 ? (
                  history.map((record) => (
                    <tr key={record._id} className="group hover:bg-zinc-800/20 transition-all font-bold text-sm">
                      <td className="px-6 py-5 text-zinc-300">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="px-6 py-5 text-white">{record.weight}</td>
                      <td className="px-6 py-5 text-zinc-400">{record.bodyFat || '--'}</td>
                      <td className="px-6 py-5">
                        <button className="text-zinc-600 hover:text-white transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest italic">
                       No measurements recorded yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transformation Insights */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-8 bg-linear-to-br from-brand/10 via-transparent to-transparent border-t border-t-brand relative overflow-hidden">
             <div className="relative z-10">
               <h4 className="text-2xl font-black text-white mb-4 italic leading-tight uppercase">Transformation <br/>Insights</h4>
               <p className="text-zinc-500 text-sm font-medium mb-6">
                 {history.length > 1 
                   ? `You've changed ${weightDiff}kg since your last entry. Keep pushing!` 
                   : "Log more entries to see your transformation insights."}
               </p>
               <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                 <div className="h-full bg-brand w-[65%]" />
               </div>
               <div className="flex justify-between mt-2 text-[10px] font-black text-zinc-600 uppercase">
                 <span>START: {history[history.length - 1]?.weight || '--'}kg</span>
                 <span>LATEST: {latest?.weight || '--'}kg</span>
               </div>
             </div>
             <LineChart className="absolute bottom-0 right-0 w-32 h-32 text-brand/5 -mb-8 -mr-8" />
          </div>
        </div>
      </div>

      {/* Entry Modal */}
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
                  <h3 className="text-2xl font-black text-white uppercase italic">NEW BATTLE STATS</h3>
                  <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Track your evolution</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-500 hover:text-white bg-zinc-900 rounded-full border border-zinc-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Current Weight (kg)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors"
                      placeholder="0.0"
                    />
                    <Scale className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Body Fat (%) - Optional</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.bodyFat}
                      onChange={(e) => setFormData({...formData, bodyFat: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors"
                      placeholder="0.0"
                    />
                    <Activity className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Date of Entry</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 px-5 text-white font-bold outline-none focus:border-brand transition-colors"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-brand hover:text-white transition-all shadow-lg hover:shadow-brand/20 mt-4 uppercase italic tracking-tight"
                >
                  SAVE PROGRESS
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
