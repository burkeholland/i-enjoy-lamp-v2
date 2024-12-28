<script setup>
import { computed } from "vue";
import { useUserStore } from "../stores/userStore";
import { usePusher } from "../composables/usePusher";

const { messages } = usePusher();
const userStore = useUserStore();

const activities = computed(() => {
  return messages.value
    .slice(-5)
    .reverse()
    .map((msg, index) => ({
      ...msg,
      opacity: Math.max(0.3, 1 - index * 0.07), // Fade out older items
    }));
});

function formatTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}
</script>

<template>
  <div>
    <h3 class="text-white mb-3">Recent Activity</h3>
    <div class="space-y-2 max-h-48 overflow-y-auto activity-feed">
      <TransitionGroup name="activity">
        <div
          v-for="activity in activities"
          :key="activity.timestamp"
          class="text-sm text-gray-400 flex items-center transition-opacity duration-300"
          :style="{ opacity: activity.opacity }"
        >
          <div
            class="w-2 h-2 rounded-full mr-2"
            :style="{ backgroundColor: activity.color }"
          ></div>
          <span
            >{{ activity.userName }} changed color to
            <span class="font-mono">{{ activity.color }}</span>
            • {{ formatTime(activity.timestamp) }}
          </span>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.activity-feed {
  scrollbar-width: thin;
  scrollbar-color: rgb(75 85 99) transparent;
}

.activity-feed::-webkit-scrollbar {
  width: 4px;
}

.activity-feed::-webkit-scrollbar-track {
  background: transparent;
}

.activity-feed::-webkit-scrollbar-thumb {
  background-color: rgb(75 85 99);
  border-radius: 2px;
}

.activity-enter-active,
.activity-leave-active {
  transition: all 0.5s ease;
}

.activity-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.activity-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
