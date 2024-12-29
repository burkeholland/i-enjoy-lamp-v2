<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import { usePusher } from '../composables/usePusher';

const { messages } = usePusher();
const visibleActivities = ref([]);
const timeouts = new Map();

// Cleanup function to prevent memory leaks
function clearTimeouts() {
  timeouts.forEach(timeout => clearTimeout(timeout));
  timeouts.clear();
}

// Watch messages for changes with immediate effect
watch(() => messages.value, (newMessages, oldMessages) => {
  if (!oldMessages || newMessages.length > oldMessages.length) {
    const latestActivity = {
      ...newMessages[newMessages.length - 1],
      id: Date.now()
    };
    
    // Add new activity
    visibleActivities.value = [...visibleActivities.value, latestActivity];
    
    // Set timeout to remove this specific activity
    const timeout = setTimeout(() => {
      visibleActivities.value = visibleActivities.value
        .filter(activity => activity.id !== latestActivity.id);
      timeouts.delete(latestActivity.id);
    }, 4000);
    
    timeouts.set(latestActivity.id, timeout);
  }
}, { immediate: true });

// Cleanup on component unmount
onBeforeUnmount(() => {
  clearTimeouts();
});
</script>

<template>
  <div class="absolute bottom-4 left-4 right-4 pointer-events-none">
    <TransitionGroup 
      name="activity"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="activity in visibleActivities"
        :key="activity.id"
        class="text-sm text-white flex items-center transition-all duration-300
               bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2 max-w-md pointer-events-none"
      >
        <div
          class="w-2 h-2 rounded-full mr-2 shrink-0"
          :style="{ backgroundColor: activity.color }"
        ></div>
        <span class="truncate">
          {{ activity.userName }} changed color to
          <span class="font-mono">{{ activity.color }}</span>
        </span>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.activity-enter-active,
.activity-leave-active {
  transition: all 0.5s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.activity-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>