'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert,
  Snowflake,
  UserCheck,
  UserMinus,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  membershipStatus: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/users');
      setUsers(res.data.data);
    } catch (error) {
       toast.error('Failed to load tactical intelligence (Users)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string) => {
    try {
      await axios.patch(`/admin/users/${id}/toggle-status`);
      toast.success('Agent status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFreeze = async (id: string) => {
    try {
      await axios.post(`/admin/users/${id}/freeze`);
      toast.success('Membership cryogenic stasis initiated (Frozen)');
      fetchUsers();
    } catch (error) {
      toast.error('Freezing process failed');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.phone.includes(searchQuery);
    const matchesFilter = filter === 'all' || user.membershipStatus === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase italic">Member Registry</h1>
          <p className="text-zinc-500 mt-1 uppercase tracking-widest text-xs font-bold">Tactical overview of all club agents</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME or PHONE..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-brand outline-none w-full sm:w-64 transition-all uppercase font-bold placeholder:text-zinc-700"
            />
          </div>
          <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
             {(['all', 'active', 'expired'] as const).map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f)}
                 className={cn(
                   "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                   filter === f ? "bg-brand text-white shadow-lg" : "text-zinc-500 hover:text-white"
                 )}
               >
                 {f}
               </button>
             ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-[32px] overflow-hidden border border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Agent</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Contact</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/50">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-24">
                    <td colSpan={5} className="px-8"><div className="w-full h-8 bg-zinc-900/50 rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user._id} 
                    className="group hover:bg-zinc-900/20 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-black text-brand text-xl group-hover:bg-brand group-hover:text-white transition-all duration-500">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-black uppercase italic tracking-tight">{user.name}</p>
                          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                          <Phone className="w-3 h-3 text-brand" />
                          {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-medium">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                        user.membershipStatus === 'active' 
                          ? "bg-green-500/10 text-green-500 border-green-500/20" 
                          : user.membershipStatus === 'expired'
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : "bg-zinc-800 text-zinc-400 border-zinc-700"
                      )}>
                        {user.membershipStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold">
                          <Calendar className="w-3 h-3" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          title={user.isActive ? "Deactivate" : "Activate"}
                          className={cn(
                            "p-2.5 rounded-xl border transition-all",
                            user.isActive 
                              ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" 
                              : "bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500 hover:text-white"
                          )}
                        >
                          {user.isActive ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        
                        <button 
                          onClick={() => handleFreeze(user._id)}
                          title="Freeze Membership"
                          className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all"
                        >
                          <Snowflake className="w-4 h-4" />
                        </button>

                        <button className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white rounded-xl transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-zinc-600 font-bold uppercase tracking-widest italic animate-pulse">
                    No agents matching the current criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
