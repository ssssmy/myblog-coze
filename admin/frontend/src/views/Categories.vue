<template>
  <div class="categories-page">
    <el-card>
      <!-- 工具栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建根分类</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" :icon="Plus" @click="handleBatchCreate">
            批量添加
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            :icon="Delete"
            :disabled="selectedCategories.length === 0"
            @click="handleBatchDelete"
          >
            批量删除 ({{ selectedCategories.length }})
          </el-button>
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
        ref="tableRef"
        v-loading="loading"
        :data="flatData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :expand-row-keys="expandedKeys"
        @expand-change="handleExpandChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true" />
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <div
              class="category-name"
              :class="{
                'parent-category': !row.parent_id,
                'child-category': row.parent_id
              }"
              @click="toggleExpand(row)"
            >
              <span class="category-text">{{ row.name }}</span>
              <el-tag v-if="row.children && row.children.length > 0" size="small" type="info" style="margin-left: 8px" @click.stop>
                {{ row.children.length }} 子分类
              </el-tag>
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

    <!-- 批量添加对话框 -->
    <el-dialog
      v-model="batchDialogVisible"
      title="批量添加分类"
      width="800px"
      @close="handleBatchDialogClose"
    >
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="父分类">
          <el-select
            v-model="batchForm.parent_id"
            placeholder="不选择则创建根分类"
            clearable
            style="width: 100%"
          >
            <el-option
              v-for="category in parentOptions"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类列表">
          <div class="batch-input-container">
            <div
              v-for="(item, index) in batchForm.categories"
              :key="index"
              class="batch-item"
            >
              <el-input
                v-model="item.name"
                placeholder="分类名称"
                style="width: 200px; margin-right: 10px"
                maxlength="50"
              />
              <el-input
                v-model="item.description"
                placeholder="描述（可选）"
                style="width: 300px; margin-right: 10px"
                maxlength="200"
              />
              <el-button
                type="danger"
                :icon="Delete"
                circle
                size="small"
                @click="removeBatchItem(index)"
                :disabled="batchForm.categories.length <= 1"
              />
            </div>
            <el-button type="primary" :icon="Plus" @click="addBatchItem" style="margin-top: 10px">
              添加分类
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleBatchSave" :loading="batchSaving">
          批量添加
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Edit, Delete, Search } from '@element-plus/icons-vue'
import { getCategoryTree, getCategoryList, createCategory, updateCategory, deleteCategory, getCategories, batchCreateCategories } from '@/api'

const formRef = ref<FormInstance>()
const tableRef = ref()
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const batchDialogVisible = ref(false)
const batchSaving = ref(false)
const treeData = ref<any[]>([])
const flatData = ref<any[]>([])
const parentOptions = ref<any[]>([])
const expandedKeys = ref<number[]>([])
const selectedCategories = ref<any[]>([])
const currentEditId = ref<number | null>(null)
const currentParentId = ref<number | null>(null)
const searchKeyword = ref('')

const form = reactive({
  parent_id: null as number | null,
  name: '',
  description: ''
})

const batchForm = reactive({
  parent_id: null as number | null,
  categories: [
    { name: '', description: '' }
  ]
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

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCategoryTree()
    treeData.value = res.data || []
    // 直接使用树形数据，不需要扁平化
    flatData.value = treeData.value

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

// 切换展开状态（点击分类名称时触发）
const toggleExpand = (row: any) => {
  if (!row.children || row.children.length === 0) {
    return // 没有子分类时不需要展开
  }

  if (tableRef.value) {
    tableRef.value.toggleRowExpansion(row)
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

// 处理选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedCategories.value = selection
}

// 批量删除
const handleBatchDelete = async () => {
  if (selectedCategories.value.length === 0) {
    ElMessage.warning('请先选择要删除的分类')
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedCategories.value.length} 个分类吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 收集所有分类ID（包括子分类）
    const allIds = new Set<number>()
    const collectIds = (categories: any[]) => {
      categories.forEach(cat => {
        allIds.add(cat.id)
        if (cat.children) {
          collectIds(cat.children)
        }
      })
    }
    collectIds(selectedCategories.value)

    await deleteCategory(Array.from(allIds))
    ElMessage.success(`成功删除 ${allIds.size} 个分类`)
    selectedCategories.value = []
    tableRef.value?.clearSelection()
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error)
      ElMessage.error(error.response?.data?.message || '批量删除失败')
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

// 批量添加相关方法
const handleBatchCreate = () => {
  batchForm.parent_id = null
  batchForm.categories = [{ name: '', description: '' }]
  batchDialogVisible.value = true
}

const addBatchItem = () => {
  batchForm.categories.push({ name: '', description: '' })
}

const removeBatchItem = (index: number) => {
  if (batchForm.categories.length > 1) {
    batchForm.categories.splice(index, 1)
  }
}

const handleBatchDialogClose = () => {
  batchForm.parent_id = null
  batchForm.categories = [{ name: '', description: '' }]
}

const handleBatchSave = async () => {
  // 验证所有分类名称都不为空
  const emptyIndex = batchForm.categories.findIndex(item => !item.name || !item.name.trim())
  if (emptyIndex !== -1) {
    ElMessage.warning(`第 ${emptyIndex + 1} 个分类名称不能为空`)
    return
  }

  // 验证分类名称不重复
  const names = batchForm.categories.map(item => item.name.trim())
  const uniqueNames = new Set(names)
  if (names.length !== uniqueNames.size) {
    ElMessage.warning('分类名称不能重复')
    return
  }

  batchSaving.value = true
  try {
    const categories = batchForm.categories.map(item => ({
      name: item.name.trim(),
      description: item.description.trim(),
      parent_id: batchForm.parent_id
    }))

    const res = await batchCreateCategories({ categories })
    const { successCount, failCount, errors } = res.data

    if (failCount > 0) {
      ElMessage.warning(`成功添加 ${successCount} 个分类，失败 ${failCount} 个`)
      console.error('批量添加错误:', errors)
    } else {
      ElMessage.success(`成功添加 ${successCount} 个分类`)
    }

    batchDialogVisible.value = false
    loadData()
  } catch (error: any) {
    console.error('批量添加失败:', error)
    ElMessage.error(error.response?.data?.message || '批量添加失败')
  } finally {
    batchSaving.value = false
  }
}

// 搜索功能
watch(searchKeyword, (val) => {
  if (!val) {
    flatData.value = treeData.value
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
  flatData.value = matchedTree
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
    gap: 6px;
    cursor: pointer;
    user-select: none;
    padding: 6px 0;
    transition: all 0.2s ease;

    .category-text {
      font-weight: 500;
      font-size: 14px;
      line-height: 1.6;
      vertical-align: middle;
    }

    // 父分类样式
    &.parent-category {
      .category-text {
        font-size: 15px;
        font-weight: 600;
        color: #1f2937;
      }
    }

    // 子分类样式
    &.child-category {
      .category-text {
        font-size: 14px;
        font-weight: 400;
        color: #6b7280;
      }
    }

    &:hover {
      .category-text {
        color: #3b82f6;
      }
    }
  }

  // 优化树形表格展开/折叠图标样式
  :deep(.el-table__expand-icon) {
    color: #9ca3af;
    transition: all 0.25s ease;
    margin-right: 4px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    line-height: 1;

    &:hover {
      color: #3b82f6;
    }

    &.el-table__expand-icon--expanded {
      color: #3b82f6;
      transform: rotate(90deg);
    }

    svg {
      font-size: 14px;
      display: block;
      transition: transform 0.25s ease;
    }
  }

  // 确保第一列单元格内容垂直居中和对齐
  :deep(.el-table td.el-table__cell) {
    vertical-align: middle;

    &:first-child {
      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }
    }
  }

  // 优化分类名称列的对齐
  :deep(.el-table__body .el-table__row td:nth-child(2)) {
    .cell {
      display: flex !important;
      align-items: center;
      padding: 0 8px;
      gap: 0;
    }
  }

  // 优化表格行样式
  :deep(.el-table__row) {
    transition: all 0.2s ease;

    &:hover > td {
      background-color: #f8fafc !important;
    }

    // 子分类行的背景色调整 - 第一层级子分类
    &[class*='el-table__row--level-1'] > td {
      background-color: #fafbfc;
    }

    &[class*='el-table__row--level-1']:hover > td {
      background-color: #f5f7fa !important;
    }
  }

  // 展开状态的单元格
  :deep(.el-table__expanded-cell) {
    padding: 0 !important;
    background-color: transparent !important;
  }

  // 优化文章数量标签
  :deep(.el-tag) {
    font-weight: 500;
    font-size: 12px;
    padding: 2px 8px;
    height: auto;
    line-height: 1.4;
  }

  // 优化整体表格样式
  :deep(.el-table) {
    font-size: 14px;

    .el-table__header th {
      background-color: #f8fafc;
      color: #64748b;
      font-weight: 600;
      padding: 12px 0;
    }

    .el-table__body td {
      padding: 10px 0;
    }
  }

  // 批量添加样式
  .batch-input-container {
    max-height: 400px;
    overflow-y: auto;

    .batch-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
  }
}
</style>
