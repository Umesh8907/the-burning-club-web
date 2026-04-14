'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { 
  Plus, 
  Ticket, 
  Trash2, 
  Calendar, 
  Percent, 
  Hash,
  X,
  Check
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    expiryDate: '',
    maxUsage: '100'
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/coupons');
      setCoupons(res.data.data);
    } catch (error) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/admin/coupons', {
        ...formData,
        discountPercent: parseFloat(formData.discountPercent),
        maxUsage: parseInt(formData.maxUsage)
      });
      toast.success('Coupon created successfully');
      setIsModalOpen(false);
      setFormData({ code: '', discountPercent: '', expiryDate: '', maxUsage: '100' });
      fetchCoupons();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanent deletion of this coupon?')) return;
    try {
      await axios.delete(`/admin/coupons/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error('Failed to delete coupon');
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Discount Coupons</h1>
          <p className="text-sm text-gray-500">Manage promotional codes and discounts for members.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse h-48" />
          ))
        ) : coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <Ticket className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 tracking-tight">{coupon.code}</h3>
                            <p className="text-xs text-indigo-600 font-semibold">{coupon.discountPercent}% OFF</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => handleDelete(coupon._id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-3 flex-1 px-1">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center font-medium">
                            {coupon.usageCount} / {coupon.maxUsage || '∞'} Used
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                            className="bg-indigo-500 h-1.5 rounded-full transition-all" 
                            style={{ width: `${Math.min((coupon.usageCount / (coupon.maxUsage || 100)) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        new Date(coupon.expiryDate) > new Date() ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                        {new Date(coupon.expiryDate) > new Date() ? 'Valid' : 'Expired'}
                    </span>
                </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
             No active coupons found.
          </div>
        )}
      </div>

       {/* Modal */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                  <input 
                    type="text" 
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none uppercase font-bold text-indigo-700"
                    placeholder="e.g. WELCOME10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            required
                            min="1"
                            max="100"
                            value={formData.discountPercent}
                            onChange={(e) => setFormData({...formData, discountPercent: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Usage</label>
                    <input 
                      type="number" 
                      required
                      value={formData.maxUsage}
                      onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                   <input 
                      type="date" 
                      required
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                   />
                </div>

                <div className="flex gap-3 mt-6">
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 shadow-sm"
                    >
                        Create Coupon
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
