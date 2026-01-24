<template>
  <div class="categories-page">
    <el-card>
      <!-- 工具栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建根分类</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索分类"
            clearable
            style="width: 200px"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <!-- 分类树 -->
      <el-table
        v-loading="loading"
        :data="flatData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :expand-row-keys="expandedKeys"
        :default-expand-all="true"
        @expand-change="handleExpandChange"
        @row-click="handleRowClick"
      >
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <div class="category-name" :class="{ 'clickable': row.hasChildren }">
              <span>{{ row.name }}</span>
              <el-tag v-if="row.parent_id" size="small" type="info" style="margin-left: 8px">
                子分类
              </el-tag>
              <el-icon v-if="row.hasChildren" class="expand-hint" :size="14" style="margin-left: 6px">
                <component :is="expandedKeys.includes(row.id) ? ArrowDown : ArrowRight" />
              </el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="post_count" label="文章数量" width="100" align="center">
          <template #default="{ row }">
            <el-tag type="success">{{ row.post_count ?? 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Plus" @click.stop="handleCreateChild(row)">
              添加子分类
            </el-button>
            <el-button type="primary" link :icon="Edit" @click.stop="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link :icon="Delete" @click.stop="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="父分类" prop="parent_id" v-if="showParentSelect">
          <el-select
            v-model="form.parent_id"
            placeholder="选择父分类"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="category in parentOptions"
              :key="category.id"
              :label="category.path"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入分类描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search, ArrowDown, ArrowRight } from '@element-plus/icons-vue'
import { getCategoryTree, getCategoryList, createCategory, updateCategory, deleteCategory, getCategories } from '@/api'

const formRef = ref<FormInstance>()
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const treeData = ref<any[]>([])
const flatData = ref<any[]>([])
const parentOptions = ref<any[]>([])
const expandedKeys = ref<number[]>([])
const currentEditId = ref<number | null>(null)
const currentParentId = ref<number | null>(null)
const searchKeyword = ref('')

const form = reactive({
  parent_id: null as number | null,
  name: '',
  description: ''
})

const showParentSelect = computed(() => {
  return currentEditId.value !== null || currentParentId.value !== null
})

const dialogTitle = computed(() => {
  if (currentEditId.value) return '编辑分类'
  if (currentParentId.value) return `创建子分类 (父分类: ${getParentName(currentParentId.value)})`
  return '新建根分类'
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  description: [
    { max: 200, message: '描述长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取父分类名称
const getParentName = (parentId: number) => {
  const findParent = (categories: any[], id: number): string => {
    for (const cat of categories) {
      if (cat.id === id) return cat.name
      if (cat.children) {
        const found = findParent(cat.children, id)
        if (found) return found
      }
    }
    return '未知'
  }
  return findParent(treeData.value, parentId)
}

// 扁平化树形数据用于表格展示
// Element Plus 树形表格需要扁平的数组，但保留 children 属性用于展示层级
const flattenTree = (categories: any[]): any[] => {
  const result: any[] = []
  
  const process = (list: any[]) => {
    list.forEach(item => {
      const { children, ...rest } = item
      result.push({
        ...rest,
        children: children && children.length > 0 ? children : undefined,
        hasChildren: children && children.length > 0
      })
      
      if (children && children.length > 0) {
        process(children)
      }
    })
  }
  
  process(categories)
  return result
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCategoryTree()
    treeData.value = res.data || []
    flatData.value = flattenTree(treeData.value)

    // 加载所有分类用于父分类选择
    const allRes = await getCategories()
    parentOptions.value = allRes.data || []
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

// 展开变化处理
const handleExpandChange = (row: any, expanded: boolean) => {
  if (expanded) {
    expandedKeys.value.push(row.id)
  } else {
    const index = expandedKeys.value.indexOf(row.id)
    if (index > -1) {
      expandedKeys.value.splice(index, 1)
    }
  }
}

// 点击行触发展开/折叠
const handleRowClick = (row: any) => {
  if (row.hasChildren) {
    const index = expandedKeys.value.indexOf(row.id)
    if (index > -1) {
      expandedKeys.value.splice(index, 1)
    } else {
      expandedKeys.value.push(row.id)
    }
  }
}

// 新建根分类
const handleCreate = () => {
  currentEditId.value = null
  currentParentId.value = null
  form.parent_id = null
  form.name = ''
  form.description = ''
  dialogVisible.value = true
}

// 创建子分类
const handleCreateChild = (row: any) => {
  currentEditId.value = null
  currentParentId.value = row.id
  form.parent_id = row.id
  form.name = ''
  form.description = ''
  dialogVisible.value = true
}

// 编辑
const handleEdit = async (row: any) => {
  currentEditId.value = row.id
  currentParentId.value = null
  form.parent_id = row.parent_id || null
  form.name = row.name
  form.description = row.description || ''
  dialogVisible.value = true
}

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteCategory(row.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        parent_id: form.parent_id
      }

      if (currentEditId.value) {
        await updateCategory(currentEditId.value, data)
        ElMessage.success('更新成功')
      } else {
        await createCategory(data)
        ElMessage.success('创建成功')
      }

      dialogVisible.value = false
      loadData()
    } catch (error: any) {
      console.error('保存失败:', error)
      ElMessage.error(error.response?.data?.message || '保存失败')
    } finally {
      saving.value = false
    }
  })
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  form.name = ''
  form.description = ''
  form.parent_id = null
}

// 搜索功能
watch(searchKeyword, (val) => {
  if (!val) {
    flatData.value = flattenTree(treeData.value)
    return
  }

  const keyword = val.toLowerCase()
  const searchTree = (categories: any[]): any[] => {
    let result = []

    categories.forEach(category => {
      const matchName = category.name.toLowerCase().includes(keyword)
      const matchDesc = category.description && category.description.toLowerCase().includes(keyword)

      if (matchName || matchDesc) {
        result.push(category)
      }

      if (category.children) {
        const matchedChildren = searchTree(category.children)
        if (matchedChildren.length > 0) {
          if (result.length === 0 || !result.includes(category)) {
            result.push({
              ...category,
              children: matchedChildren
            })
          }
        }
      }
    })

    return result
  }

  const matchedTree = searchTree(treeData.value)
  flatData.value = flattenTree(matchedTree)
})

onMounted(() => {
  loadData()
})
</script>

<style scoped lang="scss">
.categories-page {
  .search-form {
    margin-bottom: 20px;
  }

  .category-name {
    display: flex;
    align-items: center;
    cursor: default;

    &.clickable {
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;

      &:hover {
        color: #409eff;

        .expand-hint {
          opacity: 1;
        }
      }
    }

    .expand-hint {
      opacity: 0.6;
      transition: opacity 0.2s;
    }
  }
}

// 让表格行可点击，增加视觉反馈
:deep(.el-table__row) {
  cursor: pointer;
}
</style>
