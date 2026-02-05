<script setup lang="ts">
const emit = defineEmits(['close'])
defineProps<{ bodyClasses?: string }>()
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-0 left-0 w-full h-screen grid place-items-center backdrop-blur-2xl bg-black/50"
      @mousedown.self="emit('close')"
    >
      <button
        class="absolute right-2 top-2 text-md bg-red-300 text-black rounded-full w-8 h-8 grid place-items-center hover:bg-red-400 transition cursor-pointer"
        @click="emit('close')"
      >
        &times;
      </button>
      <div class="w-1/2 h-1/2 overflow-y-auto bg-white rounded-xl" :class="bodyClasses">
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>
