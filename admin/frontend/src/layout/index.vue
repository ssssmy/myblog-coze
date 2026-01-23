<template>
  <div class="layout-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="logo">
          <span v-if="!isCollapse">管理后台</span>
          <span v-else>Admin</span>
        </div>

        <el-menu
          :default-active="activeMenu"
          :collapse="isCollapse"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409eff"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Odometer /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <el-menu-item index="/posts">
            <el-icon><Document /></el-icon>
            <template #title>文章管理</template>
          </el-menu-item>

          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <template #title>个人信息</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部导航 -->
        <el-header>
          <div class="header-left">
            <el-icon class="collapse-icon" @click="toggleCollapse">
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>

            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="user-info">
                <el-icon><Avatar /></el-icon>
                <span>{{ userInfo?.username || 'Admin' }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { changePassword } from '@/api'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const userInfo = ref<any>(null)

// 密码修改对话框
const passwordDialogVisible = ref(false)
const passwordFormRef = ref<FormInstance>()
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 当前页面标题
const currentPageTitle = computed(() => {
  return route.meta.title as string || ''
})

// 激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 获取用户信息
const getUserInfo = () => {
  const userStr = localStorage.getItem('admin_user')
  if (userStr) {
    userInfo.value = JSON.parse(userStr)
  }
}

// 切换侧边栏
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'changePassword') {
    passwordDialogVisible.value = true
  }
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return

    passwordLoading.value = true
    try {
      await changePassword({
        username: userInfo.value.username,
        ...passwordForm
      })
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
      // 清空表单
      passwordFormRef.value.resetFields()
    } catch (error) {
      console.error('修改密码失败:', error)
    } finally {
      passwordLoading.value = false
    }
  })
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}

// 初始化
getUserInfo()
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;

  .el-container {
    height: 100%;
  }

  .el-aside {
    background-color: #304156;
    transition: width 0.3s;
    overflow-x: hidden;

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: bold;
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .collapse-icon {
        font-size: 20px;
        cursor: pointer;
        color: #909399;
        transition: color 0.3s;

        &:hover {
          color: #409eff;
        }
      }
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 8px 12px;
        border-radius: 4px;
        transition: background-color 0.3s;

        &:hover {
          background-color: #f5f7fa;
        }

        .el-icon {
          font-size: 20px;
        }
      }
    }
  }

  .el-main {
    background-color: #f0f2f5;
    padding: 20px;
    overflow-y: auto;
  }
}
</style>
