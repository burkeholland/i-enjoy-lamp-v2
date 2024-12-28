<script setup>
import { ref } from "vue";

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
  <div class="space-y-6">
    <!-- Header with color gradient -->
    <div class="flex justify-between items-center">
      <h2 class="text-xl sm:text-2xl font-bold bg-clip-text text-transparent"
          :style="{ backgroundImage: `linear-gradient(to right, white, ${currentColor})` }">
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

    <!-- Color Picker with current color indicators -->
    <div class="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-1 relative">
      <!-- Active color indicator ring -->
      <div class="absolute -inset-px rounded-2xl opacity-20 transition-colors duration-500"
           :style="{ background: `linear-gradient(45deg, transparent, ${currentColor})` }">
      </div>

      <!-- Inner Container with Gradient Border -->
      <div class="relative rounded-xl bg-gray-800/50 overflow-hidden group">
        <!-- Header -->
        <div class="p-4 flex items-center justify-between border-b border-gray-700/30">
          <label class="text-sm font-medium text-gray-300">
            {{ isAuthenticated ? "Pick a Color" : "Sign in to Change Color" }}
          </label>
          <div class="flex items-center gap-2 bg-gray-900/50 px-2 py-1 rounded-full">
            <div class="w-3 h-3 rounded-full shadow-lg transition-all duration-300"
                 :style="{ backgroundColor: pendingColor }">
            </div>
            <code class="text-xs text-gray-400 font-mono">{{ pendingColor }}</code>
          </div>
        </div>

        <!-- Color Input Area -->
        <div class="relative p-6">
          <!-- Background Glow -->
          <div class="absolute inset-0 opacity-30 blur-2xl transition-all duration-500"
               :style="{ backgroundColor: pendingColor }">
          </div>

          <!-- Main Input -->
          <div class="relative z-10">
            <div class="relative group/input">
              <input
                type="color"
                v-model="pendingColor"
                :disabled="isUpdating"
                @input="handleColorInput"
                class="w-full h-16 rounded-xl cursor-pointer border-0 bg-transparent
                       transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
              />
              <!-- Shine Effect -->
              <div class="absolute inset-0 rounded-xl opacity-0 group-hover/input:opacity-100 
                         transition-opacity duration-300 pointer-events-none"
                   :style="{ background: `linear-gradient(120deg, ${pendingColor}10, ${pendingColor}30)` }">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      @click="handleSetClick"
      :disabled="isUpdating"
      class="w-full group relative overflow-hidden border border-gray-700/30 text-white px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-700"
      :style="{
        borderColor: `color-mix(in srgb, ${currentColor} 30%, rgb(75 85 99 / 0.3))`,
        background: isAuthenticated ? 
          `linear-gradient(45deg, rgba(31, 41, 55, 0.5), color-mix(in srgb, ${currentColor} 10%, rgba(31, 41, 55, 0.5)))` :
          undefined
      }"
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
    >      {{ error }}    
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