'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  User as UserIcon,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { cn, formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Subscription {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  planId: {
    _id: string;
    name: string;
    price: number;
    duration: number;
  };
  amount: number;
  status: 'active' | 'expired' | 'pending' | 'cancelled';
  startDate: string;
  endDate: string;
  paymentId?: string;
  createdAt: string;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/subscriptions');
      setSubscriptions(res.data.data);
    } catch (error) {
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.userId?.phone?.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Subscription Records</h1>
          <p className="text-sm text-gray-500">View and track all member membership payments and validity.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by member..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full sm:w-64"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Plan</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Period</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-16">
                    <td colSpan={6} className="px-6"><div className="w-full h-8 bg-gray-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredSubscriptions.length > 0 ? (
                filteredSubscriptions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{sub.userId?.name || 'Deleted User'}</p>
                          <p className="text-xs text-gray-500">{sub.userId?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm text-gray-700 font-medium">{sub.planId?.name || 'Custom Plan'}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        sub.status === 'active' ? "bg-green-100 text-green-700" :
                        sub.status === 'expired' ? "bg-red-100 text-red-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {sub.status === 'active' && <CheckCircle className="w-2.5 h-2.5 mr-1" />}
                        {sub.status === 'expired' && <XCircle className="w-2.5 h-2.5 mr-1" />}
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-gray-500">
                            <div className="flex items-center gap-1.5 font-medium text-gray-700">
                                <Calendar className="w-3 h-3" />
                                {formatDate(sub.startDate)}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Clock className="w-3 h-3" />
                                To: {formatDate(sub.endDate)}
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                       {formatCurrency(sub.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-indigo-600 p-2">
                            <ExternalLink className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No subscription records found.
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
