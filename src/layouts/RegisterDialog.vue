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
          <!-- 用户名输入框 -->
          <el-form-item prop="username" class="prop-username">
            <div class="input-container">
              <el-input 
                v-model="formData.username" 
                placeholder="用户名"
                size="large"
                clearable
                @input="updateUnderline('username')"
                @focus="activeInput = 'username'"
                @blur="(e: Event) => updateUnderline('username', e)"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'username' }">
                <div class="dynamic-underline" :style="{ width: `${usernameWidth}px` }"></div>
              </div>
            </div>
          </el-form-item>
          
          <!-- 邮箱输入框 -->
          <el-form-item prop="email" class="prop-email">
            <div class="input-container">
              <el-input 
                v-model="formData.email" 
                placeholder="邮箱地址"
                size="large"
                clearable
                @input="updateUnderline('email')"
                @focus="activeInput = 'email'"
                @blur="(e: Event) => updateUnderline('email', e)"
              >
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'email' }">
                <div class="dynamic-underline" :style="{ width: `${emailWidth}px` }"></div>
              </div>
            </div>
          </el-form-item>
          
          <!-- 密码输入框 -->
          <el-form-item prop="password" class="prop-password">
            <div class="input-container">
              <el-input 
                v-model="formData.password" 
                type="password" 
                placeholder="设置密码"
                size="large"
                show-password
                @input="updateUnderline('password')"
                @focus="activeInput = 'password'"
                @blur="(e: Event) => updateUnderline('password', e)"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'password' }">
                <div class="dynamic-underline" :style="{ width: `${passwordWidth}px` }"></div>
              </div>
            </div>
          </el-form-item>
          
          <!-- 确认密码输入框 -->
          <el-form-item prop="confirmPassword" class="prop-confirmPassword">
            <div class="input-container">
              <el-input 
                v-model="formData.confirmPassword" 
                type="password" 
                placeholder="确认密码"
                size="large"
                show-password
                @input="updateUnderline('confirmPassword')"
                @focus="activeInput = 'confirmPassword'"
                @blur="(e: Event) => updateUnderline('confirmPassword', e)"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'confirmPassword' }">
                <div class="dynamic-underline" :style="{ width: `${confirmPasswordWidth}px` }"></div>
              </div>
            </div>
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
import { ref, reactive, onMounted, nextTick } from 'vue'
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
      validator: (_rule, value, callback) => {
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
      validator: (_rule, value, callback) => {
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

// 动态下划线相关状态
const activeInput = ref('')
const usernameWidth = ref(0)
const emailWidth = ref(0)
const passwordWidth = ref(0)
const confirmPasswordWidth = ref(0)

// 创建测量元素
const measureSpan = document.createElement('span')
measureSpan.style.visibility = 'hidden'
measureSpan.style.position = 'absolute'
measureSpan.style.whiteSpace = 'pre'
measureSpan.style.font = 'inherit'
document.body.appendChild(measureSpan)

// 更新下划线宽度
const updateUnderline = (field: keyof typeof formData, event?: Event) => {
  nextTick(() => {
    const text = formData[field]
    const isBlurEvent = event?.type === 'blur'
    
    // 获取对应的input元素
    const inputContainer = document.querySelector(`.el-form-item.prop-${field} .input-container`) as HTMLElement
    const input = inputContainer?.querySelector('.el-input__inner') as HTMLElement
    
    // 如果输入框失去焦点且内容不为空，设置宽度为100%
    if (isBlurEvent && text && input) {
      const inputWidth = input.offsetWidth
      if (field === 'username') usernameWidth.value = inputWidth
      if (field === 'email') emailWidth.value = inputWidth
      // 密码框宽度稍微大一点: 额外的切换按钮 or 密码输入框的DOM结构不同
      if (field === 'password') passwordWidth.value = inputWidth + 20
      if (field === 'confirmPassword') confirmPasswordWidth.value = inputWidth + 20
      return
    }
    
    // 文本为空时宽度为0
    if (!text) {
      if (field === 'username') usernameWidth.value = 0
      if (field === 'email') emailWidth.value = 0
      if (field === 'password') passwordWidth.value = 0
      if (field === 'confirmPassword') confirmPasswordWidth.value = 0
      return
    }
    
    // 设置测量元素的字体样式
    if (input) {
      const computedStyle = window.getComputedStyle(input)
      measureSpan.style.font = computedStyle.font
    }
    
    // 测量文本宽度
    measureSpan.textContent = text
    const width = measureSpan.offsetWidth
    
    // 更新对应字段的下划线宽度
    if (field === 'username') usernameWidth.value = width
    if (field === 'email') emailWidth.value = width
    if (field === 'password') passwordWidth.value = width
    if (field === 'confirmPassword') confirmPasswordWidth.value = width
  })
}

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

// 组件卸载时移除测量元素
onMounted(() => {
  updateUnderline('username')
  updateUnderline('email')
  updateUnderline('password')
  updateUnderline('confirmPassword')
})
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

/* 表单样式 */
.register-form {
  margin-top: 20px;
}

/* 表单项间距 */
.register-form .el-form-item {
  margin-bottom: 24px;
}

/* 输入框容器 */
.input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.input-container .el-icon {
  color: #ffffff85;
}

/* 输入框样式 */
.register-form :deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-radius: 8px;
  --el-input-padding: 0 15px;
}

.register-form :deep(.el-input__wrapper) {
  box-shadow: none !important; /* 去除默认阴影(边框) */
}

.register-form :deep(.el-input__inner) {
  height: 48px;
  line-height: 48px;
  font-size: 0.95rem;
  text-align: left;
}

.register-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  padding-left: 10px;
  color: #999;
  transition: color 0.3s;
}

/* 下划线容器 */
.input-underline {
  position: absolute;
  bottom: 0;
  left: 52px;
  width: 80%;
  height: 2px;
  background-color: #fff;
  overflow: hidden;
  border-radius: 1px;
}

/* 动态下划线 */
.dynamic-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: #333;
  transition: width 0.3s ease;
  border-radius: 2px;
}


/* 注册按钮样式 */
.register-btn {
  width: 100%;
  height: 50px;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 1rem;
  background-color: transparent;
  color: #ffffffb7;
  border: none;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}

/* 登录提示样式 */
.login-hint {
  text-align: center;
  margin-top: 20px;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  font-size: 0.95rem;
}

.login-hint .el-link {
  text-shadow: none;
  margin-left: 5px;
  font-weight: 500;
  color: #ffffffb7;
  text-decoration-color: #333 !important;
}

</style>