<script setup>
defineProps({
  show: Boolean,
});
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
  >
    <div
      class="bg-gray-900/90 rounded-2xl border border-gray-800/50 p-6 w-full max-w-md"
    >
      <h2 class="text-xl font-bold text-white mb-6 text-center">
        Sign in to control the lamp
      </h2>

      <div class="space-y-3">
        <a
          href="/.auth/login/github"
          class="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-white hover:bg-gray-800/70 transition"
        >
          <font-awesome-icon :icon="['fab', 'github']" class="w-5 h-5" />
          <span>Sign in with GitHub</span>
        </a>
        <a
          href="/.auth/login/twitter"
          class="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-white hover:bg-gray-800/70 transition"
        >
          <font-awesome-icon :icon="['fab', 'twitter']" class="w-5 h-5" />
          <span>Sign in with Twitter</span>
        </a>
        <a
          href="/.auth/login/facebook"
          class="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-white hover:bg-gray-800/70 transition"
        >
          <font-awesome-icon :icon="['fab', 'facebook']" class="w-5 h-5" />
          <span>Sign in with Facebook</span>
        </a>
        <a
          href="/.auth/login/aad"
          class="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-700 rounded-xl bg-gray-800/50 text-white hover:bg-gray-800/70 transition"
        >
          <font-awesome-icon :icon="['fab', 'microsoft']" class="w-5 h-5" />
          <span>Sign in with Microsoft</span>
        </a>
      </div>
    </div>
  </div>
</template>
