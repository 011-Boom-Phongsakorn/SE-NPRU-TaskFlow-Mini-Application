import { create } from 'zustand';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/tasks');
      set({ tasks: res.data, isLoading: false });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to get tasks';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [...state.tasks, res.data], isLoading: false }));
      toast.success('Task created successfully');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create task';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  updateTask: async (id, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? res.data : task)),
        isLoading: false
      }));
      toast.success('Task updated');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/tasks/${id}`);
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        isLoading: false
      }));
      toast.success('Task deleted');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      set({ error: msg, isLoading: false });
      toast.error(msg);
    }
  }
}));
