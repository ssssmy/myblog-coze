<template>
  <div>
    <h1 class="text-4xl font-bold text-gray-800 mb-8">最新文章</h1>
    <div class="grid gap-6">
      <article
        v-for="post in posts"
        :key="post.id"
        class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="p-6">
          <div class="flex items-center gap-4 mb-3">
            <RouterLink
              :to="`/category/${encodeURIComponent(post.category)}`"
              class="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
            >
              {{ post.category }}
            </RouterLink>
            <span class="text-gray-500 text-sm">{{ post.date }}</span>
          </div>
          <RouterLink :to="`/post/${post.id}`">
            <h2 class="text-2xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors">
              {{ post.title }}
            </h2>
          </RouterLink>
          <p class="text-gray-600 mb-4 line-clamp-3">{{ post.excerpt }}</p>
          <RouterLink
            :to="`/post/${post.id}`"
            class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            阅读更多 →
          </RouterLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

const posts: Post[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 深入理解',
    excerpt: 'Vue 3 的 Composition API 为我们提供了更灵活的代码组织方式。本文将深入探讨其核心概念、使用场景以及最佳实践。',
    category: '技术',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握 TypeScript 的高级类型特性，可以让你的代码更加健壮和类型安全。本文介绍泛型、条件类型、映射类型等高级技巧。',
    category: '技术',
    date: '2024-01-10',
  },
  {
    id: '3',
    title: '我的程序员工涯感悟',
    excerpt: '作为一个程序员，我经历了从学生到职场人的转变。在这篇文章中，我分享一些关于职业发展的思考和感悟。',
    category: '随笔',
    date: '2024-01-05',
  },
  {
    id: '4',
    title: '如何保持高效的学习状态',
    excerpt: '在快速变化的技术领域，持续学习是必不可少的。本文分享一些我在学习过程中总结的方法和技巧。',
    category: '生活',
    date: '2024-01-01',
  },
  {
    id: '5',
    title: '前端性能优化实战指南',
    excerpt: '从代码层面到架构层面，全方位介绍前端性能优化的策略和最佳实践，帮助你构建更快的 Web 应用。',
    category: '技术',
    date: '2023-12-28',
  },
  {
    id: '6',
    title: '周末的咖啡时光',
    excerpt: '在一个阳光明媚的周末，我来到了一家安静的咖啡馆，享受难得的闲暇时光。',
    category: '生活',
    date: '2023-12-25',
  },
];
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
