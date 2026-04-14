import { create } from 'zustand';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  phone: string;
  role: 'admin' | 'customer';
  membershipStatus?: string;
  metadata?: any;
}

interface AuthState {
  admin: User | null;
  customer: User | null;
  loading: boolean;
  isInitialized: boolean;
  setAdmin: (user: User | null) => void;
  setCustomer: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (phone: string, password: string, targetRole?: 'admin' | 'customer') => Promise<'admin' | 'customer'>;
  register: (data: any) => Promise<void>;
  logout: (role?: 'admin' | 'customer') => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  admin: null,
  customer: null,
  loading: false,
  isInitialized: false,

  setAdmin: (admin) => set({ admin }),
  setCustomer: (customer) => set({ customer }),
  setLoading: (loading) => set({ loading }),

  checkAuth: async () => {
    const adminToken = Cookies.get('adminAccessToken');
    const adminRefresh = localStorage.getItem('adminRefreshToken');
    const customerToken = Cookies.get('accessToken');
    const customerRefresh = localStorage.getItem('refreshToken');

    // If no tokens at all, we are guests
    if (!adminToken && !adminRefresh && !customerToken && !customerRefresh) {
      set({ admin: null, customer: null, isInitialized: true, loading: false });
      return;
    }

    const checkAdmin = async () => {
      if (adminToken || adminRefresh) {
        try {
          // Explicitly use /admin prefix to trigger adminAccessToken in interceptor
          const res = await axios.get('/admin/users/me'); 
          set({ admin: res.data.data });
        } catch (e) {
          console.error("Admin session verification failed:", e);
          set({ admin: null });
        }
      }
    };

    const checkCustomer = async () => {
      if (customerToken || customerRefresh) {
        try {
          // Standard route uses accessToken in interceptor
          const res = await axios.get('/users/me');
          set({ customer: res.data.data });
        } catch (e) {
          console.error("Customer session verification failed:", e);
          set({ customer: null });
        }
      }
    };

    await Promise.all([checkAdmin(), checkCustomer()]);
    set({ isInitialized: true, loading: false });
  },

  login: async (phone, password, targetRole) => {
    set({ loading: true });
    try {
      const res = await axios.post('/auth/login', { phone, password });
      const { accessToken, refreshToken, user: userData } = res.data.data;

      // Determine if we should treat this as an admin login
      // Either use the targetRole or the actual returned role
      const is_admin = targetRole === 'admin' || userData.role === 'admin';
      
      if (is_admin) {
        Cookies.set('adminAccessToken', accessToken, { expires: 1, path: '/' });
        localStorage.setItem('adminRefreshToken', refreshToken);
        set({ admin: userData, loading: false, isInitialized: true });
      } else {
        Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
        localStorage.setItem('refreshToken', refreshToken);
        set({ customer: userData, loading: false, isInitialized: true });
      }

      toast.success(`Welcome back, ${userData.name}!`);
      return userData.role;
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  },

  register: async (data) => {
    set({ loading: true });
    try {
      const res = await axios.post('/auth/register', data);
      const { accessToken, refreshToken, user: userData } = res.data.data;

      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      localStorage.setItem('refreshToken', refreshToken);

      set({ customer: userData, loading: false, isInitialized: true });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: (role) => {
    const currentPath = window.location.pathname;
    const is_admin = role === 'admin' || currentPath.startsWith('/admin');

    if (is_admin) {
      Cookies.remove('adminAccessToken', { path: '/' });
      localStorage.removeItem('adminRefreshToken');
      set({ admin: null });
    } else {
      Cookies.remove('accessToken', { path: '/' });
      localStorage.removeItem('refreshToken');
      set({ customer: null });
    }

    toast.success('Logged out');
    // If we are on an admin page and log out admin, go to admin login
    if (is_admin && currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
    } else if (!is_admin && !currentPath.startsWith('/admin')) {
        window.location.href = '/login';
    }
  },
}));
