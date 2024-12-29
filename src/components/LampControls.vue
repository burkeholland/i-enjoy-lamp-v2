<script setup>
import { ref } from "vue";

const props = defineProps({
  currentColor: String,
  displayName: String,
  isAuthenticated: Boolean
});

const emit = defineEmits(["sign-out"]);
const error = ref(null);
const isUpdating = ref(false);
const pendingColor = ref("#FFFFFF");

async function handleSetClick() {
  try {
    isUpdating.value = true;
    const response = await fetch("/api/set", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        color: pendingColor.value,
        userName: props.isAuthenticated ? props.displayName : 'Anonymous'
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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl sm:text-2xl font-bold text-white">
        Lamp Control
      </h2>
      <div v-if="isAuthenticated" class="text-sm text-gray-400">
        {{ displayName }}
        <button @click="$emit('sign-out')" 
                class="ml-3 text-gray-500 hover:text-white transition-colors">
          Sign out
        </button>
      </div>
      <div v-else>
        <button @click="$emit('login-required')" 
                class="text-sm text-gray-500 hover:text-white transition-colors">
          Sign in
        </button>
      </div>
    </div>

    <!-- Color Controls -->
    <div class="control-panel p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/30">
      <label class="block text-gray-400 mb-4 text-sm font-medium">Choose Color</label>
      <input
        type="color"
        v-model="pendingColor"
        :disabled="isUpdating"
        class="w-full h-16 rounded-lg cursor-pointer"
      />
      <!-- ...existing color display... -->
    </div>

    <button
      @click="handleSetClick"
      :disabled="isUpdating"
      class="w-full bg-gray-800/50 border border-gray-700/30 text-white px-6 py-3 
             rounded-xl transition-all duration-300"
    >
      {{ isUpdating ? "Updating..." : "Update Lamp" }}
    </button>

    <!-- ...existing error handling... -->
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

    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 0.75rem;
    }

    input[type="range"] {
        background: transparent;
    }

    input[type="range"]::-webkit-slider-thumb {
        transform: scale(1);
        transition: transform 0.2s;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.5);
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    input[type="color"]::-webkit-color-swatch {
        border: none;
        border-radius: 0.5rem;
    }
</style>