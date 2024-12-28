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

    <!-- Color Picker (full width) -->
    <div class="bg-gray-800/30 backdrop-blur-xl rounded-2xl overflow-hidden">
      <div class="p-4 border-b border-gray-700/30 flex items-center justify-between">
        <label class="text-sm font-medium text-gray-300">
          {{ isAuthenticated ? "Choose Color" : "Sign in to Change Color" }}
        </label>
        <div class="flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full transition-all duration-300"
                :style="{ backgroundColor: pendingColor }">
          </span>
          <code class="text-xs text-gray-500 font-mono">{{ pendingColor }}</code>
        </div>
      </div>

      <div class="p-6 relative">
        <div class="absolute inset-0 opacity-10 transition-all duration-500"
             :style="{ backgroundColor: pendingColor }">
        </div>
        
        <div class="relative">
          <input
            type="color"
            v-model="pendingColor"
            :disabled="isUpdating"
            @input="handleColorInput"
            class="w-full h-12 rounded-lg cursor-pointer border-0 bg-transparent
                   hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          />
          <div class="absolute inset-0 pointer-events-none rounded-lg 
                      ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300">
          </div>
        </div>

        <div class="h-1 w-full mt-4 rounded-full overflow-hidden bg-gray-800/50">
          <div class="h-full w-full transition-all duration-300"
               :style="{ background: `linear-gradient(to right, transparent, ${pendingColor})` }">
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
  }}input[type="color"]::-webkit-color-swatch-wrapper {  padding: 0;}input[type="color"]::-webkit-color-swatch {  border: none;  border-radius: 0.5rem;}</style>