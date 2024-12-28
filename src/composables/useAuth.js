import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/userStore';

export function useAuth() {
  const userStore = useUserStore();

  async function checkAuthStatus() {
    try {
      userStore.setLoading(true);
      const response = await fetch('/.auth/me');
      const data = await response.json();
      userStore.setUser(data.clientPrincipal);
    } catch (error) {
      console.error('Auth check failed:', error);
      userStore.clearUser();
    } finally {
      userStore.setLoading(false);
    }
  }

  async function signOut() {
    try {
      await fetch('/.auth/logout');
      userStore.clearUser();
      window.location.reload(); // Refresh to clear any cached state
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }

  onMounted(() => {
    checkAuthStatus();
  });

  return {
    isAuthenticated: computed(() => userStore.isAuthenticated),
    user: computed(() => userStore.user),
    isLoading: computed(() => userStore.isLoading),
    displayName: computed(() => userStore.userDisplayName),
    signOut
  };
}
