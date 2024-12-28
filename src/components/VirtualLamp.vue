<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'normal'
  }
});

const sizes = {
  small: {
    shade: 'w-12 h-8',
    neck: 'w-[2px] h-3',
    base: 'w-3 h-[2px]'
  },
  normal: {
    shade: 'w-full aspect-[4/3]',
    neck: 'w-[2px] h-5',
    base: 'w-4 h-[2px]'
  }
};
</script>

<template>
  <div class="relative">
    <div class="lamp-container">
      <div :class="[sizes[props.size].shade, 'lamp-shade']">
        <div
          class="rounded-xl transition-colors duration-500 h-full"
          :style="{
            backgroundColor: props.color,
            clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)'
          }"
        ></div>
      </div>
      <div class="lamp-stand">
        <div :class="[sizes[props.size].neck, 'mx-auto bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800']"></div>
        <div :class="[sizes[props.size].base, 'mx-auto rounded-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900']"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lamp-shade {
  transform: perspective(500px) rotateX(15deg);
}

.lamp-stand {
  transform: translateY(-4px);
}
</style>
