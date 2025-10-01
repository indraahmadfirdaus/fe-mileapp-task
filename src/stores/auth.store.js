import { defineStore } from 'pinia';
import authService from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getUser(),
    token: authService.getToken(),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.login(email, password);
        this.user = response.data.user;
        this.token = response.data.token;
        return response;
      } catch (error) {
        this.error = error.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(email, password, name) {
      this.loading = true;
      this.error = null;

      try {
        const response = await authService.register(email, password, name);
        this.user = response.data.user;
        this.token = response.data.token;
        return response;
      } catch (error) {
        this.error = error.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await authService.getCurrentUser();
        this.user = response.data;
        return response;
      } catch (error) {
        this.logout();
        throw error;
      }
    },

    logout() {
      authService.logout();
      this.user = null;
      this.token = null;
      this.error = null;
    },

    clearError() {
      this.error = null;
    },
  },
});