'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Activity, 
  Search, 
  Calendar, 
  User as UserIcon,
  Scale,
  Ruler,
  TrendingUp,
  ExternalLink
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Measurement {
  _id: string;
  userId: {
    _id: string;
    name: string;
    phone: string;
  };
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  createdAt: string;
}

export default function AdminMeasurementsPage() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/measurements');
      setMeasurements(res.data.data);
    } catch (error) {
      toast.error('Failed to load measurement records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const filteredMeasurements = measurements.filter(m => {
    return m.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
           m.userId?.phone?.includes(searchQuery);
  });

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Member Progress</h1>
          <p className="text-sm text-gray-500">Track and review physical transformations of club members.</p>
        </div>
        
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
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Member</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Weight</th>
                <th className="px-6 py-4 font-semibold">Metrics</th>
                <th className="px-6 py-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                [1,2,3,4,5].map(i => (
                  <tr key={i} className="animate-pulse h-16">
                    <td colSpan={5} className="px-6"><div className="w-full h-8 bg-gray-50 rounded-lg" /></td>
                  </tr>
                ))
              ) : filteredMeasurements.length > 0 ? (
                filteredMeasurements.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{m.userId?.name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{m.userId?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <Calendar className="w-4 h-4 text-gray-300" />
                            {formatDate(m.createdAt)}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                       <div className="flex items-center gap-1.5">
                            <Scale className="w-4 h-4 text-indigo-400" />
                            {m.weight} kg
                       </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex gap-4 text-xs">
                            {m.bodyFat && (
                                <div className="text-gray-500">
                                    <span className="font-semibold text-gray-700">{m.bodyFat}%</span> Fat
                                </div>
                            )}
                            {m.muscleMass && (
                                <div className="text-gray-500">
                                    <span className="font-semibold text-gray-700">{m.muscleMass}kg</span> Muscle
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-indigo-600 p-2">
                            <TrendingUp className="w-4 h-4" />
                        </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No measurement records found.
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
