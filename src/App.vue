<script setup>
import { usePusher } from "./composables/usePusher";
import ActivityFeed from "./components/ActivityFeed.vue";
import LampControls from "./components/LampControls.vue";
import VirtualLamp from "./components/VirtualLamp.vue";
import StreamPlayer from "./components/StreamPlayer.vue";
import { useAuth } from "./composables/useAuth";
import LoginModal from "./components/LoginModal.vue";
import ActivityOverlay from './components/ActivityOverlay.vue';

const { messages, currentColor } = usePusher();
const { isAuthenticated, isLoading, displayName, signOut } = useAuth();
const showLoginModal = ref(false);
import { ref, watch } from "vue";

function handleSignOut() {
  signOut();
}

function handleLoginClick() {
  showLoginModal.value = true;
}
</script>

<template>
  <div class="h-screen flex flex-col bg-black text-white/90">
    <!-- Top Bar -->
    <div class="h-12 flex items-center justify-between px-4 sm:px-6 border-b border-white/5">
      <div class="text-sm font-medium">I Enjoy Lamp</div>
      <button @click="isAuthenticated ? signOut() : showLoginModal = true"
              class="px-3 py-1 text-xs text-white/70 hover:text-white/90
                     rounded-full border border-white/10 hover:border-white/20 
                     transition-all duration-300">
        {{ isAuthenticated ? displayName : 'Sign in' }}
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 grid lg:grid-cols-[1fr,400px] overflow-hidden">
      <!-- Stream Section -->
      <div class="relative min-h-[40vh] lg:min-h-0">
        <!-- Stream Content - Move up in z-index -->
        <div class="absolute inset-0 z-20">
          <Suspense>
            <StreamPlayer />
            <template #fallback>
              <div class="grid place-items-center h-full">
                <div class="loading-pulse">Loading stream...</div>
              </div>
            </template>
          </Suspense>
        </div>

        <!-- Background Overlay - Move to back -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        
        <!-- Color Indicator - Move to front -->
        <div class="absolute top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 
                    rounded-full bg-black/30 backdrop-blur-sm text-xs">
          <div class="w-2 h-2 rounded-full animate-pulse"
               :style="{ backgroundColor: currentColor }">
          </div>
          <code class="font-mono text-white/70">{{ currentColor }}</code>
        </div>
        
        <!-- Activity Overlay - Move to front -->
        <ActivityOverlay class="z-30" />
      </div>

      <!-- Control Panel -->
      <div class="flex flex-col bg-black/50 backdrop-blur-md">
        <!-- Controls -->
        <div class="flex-1 overflow-auto">
          <div class="p-6">
            <LampControls 
              :current-color="currentColor" 
              :is-authenticated="isAuthenticated"
              @login-required="showLoginModal = true"
            />
          </div>
        </div>

        <!-- Activity Feed -->
        <div class="border-t border-white/5">
          <ActivityFeed />
        </div>
      </div>
    </div>

    <!-- Login Modal -->
    <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<style>
::-webkit-scrollbar {
  @apply w-0.5;
}

::-webkit-scrollbar-track {
  @apply bg-white/5;
}

::-webkit-scrollbar-thumb {
  @apply bg-white/10 hover:bg-white/20 transition-colors;
}

.loading-pulse {
  @apply text-white/50;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.2; }
}
</style>
