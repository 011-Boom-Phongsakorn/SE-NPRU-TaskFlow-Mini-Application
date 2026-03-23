import { create } from 'zustand';
import api from '../lib/axios';

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
      set({ error: err.response?.data?.message || 'Failed to get tasks', isLoading: false });
    }
  },

  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/tasks', taskData);
      set((state) => ({ tasks: [...state.tasks, res.data], isLoading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to create task', isLoading: false });
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
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update task', isLoading: false });
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
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to delete task', isLoading: false });
    }
  }
}));
