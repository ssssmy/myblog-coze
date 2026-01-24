<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <div class="flex gap-6">
        <!-- 左侧分类侧边栏 -->
        <CategorySidebar />
        
        <!-- 右侧主内容区域 -->
        <div class="flex-1">
          <RouterView />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import CategorySidebar from './components/CategorySidebar.vue';
</script>
