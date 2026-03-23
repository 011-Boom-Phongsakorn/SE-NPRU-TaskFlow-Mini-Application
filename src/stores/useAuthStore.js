import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isLoading: false });
      toast.success(`Welcome back, ${res.data.username}!`);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  register: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { username, password });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isLoading: false });
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
    toast.success('Logged out successfully');
  },

  updateProfile: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('token', res.data.token);
      set({ user: res.data, token: res.data.token, isLoading: false });
      toast.success('Profile updated successfully!');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile update failed';
      set({ error: msg, isLoading: false });
      toast.error(msg);
      return false;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data, isLoading: false });
    } catch (err) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
