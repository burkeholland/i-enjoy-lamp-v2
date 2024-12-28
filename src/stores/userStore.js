import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: true
  }),
  
  actions: {
    setUser(userData) {
      this.user = userData;
      this.isAuthenticated = !!userData;
    },
    
    clearUser() {
      this.user = null;
      this.isAuthenticated = false;
    },
    
    setLoading(status) {
      this.isLoading = status;
    }
  },
  
  getters: {
    userDisplayName: (state) => {
      if (!state.user) return '';
      return state.user.userDetails || state.user.name || 'User';
    }
  }
});
