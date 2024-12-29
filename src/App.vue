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
  <!-- Main container with subtle background tint -->
  <div class="min-h-screen bg-gray-900 transition-all duration-700"
       :style="{
         backgroundColor: `color-mix(in srgb, ${currentColor} 1%, rgb(17 24 39))`
       }">
    <!-- Color progress bar -->
    <div class="fixed top-0 left-0 right-0 h-0.5 transition-all duration-500"
         :style="{ backgroundColor: currentColor }">
    </div>

    <div class="min-h-screen overflow-auto p-3 sm:p-4 lg:p-8">
      <div class="max-w-6xl mx-auto">


        <div class="grid lg:grid-cols-5 gap-3 sm:gap-6 lg:gap-8">
          <!-- Livestream Area with color reflections -->
          <div class="lg:col-span-3 aspect-video relative">
            <!-- Color reflection container -->
            <div class="absolute inset-0 rounded-2xl opacity-10 transition-all duration-500 blur-2xl"
                 :style="{ backgroundColor: currentColor }">
            </div>
            <!-- Main content container -->
            <div class="relative h-full rounded-2xl bg-gray-900/40 backdrop-blur-xl 
                        overflow-hidden border shadow-2xl"
                 :style="{
                   borderColor: `color-mix(in srgb, ${currentColor} 15%, rgb(30 41 59))`,
                   boxShadow: `0 0 50px ${currentColor}05`
                 }">
              <!-- Color indicator pill -->
              <div class="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 
                          rounded-full bg-black/30 backdrop-blur-sm text-white/70 text-xs">
                <div class="w-2 h-2 rounded-full transition-colors duration-500"
                     :style="{ backgroundColor: currentColor }">
                </div>
                <span class="font-mono">{{ currentColor }}</span>
              </div>
              
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
          </div>

          <!-- Control Panel with color accents -->
          <div class="lg:col-span-2">
            <div class="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 sm:p-6 
                        transition-all duration-700 border shadow-2xl"
                 :style="{
                   borderColor: `color-mix(in srgb, ${currentColor} 15%, rgb(30 41 59))`,
                   background: `linear-gradient(180deg, 
                     rgba(17, 24, 39, 0.4) 0%, 
                     color-mix(in srgb, ${currentColor} 3%, rgba(17, 24, 39, 0.4)) 100%)`,
                   boxShadow: `0 25px 50px -12px ${currentColor}05`
                 }">
              <div class="space-y-6 sm:space-y-8">
                <LampControls 
                  :current-color="currentColor" 
                  :is-authenticated="isAuthenticated"
                  :display-name="displayName"
                  @login-required="handleLoginClick"
                  @sign-out="signOut"
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
