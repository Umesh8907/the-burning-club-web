import { create } from 'zustand';
import axios from '@/lib/axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  phone: string;
  role: 'customer' | 'admin';
  membershipStatus: string;
  metadata?: {
    weight?: number;
    height?: number;
    bmi?: number;
  };
  activeSubscription?: {
    planId: string;
    endDate: string;
    status: string;
  };
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false, // Start false for optimistic UI
  isInitialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),

  checkAuth: async () => {
    const token = Cookies.get('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // 1. If we have NO tokens at all, we are guests.
    if (!token && !refreshToken) {
      console.log('[AUTH STORE DEBUG] No tokens found. User is guest.');
      set({ user: null, isInitialized: true, loading: false });
      return;
    }

    // 2. Proactive Recovery: If accessToken is gone but refreshToken exists, try to refresh first
    if (!token && refreshToken) {
      console.log('[AUTH STORE DEBUG] Access token missing but refresh token exists. Attempting recovery...');
      try {
        const res = await axios.post('/auth/refresh-token', { refreshToken });
        const { accessToken, user: userData } = res.data.data;
        Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
        console.log('[AUTH STORE DEBUG] Recovery successful. Profile retrieved.');
        set({ user: userData, isInitialized: true, loading: false });
        return; // Recovery successful
      } catch (err) {
        // Refresh failed, clear everything
        console.log('[AUTH STORE DEBUG] Recovery failed. Clearing tokens.');
        localStorage.removeItem('refreshToken');
        set({ user: null, isInitialized: true, loading: false });
        return;
      }
    }

    // 3. Normal Path: We have an accessToken, just fetch the profile
    console.log('[AUTH STORE DEBUG] Access token found. Fetching profile...');
    try {
      const res = await axios.get('/users/me');
      const userData = res.data.data;
      console.log('[AUTH STORE DEBUG] Profile fetched successfully.');
      set({ user: userData, isInitialized: true, loading: false });
    } catch (error: any) {
      // If we hit a 401 here, the interceptor will try to refresh.
      // If the interceptor/refresh finally fails, axios returns the error here.
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('[AUTH STORE DEBUG] Profile fetch failed with 401/403. Clearing session.');
        set({ user: null, isInitialized: true, loading: false });
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('userRole', { path: '/' });
        Cookies.remove('auth_active', { path: '/' });
        localStorage.removeItem('refreshToken');
      } else {
        set({ isInitialized: true, loading: false });
      }
    }
  },

  login: async (phone, password) => {
    set({ loading: true });
    try {
      const res = await axios.post('/auth/login', { phone, password });
      const { accessToken, refreshToken, user: userData } = res.data.data;

      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      Cookies.set('userRole', userData.role, { expires: 7, path: '/' });
      Cookies.set('auth_active', 'true', { expires: 7, path: '/' });
      localStorage.setItem('refreshToken', refreshToken);

      set({ user: userData, loading: false, isInitialized: true });
      toast.success('Welcome back!');
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
      Cookies.set('userRole', userData.role, { expires: 7, path: '/' });
      Cookies.set('auth_active', 'true', { expires: 7, path: '/' });
      localStorage.setItem('refreshToken', refreshToken);

      set({ user: userData, loading: false, isInitialized: true });
      toast.success('Registration successful!');
    } catch (error: any) {
      set({ loading: false });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  },

  logout: () => {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
    Cookies.remove('auth_active', { path: '/' });
    localStorage.removeItem('refreshToken');
    set({ user: null, isInitialized: true, loading: false });
    toast.success('Logged out');
    window.location.href = '/login';
  },
}));
