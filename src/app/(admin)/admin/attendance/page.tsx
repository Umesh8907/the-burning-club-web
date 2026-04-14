'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Search, 
  User as UserIcon,
  ChevronRight,
  Filter,
  Users,
  CalendarDays,
  ShieldCheck,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  membershipStatus: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminAttendanceMembersPage() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/users');
      setMembers(res.data.data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          member.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || member.membershipStatus === statusFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    const memberDate = new Date(member.createdAt).toISOString().split('T')[0];
    const matchesStartDate = !startDate || memberDate >= startDate;
    const matchesEndDate = !endDate || memberDate <= endDate;

    return matchesSearch && matchesStatus && matchesRole && matchesStartDate && matchesEndDate;
  });

  const clearFilters = () => {
      setSearchQuery('');
      setStatusFilter('all');
      setRoleFilter('all');
      setStartDate('');
      setEndDate('');
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance Management</h1>
          <p className="text-sm text-gray-500">Search and filter members to review their check-in history.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all",
                    showAdvanced ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
            >
                <Filter className="w-4 h-4" />
                {showAdvanced ? 'Hide Advanced' : 'Advanced Filters'}
            </button>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                type="text" 
                placeholder="Name or phone..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full sm:w-64"
                />
            </div>
        </div>
      </div>

      {showAdvanced && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-3 h-3" />
                      Membership Status
                  </label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Members</option>
                    <option value="expired">Expired</option>
                    <option value="inactive">Inactive</option>
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Role</label>
                  <select 
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full"
                  >
                    <option value="all">All Roles</option>
                    <option value="customer">Customer Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" />
                      Joined After
                  </label>
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full"
                  />
              </div>

              <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                      <CalendarDays className="w-3 h-3" />
                      Joined Before
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full"
                    />
                    <button 
                        onClick={clearFilters}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear all filters"
                    >
                        <X className="w-5 h-5" />
                    </button>
                  </div>
              </div>
          </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Phone</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-16">
                    <td colSpan={5} className="px-6"><div className="w-full h-8 bg-gray-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 font-bold">
                            {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {member.phone}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                        {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                        <span className={cn(
                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                            member.membershipStatus === 'active' 
                            ? "bg-green-100 text-green-800 border-green-200" 
                            : member.membershipStatus === 'expired'
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-gray-100 text-gray-800 border-gray-200"
                        )}>
                            {member.membershipStatus}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Link 
                            href={`/admin/attendance/${member._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            View Logs
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                        <Users className="w-8 h-8 opacity-20" />
                        <p>No members found matching your filters.</p>
                        <button onClick={clearFilters} className="text-indigo-600 text-sm font-medium hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Total {filteredMembers.length} members matching criteria</span>
        </div>
      </div>
    </div>
  );
}
