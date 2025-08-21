<template>
  <div class="register-dialog">
    <!-- 注册弹窗 -->
    <el-dialog
      v-model="visible"
      width="30%"
      modal-class="custom-register-mask"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="register-content">
        <div class="register-header">
          <h2>欢迎加入pure-mall</h2>
        </div>
        
        <el-form ref="formRef" :model="formData" :rules="rules" class="register-form">
          <el-form-item prop="username">
            <el-input 
              v-model="formData.username" 
              placeholder="用户名"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="email">
            <el-input 
              v-model="formData.email" 
              placeholder="邮箱地址"
              size="large"
              clearable
            >
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="password">
            <el-input 
              v-model="formData.password" 
              type="password" 
              placeholder="设置密码"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password" 
              placeholder="确认密码"
              size="large"
              show-password
            >
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          
          <div class="form-footer">
            <el-button 
              class="register-btn" 
              type="primary" 
              size="large"
              @click="submit"
            >
              注册账户
            </el-button>
            
            <div class="login-hint">
              已有账户? 
              <el-link type="primary" @click="goToLogin">立即登录</el-link>
            </div>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

const emit = defineEmits(['success', 'cancel', 'to-login'])

const visible = defineModel<boolean>('visible', { required: true })

// 表单数据
const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 表单引用
const formRef = ref<FormInstance | null>(null)

// 验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在3到16个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少8位', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (!/[A-Z]/.test(value)) {
          callback(new Error('至少包含一个大写字母'))
        } else if (!/[a-z]/.test(value)) {
          callback(new Error('至少包含一个小写字母'))
        } else if (!/[0-9]/.test(value)) {
          callback(new Error('至少包含一个数字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value !== formData.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 提交表单
const submit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  
  // 模拟API调用
  try {
    // 这里应该是实际的注册API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElNotification({
      title: '注册成功',
      message: '您的账户已成功创建',
      type: 'success'
    })
    
    // 通知父组件注册成功
    emit('success', {
      username: formData.username,
      email: formData.email
    })
    
    // 清空表单
    formRef.value?.resetFields()
    
    // 关闭弹窗
    visible.value = false
    
    // 通知父组件需要打开登录弹窗
    emit('to-login')
  } catch (error) {
    ElNotification({
      title: '注册失败',
      message: '注册过程中发生错误，请稍后再试',
      type: 'error'
    })
  }
}

// 转到登录
const goToLogin = () => {
  formRef.value?.resetFields()
  visible.value = false
  emit('to-login')
}
</script>

<style scoped>

/* 对话框内容容器 */
.register-content {
  padding: 20px;
}

/* 注册头部样式 */
.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 0.95rem;
}

/* 表单样式 */
.register-form {
  margin-top: 20px;
}

/* 表单项间距 */
.register-form .el-form-item {
  margin-bottom: 24px;
}

/* 输入框样式 */
.register-form :deep(.el-input) {
  --el-input-bg-color: #ffffff;
  --el-input-border: 1px solid #ffffff;
  --el-input-hover-border: #c0c0c0;
  --el-input-focus-border: #409eff;
  --el-input-border-radius: 8px;
  --el-input-padding: 0 15px;
}

.register-form :deep(.el-input__inner) {
  height: 48px;
  line-height: 48px;
  font-size: 0.95rem;
}

.register-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

/* 注册按钮样式 */
.register-btn {
  width: 100%;
  height: 50px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 1rem;
  background-color: #409eff;
  border: none;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background-color: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(64, 158, 255, 0.3);
}

/* 登录提示样式 */
.login-hint {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 0.95rem;
}

.login-hint .el-link {
  margin-left: 5px;
  font-weight: 500;
}

</style>

