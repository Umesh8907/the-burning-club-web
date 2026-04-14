'use client';

import { useEffect, useState, use } from 'react';
import axios from '@/lib/axios';
import { 
  Calendar, 
  Clock, 
  User as UserIcon,
  ArrowLeft,
  Filter,
  Search,
  Download,
  CalendarDays,
  X
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Attendance {
  _id: string;
  checkIn: string;
  checkOut?: string;
  status: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  membershipStatus: string;
}

export default function MemberAttendanceDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user details
      const userRes = await axios.get(`/admin/users/${userId}`);
      setUser(userRes.data.data);

      // Fetch attendance history
      const attendanceRes = await axios.get(`/admin/attendance?userId=${userId}`);
      setAttendance(attendanceRes.data.data);
    } catch (error) {
      toast.error('Failed to load member data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const filteredAttendance = attendance.filter(log => {
      const logDate = new Date(log.checkIn).toISOString().split('T')[0];
      const matchesStart = !startDate || logDate >= startDate;
      const matchesEnd = !endDate || logDate <= endDate;
      return matchesStart && matchesEnd;
  });

  const clearDateFilter = () => {
      setStartDate('');
      setEndDate('');
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/attendance" 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Attendance History</h1>
          <p className="text-sm text-gray-500">Detailed logs for {user?.name || 'Loading...'}</p>
        </div>
      </div>

      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                            <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">{user.name}</h2>
                            <p className="text-sm text-gray-500">{user.phone} • {user.email || 'No email'}</p>
                        </div>
                    </div>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold border capitalize",
                        user.membershipStatus === 'active' 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : "bg-red-100 text-red-800 border-red-200"
                    )}>
                        {user.membershipStatus}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-xs uppercase text-gray-500 mr-2">Range:</span>
                        <div className="flex items-center gap-2">
                            <input 
                                type="date" 
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="text-gray-400">to</span>
                            <input 
                                type="date" 
                                className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            {(startDate || endDate) && (
                                <button 
                                    onClick={clearDateFilter}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        <Download className="w-4 h-4" />
                        Export Log
                    </button>
                </div>
            </div>

            <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                <div>
                    <h3 className="text-indigo-100 text-sm font-medium">Total Attendance</h3>
                    <p className="text-4xl font-black mt-1">{attendance.length}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-indigo-500/50">
                    <p className="text-xs text-indigo-100 opacity-80 uppercase tracking-widest font-bold">Filtered Results</p>
                    <p className="text-lg font-bold mt-1">{filteredAttendance.length} records</p>
                </div>
            </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Check In</th>
                <th className="px-6 py-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-16">
                    <td colSpan={3} className="px-6"><div className="w-full h-8 bg-gray-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredAttendance.length > 0 ? (
                filteredAttendance.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            {formatDate(log.checkIn)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Present
                        </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                    No logs found for the selected criteria.
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
