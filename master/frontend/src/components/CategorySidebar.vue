<template>
  <aside class="w-64 bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">分类导航</h2>
    
    <!-- 加载中 -->
    <div v-if="loading" class="text-gray-500 text-center py-4">
      加载中...
    </div>
    
    <!-- 分类树 -->
    <ul v-else class="space-y-2">
      <li v-for="category in categories" :key="category.id">
        <div class="category-item">
          <div 
            class="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
            @click="toggleCategory(category.id)"
          >
            <div class="flex items-center gap-2">
              <!-- 展开/折叠图标 -->
              <svg
                v-if="category.children && category.children.length > 0"
                class="w-4 h-4 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-90': expandedCategories.has(category.id) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
              <span
                class="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                :class="{ 'font-bold': expandedCategories.has(category.id) }"
              >
                {{ category.name }}
              </span>
            </div>
            <span v-if="category.count !== undefined" class="text-xs text-gray-400">
              {{ category.count }}
            </span>
          </div>
          
          <!-- 子分类 -->
          <ul
            v-if="category.children && category.children.length > 0 && expandedCategories.has(category.id)"
            class="ml-4 mt-1 space-y-1"
          >
            <li v-for="child in category.children" :key="child.id">
              <div class="category-item">
                <div 
                  class="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  @click="toggleCategory(child.id)"
                >
                  <div class="flex items-center gap-2">
                    <!-- 展开/折叠图标 -->
                    <svg
                      v-if="child.children && child.children.length > 0"
                      class="w-4 h-4 text-gray-500 transition-transform duration-200"
                      :class="{ 'rotate-90': expandedCategories.has(child.id) }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <RouterLink
                      :to="`/category/${encodeURIComponent(child.name)}`"
                      class="text-gray-600 hover:text-blue-600 transition-colors"
                      @click.stop
                    >
                      {{ child.name }}
                    </RouterLink>
                  </div>
                  <span v-if="child.count !== undefined" class="text-xs text-gray-400">
                    {{ child.count }}
                  </span>
                </div>
                
                <!-- 三级分类 -->
                <ul
                  v-if="child.children && child.children.length > 0 && expandedCategories.has(child.id)"
                  class="ml-4 mt-1 space-y-1"
                >
                  <li v-for="grandchild in child.children" :key="grandchild.id">
                    <RouterLink
                      :to="`/category/${encodeURIComponent(grandchild.name)}`"
                      class="block py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                      @click.stop
                    >
                      <div class="flex items-center justify-between">
                        <span class="text-sm">{{ grandchild.name }}</span>
                        <span v-if="grandchild.count !== undefined" class="text-xs text-gray-400">
                          {{ grandchild.count }}
                        </span>
                      </div>
                    </RouterLink>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </aside>
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
    console.log('侧边栏：开始加载分类数据...');
    const response = await fetch('http://localhost:3001/api/categories');
    const result = await response.json();
    
    console.log('侧边栏：分类数据响应:', result);
    
    if (result.success) {
      categories.value = result.data;
      console.log('侧边栏：分类数据已加载:', categories.value);
    }
  } catch (error) {
    console.error('侧边栏：加载分类失败:', error);
  } finally {
    loading.value = false;
  }
};

// 切换分类展开/折叠
const toggleCategory = (categoryId: number) => {
  if (expandedCategories.value.has(categoryId)) {
    expandedCategories.value.delete(categoryId);
  } else {
    expandedCategories.value.add(categoryId);
  }
};

onMounted(() => {
  console.log('侧边栏组件已挂载');
  loadCategories();
});
</script>
