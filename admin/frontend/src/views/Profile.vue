<template>
  <div class="profile-page">
    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        label-position="top"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入昵称" size="large" />
            </el-form-item>

            <el-form-item label="角色/职位" prop="role">
              <el-input v-model="form.role" placeholder="请输入角色或职位" size="large" />
            </el-form-item>

            <el-form-item label="头像（表情）" prop="avatar">
              <el-select
                v-model="form.avatar"
                placeholder="选择头像"
                size="large"
                style="width: 100%"
              >
                <el-option label="👨‍💻" value="👨‍💻" />
                <el-option label="👩‍💻" value="👩‍💻" />
                <el-option label="🧑‍💻" value="🧑‍💻" />
                <el-option label="👨‍🎓" value="👨‍🎓" />
                <el-option label="👩‍🎓" value="👩‍🎓" />
                <el-option label="🧑‍🎓" value="🧑‍🎓" />
                <el-option label="👨‍🚀" value="👨‍🚀" />
                <el-option label="👩‍🚀" value="👩‍🚀" />
                <el-option label="🧑‍🚀" value="🧑‍🚀" />
                <el-option label="🦊" value="🦊" />
                <el-option label="🐱" value="🐱" />
                <el-option label="🐶" value="🐶" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="GitHub">
              <el-input
                v-model="form.social.github"
                placeholder="https://github.com/username"
                size="large"
                prefix-icon="Link"
              />
            </el-form-item>

            <el-form-item label="Twitter">
              <el-input
                v-model="form.social.twitter"
                placeholder="https://twitter.com/username"
                size="large"
                prefix-icon="Link"
              />
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input
                v-model="form.social.email"
                placeholder="example@email.com"
                size="large"
                prefix-icon="Message"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" size="large" @click="handleSave" :loading="loading">
            保存
          </el-button>
          <el-button size="large" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <div class="preview-section">
        <h3>预览效果</h3>
        <div class="preview-card">
          <div class="profile-hud">
            <div class="profile-avatar">{{ form.avatar }}</div>
            <div class="profile-info">
              <div class="profile-name">{{ form.name }}</div>
              <div class="profile-role">{{ form.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { getProfile, updateProfile } from '@/api'

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive({
  name: '',
  role: '',
  avatar: '👨‍💻',
  social: {
    github: '',
    twitter: '',
    email: ''
  }
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  role: [{ required: true, message: '请输入角色', trigger: 'blur' }],
  avatar: [{ required: true, message: '请选择头像', trigger: 'change' }]
}

// 加载个人信息
const loadProfile = async () => {
  try {
    const res = await getProfile()
    Object.assign(form, res.data)
  } catch (error) {
    console.error('加载个人信息失败:', error)
  }
}

// 保存
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      await updateProfile(form)
      ElMessage.success('保存成功')
    } catch (error) {
      console.error('保存失败:', error)
    } finally {
      loading.value = false
    }
  })
}

// 重置
const handleReset = () => {
  formRef.value?.resetFields()
  loadProfile()
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped lang="scss">
.profile-page {
  .preview-section {
    margin-top: 40px;

    h3 {
      margin-bottom: 20px;
      color: #303133;
    }

    .preview-card {
      background: #f5f7fa;
      padding: 40px;
      border-radius: 8px;

      .profile-hud {
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 300px;

        .profile-avatar {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          font-size: 28px;
        }

        .profile-info {
          .profile-name {
            font-size: 18px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 4px;
          }

          .profile-role {
            font-size: 14px;
            color: #909399;
          }
        }
      }
    }
  }
}
</style>
