<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        我的博客
      </RouterLink>
      <nav class="flex gap-6">
        <RouterLink
          v-for="category in categories"
          :key="category"
          :to="`/category/${encodeURIComponent(category)}`"
          class="text-gray-600 hover:text-blue-600 transition-colors"
        >
          {{ category }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

const categories = ['技术', '生活', '随笔'];
</script>
