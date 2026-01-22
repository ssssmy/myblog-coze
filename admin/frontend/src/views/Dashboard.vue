<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon article">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">文章总数</p>
              <p class="stat-value">{{ stats.totalPosts }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon category">
              <el-icon><Folder /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">分类数量</p>
              <p class="stat-value">{{ stats.totalCategories }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">管理员</p>
              <p class="stat-value">{{ stats.totalUsers }}</p>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon today">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <p class="stat-title">今日更新</p>
              <p class="stat-value">{{ stats.todayPosts }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最新文章</span>
              <el-button type="text" @click="router.push('/posts')">查看更多</el-button>
            </div>
          </template>
          <el-table :data="recentPosts" style="width: 100%">
            <el-table-column prop="title" label="标题" show-overflow-tooltip />
            <el-table-column prop="category" label="分类" width="100" />
            <el-table-column prop="date" label="日期" width="120" />
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>分类统计</span>
            </div>
          </template>
          <el-table :data="categoryStats" style="width: 100%">
            <el-table-column prop="category" label="分类名称" />
            <el-table-column prop="count" label="文章数量" width="120" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPostList, getCategories } from '@/api'

const router = useRouter()

const stats = ref({
  totalPosts: 0,
  totalCategories: 0,
  totalUsers: 1,
  todayPosts: 0
})

const recentPosts = ref<any[]>([])
const categoryStats = ref<any[]>([])

const loadStats = async () => {
  try {
    // 获取文章统计
    const postsRes = await getPostList({ page: 1, pageSize: 1000 })
    stats.value.totalPosts = postsRes.data.total

    // 今日文章
    const today = new Date().toISOString().split('T')[0]
    const todayPosts = postsRes.data.list.filter((p: any) => p.date === today)
    stats.value.todayPosts = todayPosts.length

    // 最新文章
    recentPosts.value = postsRes.data.list.slice(0, 5)

    // 获取分类统计
    const categories = await getCategories()
    stats.value.totalCategories = categories.data.length

    // 分类文章统计
    const categoryMap = new Map()
    postsRes.data.list.forEach((post: any) => {
      const count = categoryMap.get(post.category) || 0
      categoryMap.set(post.category, count + 1)
    })

    categoryStats.value = Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count
    }))
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped lang="scss">
.dashboard {
  .stat-card {
    .stat-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        color: white;

        &.article {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.category {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.user {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.today {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
      }

      .stat-info {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
