<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const playerContainer = ref(null);
let player = null;

onMounted(() => {
  // Load YouTube API
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Initialize player when API is ready
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player(playerContainer.value, {
      width: '100%',
      height: '100%',
      videoId: 'Bi4UcrnVeM4', // Updated with your stream ID
      playerVars: {
        autoplay: 1,
        controls: 1,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        fs: 1, // Enable fullscreen
        iv_load_policy: 3 // Hide video annotations
      },
      events: {
        onError: (e) => console.error('YouTube Player Error:', e),
        onReady: (e) => {
          // Start playing when ready
          e.target.playVideo();
        }
      }
    });
  };
});

onUnmounted(() => {
  if (player) {
    player.destroy();
  }
});
</script>

<template>
  <div class="relative w-full h-full">
    <div class="absolute inset-0">
      <div ref="playerContainer" class="w-full h-full"></div>
    </div>
    <!-- Stream delay disclaimer -->
    <div class="absolute top-4 left-4 right-4 flex justify-center pointer-events-none">
      <div class="px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full 
                  text-white/70 text-xs sm:text-sm">
        Stream delayed by a few seconds
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(iframe) {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
