<script setup>
import { ref, computed } from "vue";
import { usePusher } from "../composables/usePusher";

const { currentColor } = usePusher();
const pendingColor = ref(currentColor.value);
const isUpdating = ref(false);
const error = ref(null);

// Add ref for color input
const colorInput = ref(null);

function handleColorInput(event) {
  pendingColor.value = event.target.value;
}

async function handleSetClick() {
  isUpdating.value = true;
  error.value = null;
  try {
    await fetch("/api/set", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ color: pendingColor.value }),
    });
  } catch (err) {
    error.value = "Failed to update color. Please try again.";
  } finally {
    isUpdating.value = false;
  }
}

// Computed gradients for visual effects
const gradients = computed(() => ({
  preview: `linear-gradient(45deg, ${pendingColor.value}22, ${pendingColor.value}44)`,
  hover: `linear-gradient(to right, ${pendingColor.value}11, ${pendingColor.value}33)`,
  button: `linear-gradient(165deg, transparent, ${pendingColor.value}22)`,
}));
</script>

<template>
  <div class="space-y-4">
    <!-- Color Selection -->
    <div class="space-y-2">
      <div class="text-xs font-medium text-white/70">Color Selection</div>

      <!-- Color Input -->
      <div class="group/picker relative">
        <!-- Background Glow -->
        <div
          class="absolute -inset-1 opacity-20 blur-md transition-colors duration-500"
          :style="{ backgroundColor: pendingColor }"
        ></div>

        <!-- Main Input Area -->
        <div class="relative">
          <input
            type="color"
            ref="colorInput"
            v-model="pendingColor"
            :disabled="isUpdating"
            @input="handleColorInput"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <!-- Current Selection -->
        <div class="mt-1.5 flex items-center justify-between text-[10px]">
          <div class="flex items-center gap-2">
            <div
              class="w-3 h-3 rounded-full ring-1 ring-white/20"
              :style="{ backgroundColor: pendingColor }"
            ></div>
            <code class="font-mono text-white/50">{{ pendingColor }}</code>
          </div>
          <div
            v-if="pendingColor !== currentColor"
            class="text-xs text-white/40"
          >
            Press update to apply
          </div>
        </div>
      </div>
    </div>

    <!-- Update Button -->
    <button
      @click="handleSetClick"
      :disabled="isUpdating || currentColor === pendingColor"
      class="w-full group/btn relative py-2"
    >
      <!-- Button Background -->
      <div
        class="absolute inset-0 rounded-xl transition-all duration-300 opacity-80"
        :style="{ backgroundColor: pendingColor }"
      ></div>

      <!-- Glass Effect -->
      <div
        class="absolute inset-0 rounded-xl bg-black/40 group-hover/btn:bg-black/30 transition-all duration-300"
      ></div>

      <!-- Button Content -->
      <div class="relative px-3 py-1.5 text-xs font-medium">
        {{ isUpdating ? "Updating..." : "Update Color" }}
      </div>
    </button>

    <!-- Error Display -->
    <div
      v-if="error"
      class="px-4 py-3 rounded-lg text-sm text-red-400/90 bg-red-500/10 border border-red-500/10"
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
