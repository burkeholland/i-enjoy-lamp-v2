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
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 transition-colors duration-700"
    :style="{
      backgroundColor: `color-mix(in srgb, ${currentColor} 2%, rgb(17 24 39))`,
    }"
  >
    <div class="min-h-screen overflow-auto p-3 sm:p-4 lg:p-8">
      <div class="max-w-6xl mx-auto">
        <div class="grid lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
          <!-- Livestream Area -->
          <div
            class="lg:col-span-3 aspect-video bg-gray-900/40 rounded-2xl sm:rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-700 border shadow-2xl relative"
            :style="{
              borderColor: `color-mix(in srgb, ${currentColor} 15%, rgb(30 41 59))`,
            }"
          >
            <Suspense>
              <StreamPlayer />
              <template #fallback>
                <div class="h-full flex items-center justify-center text-gray-500/80">
                  Loading stream...
                </div>
              </template>
            </Suspense>
            <ActivityOverlay />
          </div>

          <!-- Control Panel -->
          <div class="lg:col-span-2">
            <div
              class="bg-gray-900/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-700 border shadow-2xl"
              :style="{
                borderColor: `color-mix(in srgb, ${currentColor} 15%, rgb(30 41 59))`,
                boxShadow: `0 25px 50px -12px ${currentColor}05`,
              }"
            >
              <div class="space-y-6 sm:space-y-8">
                <LampControls 
                  :current-color="currentColor" 
                  :is-authenticated="isAuthenticated"
                  :display-name="displayName"
                  @login-required="showLoginModal = true"
                  @sign-out="handleSignOut"
                />
                <div class="border-t border-gray-800/50 pt-6 sm:pt-8">
                  <ActivityFeed />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Login Modal -->
    <LoginModal 
      :show="showLoginModal"
      @close="showLoginModal = false"
    />
  </div>
</template>

<style scoped>
video::-webkit-media-controls {
  display: none !important;
}
</style>
