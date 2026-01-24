<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink to="/" class="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
        我的博客
      </RouterLink>
      
      <!-- 分类导航 -->
      <nav class="flex gap-6">
        <RouterLink
          to="/"
          class="text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          首页
        </RouterLink>
        
        <!-- 分类下拉菜单 -->
        <div
          v-for="category in categories"
          :key="category.id"
          class="relative group"
          @mouseenter="handleMouseEnter(category.id)"
          @mouseleave="handleMouseLeave(category.id)"
        >
          <RouterLink
            :to="`/category/${encodeURIComponent(category.name)}`"
            class="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors font-medium py-2"
          >
            {{ category.name }}
            <svg
              v-if="category.children && category.children.length > 0"
              class="w-4 h-4 transition-transform duration-200"
              :class="{ 'rotate-180': expandedCategories.has(category.id) }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </RouterLink>
          
          <!-- 子分类下拉菜单 -->
          <div
            v-if="category.children && category.children.length > 0"
            class="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
          >
            <div class="py-2">
              <RouterLink
                v-for="child in category.children"
                :key="child.id"
                :to="`/category/${encodeURIComponent(child.name)}`"
                class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <div class="flex items-center justify-between">
                  <span>{{ child.name }}</span>
                  <span v-if="child.count !== undefined" class="text-xs text-gray-400">
                    {{ child.count }}
                  </span>
                </div>
                
                <!-- 三级分类 -->
                <div
                  v-if="child.children && child.children.length > 0"
                  class="ml-4 mt-1 pt-1 border-t border-gray-100"
                >
                  <RouterLink
                    v-for="grandchild in child.children"
                    :key="grandchild.id"
                    :to="`/category/${encodeURIComponent(grandchild.name)}`"
                    class="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div class="flex items-center justify-between">
                      <span>{{ grandchild.name }}</span>
                      <span v-if="grandchild.count !== undefined" class="text-xs text-gray-400">
                        {{ grandchild.count }}
                      </span>
                    </div>
                  </RouterLink>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';

interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id: number | null;
  count?: number;
  children?: Category[];
}

const categories = ref<Category[]>([]);
const expandedCategories = ref(new Set<number>());
const loading = ref(false);

// 加载分类数据
const loadCategories = async () => {
  try {
    loading.value = true;
    const response = await fetch('http://localhost:3001/api/categories');
    const result = await response.json();
    
    if (result.success) {
      categories.value = result.data;
    }
  } catch (error) {
    console.error('加载分类失败:', error);
  } finally {
    loading.value = false;
  }
};

// 鼠标进入处理
const handleMouseEnter = (categoryId: number) => {
  expandedCategories.value.add(categoryId);
};

// 鼠标离开处理
const handleMouseLeave = (categoryId: number) => {
  expandedCategories.value.delete(categoryId);
};

onMounted(() => {
  loadCategories();
});
</script>
