<script setup>
import { ref } from "vue";
import VirtualLamp from "./VirtualLamp.vue";

const props = defineProps({
  currentColor: {
    type: String,
    required: true,
  },
  isAuthenticated: {
    type: Boolean,
    required: true,
  },
  displayName: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["login-required", "sign-out"]);

const error = ref(null);
const isUpdating = ref(false);
const pendingColor = ref("#FFFFFF");

function handleColorInput() {
  if (!props.isAuthenticated) {
    emit("login-required");
    return;
  }
}

async function handleSetClick() {
  if (!props.isAuthenticated) {
    emit("login-required");
    return;
  }

  try {
    isUpdating.value = true;
    const response = await fetch("/api/set", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: pendingColor.value,
        userName: props.displayName
      }),
    });

    if (!response.ok) throw new Error("Failed to update lamp");
  } catch (err) {
    error.value = err.message;
  } finally {
    isUpdating.value = false;
  }
}
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <div class="flex justify-between items-center">
      <h2
        class="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
      >
        Lamp Control
      </h2>
      <div v-if="isAuthenticated" class="flex items-center gap-3">
        <span class="text-sm text-gray-400">{{ displayName }}</span>
        <button @click="$emit('sign-out')"
                class="text-sm text-gray-400 hover:text-white transition-colors
                       px-2 py-1 rounded-lg hover:bg-gray-800/50">
          Sign out
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:gap-6">
      <!-- Color Picker -->
      <div
        class="control-panel p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/30 transition-all duration-700"
        :class="{ 'opacity-50': isUpdating }"
      >
        <label class="block text-gray-400 mb-3 sm:mb-4 text-sm font-medium">
          {{ isAuthenticated ? "Choose Color" : "Sign in to Change Color" }}
        </label>
        <input
          type="color"
          class="w-full h-24 sm:h-32 rounded-lg sm:rounded-xl cursor-pointer transition-transform duration-300 hover:scale-[1.02] touch-manipulation"
          v-model="pendingColor"
          :disabled="isUpdating"
          @input="handleColorInput"
        />
        <div
          class="mt-2 sm:mt-3 flex justify-between text-gray-400 text-xs sm:text-sm font-mono"
        >
          <span>Pending</span>
          <span>{{ pendingColor }}</span>
        </div>
      </div>

      <!-- Current Lamp -->
      <div
        class="control-panel p-4 sm:p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-700/30 transition-all duration-700"
      >
        <label class="block text-gray-400 mb-4 text-sm font-medium"
          >Current Color</label
        >
        <div class="h-32 flex items-center justify-center">
          <div class="w-32">
            <VirtualLamp :color="currentColor" size="normal" />
          </div>
        </div>
        <div class="mt-3 flex justify-between text-gray-400 text-sm font-mono">
          <span>Active</span>
          <span>{{ currentColor }}</span>
        </div>
      </div>
    </div>

    <button
      @click="handleSetClick"
      :disabled="isUpdating"
      class="w-full group relative overflow-hidden border border-gray-700/30 text-white px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-700"
    >
      <span class="relative z-10 font-medium">
        {{
          !isAuthenticated
            ? "Sign in to Control Lamp"
            : isUpdating
            ? "Updating..."
            : "Update Lamp"
        }}
      </span>
    </button>

    <!-- Error message -->
    <div
      v-if="error"
      class="text-red-500 text-sm p-4 bg-red-500/10 rounded-xl border border-red-500/20"
    >
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  transition: all 0.3s ease;
}

.control-panel:active {
  transform: scale(0.98);
}

@media (hover: hover) {
  .control-panel:hover {
    transform: translateY(-2px);
  }
}
</style>
