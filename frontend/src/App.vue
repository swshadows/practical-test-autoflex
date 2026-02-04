<script setup lang="ts">
const today = new Date().getFullYear()
</script>

<template>
  <div class="h-dvh grid grid-rows-[5%_1fr_5%]">
    <header class="px-2 py-1 bg-black flex justify-between items-center">
      <h2 class="text-white font-bold">Teste Técnico - Autoflex</h2>
      <div class="flex gap-1">
        <RouterLink to="/products">
          <button
            class="py-1 px-2 rounded bg-white hover:bg-neutral-500 cursor-pointer hover:text-white transition flex justify-between items-center gap-1"
          >
            <i class="nf nf-fa-box"></i>
            <span>Produtos</span>
          </button>
        </RouterLink>
        <RouterLink to="/materials">
          <button
            class="py-1 px-2 rounded bg-white hover:bg-neutral-500 cursor-pointer hover:text-white transition flex justify-between items-center gap-1"
          >
            <i class="nf nf-md-dots_triangle"></i>
            <span>Materiais</span>
          </button>
        </RouterLink>
      </div>
    </header>
    <RouterView></RouterView>
    <footer class="px-2 py-1 bg-black flex justify-between items-center text-white">
      <span
        >Criado por
        <a
          class="text-blue-400 font-bold hover:underline"
          href="https://github.com/swshadows/"
          target="_blank"
          rel="noopener noreferrer"
          >@swshadows</a
        ></span
      >
      <span>{{ today }}</span>
    </footer>
  </div>
</template>

<style scoped></style>
