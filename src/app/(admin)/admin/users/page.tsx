'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck,
  UserMinus,
  Mail,
  Phone,
  Calendar,
  Snowflake,
  ExternalLink
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
       toast.error('Failed to load members');
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
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFreeze = async (id: string) => {
    try {
      // Assuming freeze needs a duration now, or stick to default
      await axios.post(`/admin/users/${id}/freeze`, { days: 7 }); 
      toast.success('Membership frozen for 7 days');
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
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Member Directory</h1>
          <p className="text-sm text-gray-500">Manage all club members and their membership status.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64 transition-all"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-20">
                    <td colSpan={5} className="px-6"><div className="w-full h-8 bg-gray-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-lg border border-gray-200">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {user.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        user.membershipStatus === 'active' 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : user.membershipStatus === 'expired'
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                      )}>
                        {user.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-300" />
                          {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleStatus(user._id)}
                          title={user.isActive ? "Deactivate" : "Activate"}
                          className={cn(
                            "p-2 rounded-lg border transition-colors",
                            user.isActive 
                              ? "text-red-600 border-red-100 hover:bg-red-50" 
                              : "text-green-600 border-green-100 hover:bg-green-50"
                          )}
                        >
                          {user.isActive ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                        
                        <button 
                          onClick={() => handleFreeze(user._id)}
                          title="Freeze Membership"
                          className="p-2 text-blue-600 border border-blue-100 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Snowflake className="w-4 h-4" />
                        </button>

                        <button className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No members found matching your search
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
