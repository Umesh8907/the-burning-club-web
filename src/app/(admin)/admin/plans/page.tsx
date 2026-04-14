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
  ShieldCheck,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
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
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationInMonths: '1',
    isActive: true
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/admin/plans');
      setPlans(res.data.data);
    } catch (error) {
      toast.error('Failed to load plans');
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
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        durationInMonths: parseInt(formData.durationInMonths)
      };

      if (editingPlan) {
        await axios.patch(`/admin/plans/${editingPlan._id}`, payload);
        toast.success('Plan updated successfully');
      } else {
        await axios.post('/plans', payload);
        toast.success('New plan created');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPlans();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', durationInMonths: '1', isActive: true });
    setEditingPlan(null);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      durationInMonths: plan.durationInMonths.toString(),
      isActive: plan.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await axios.delete(`/admin/plans/${id}`);
      toast.success('Plan deleted');
      fetchPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  return (
    <div className="space-y-6 text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold">Membership Plans</h1>
          <p className="text-sm text-gray-500">Define and manage membership pricing and durations.</p>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse h-64" />
          ))
        ) : plans.map((plan) => (
          <div
            key={plan._id}
            className={cn(
               "bg-white rounded-xl p-6 border flex flex-col transition-all",
               plan.isActive ? "border-gray-200 shadow-sm hover:shadow-md" : "border-red-100 bg-gray-50 opacity-75"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-0.5">{plan.durationInMonths} Month Plan</p>
              </div>
              <div className={cn(
                "p-1.5 rounded-full border",
                plan.isActive ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"
              )}>
                {plan.isActive ? <Zap className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </div>
            </div>

            <div className="flex items-baseline gap-1 my-4">
              <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price * 100)}</span>
              <span className="text-gray-400 text-sm font-medium">total</span>
            </div>

            <div className="space-y-2 mb-6 flex-1">
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{plan.durationInMonths} Months Access</span>
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Full Facility Access</span>
               </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
              <button 
                onClick={() => handleEdit(plan)}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Edit className="w-3.5 h-3.5" /> Edit
              </button>
              <button 
                onClick={() => handleDelete(plan._id)}
                className="p-2 text-red-600 border border-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

       {/* Create/Edit Plan Modal */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xl w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. Monthly Standard"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={formData.durationInMonths}
                      onChange={(e) => setFormData({...formData, durationInMonths: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                   <span className="text-sm font-medium text-gray-700">Active Status</span>
                   <button 
                     type="button"
                     onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                     className={cn(
                       "w-10 h-5 rounded-full relative transition-all",
                       formData.isActive ? "bg-indigo-600" : "bg-gray-300"
                     )}
                   >
                     <div className={cn(
                       "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
                       formData.isActive ? "right-0.5" : "left-0.5"
                     )} />
                   </button>
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
                        {editingPlan ? 'Save Changes' : 'Initialize Plan'}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}
