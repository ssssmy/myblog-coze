<template>
  <div class="post-edit">
    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="16">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" size="large" />
            </el-form-item>

            <el-form-item label="文章分类" prop="category">
              <el-select
                v-model="form.category"
                placeholder="请选择分类"
                size="large"
                filterable
                allow-create
                style="width: 100%"
              >
                <el-option
                  v-for="category in categories"
                  :key="category"
                  :label="category"
                  :value="category"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="发布日期" prop="date">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="选择日期"
                size="large"
                style="width: 100%"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item label="文章内容" prop="content">
              <el-tabs v-model="activeTab" class="editor-tabs">
                <el-tab-pane label="编辑" name="edit">
                  <el-input
                    v-model="form.content"
                    type="textarea"
                    :rows="20"
                    placeholder="请输入 Markdown 格式的文章内容"
                  />
                </el-tab-pane>
                <el-tab-pane label="预览" name="preview">
                  <div class="markdown-preview" v-html="previewContent"></div>
                </el-tab-pane>
              </el-tabs>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="文章摘要">
              <el-input
                v-model="form.excerpt"
                type="textarea"
                :rows="4"
                placeholder="文章摘要，默认从内容中提取"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="large" @click="handleSave" :loading="loading">
                保存文章
              </el-button>
              <el-button size="large" @click="handleCancel">取消</el-button>
            </el-form-item>

            <el-alert
              title="Markdown 编辑提示"
              type="info"
              :closable="false"
              show-icon
            >
              <template #default>
                <ul class="markdown-tips">
                  <li>使用 # 表示一级标题</li>
                  <li>使用 ## 表示二级标题</li>
                  <li>使用 **文本** 表示粗体</li>
                  <li>使用 *文本* 表示斜体</li>
                  <li>使用 ``` 代码 ``` 表示代码块</li>
                </ul>
              </template>
            </el-alert>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { marked } from 'marked'
import { getPostDetail, createPost, updatePost, getCategories } from '@/api'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()
const loading = ref(false)
const activeTab = ref('edit')
const categories = ref<string[]>([])

const isEdit = computed(() => !!route.params.id)

const form = reactive({
  title: '',
  category: '',
  date: new Date().toISOString().split('T')[0],
  content: '',
  excerpt: ''
})

const rules: FormRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

// 预览内容
const previewContent = computed(() => {
  if (!form.content) return ''
  return marked.parse(form.content)
})

// 加载文章详情
const loadPostDetail = async () => {
  try {
    const res = await getPostDetail(Number(route.params.id))
    Object.assign(form, res.data)
  } catch (error) {
    console.error('加载文章详情失败:', error)
  }
}

// 加载分类
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const data = {
        ...form,
        excerpt: form.excerpt || form.content.substring(0, 200)
      }

      if (isEdit.value) {
        await updatePost(Number(route.params.id), data)
        ElMessage.success('更新成功')
      } else {
        await createPost(data)
        ElMessage.success('创建成功')
      }

      router.push('/posts')
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      loading.value = false
    }
  })
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(async () => {
  await loadCategories()
  if (isEdit.value) {
    await loadPostDetail()
  }
})
</script>

<style scoped lang="scss">
.post-edit {
  .editor-tabs {
    width: 100%;

    :deep(.el-tabs__content) {
      padding-top: 10px;
    }
  }

  .markdown-preview {
    min-height: 400px;
  }

  .markdown-tips {
    margin: 0;
    padding-left: 20px;
    font-size: 13px;
    color: #606266;
  }
}
</style>
