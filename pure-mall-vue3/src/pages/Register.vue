<template>
  <div class="register-container">
    <div class="register-card">
      <div class="register-header">
        <h2>创建新账户</h2>
        <p>开启您的购物之旅</p>
      </div>
      
      <el-form 
        :model="registerForm" 
        :rules="rules" 
        ref="registerFormRef" 
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名"
            clearable
          >
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="电子邮箱" prop="email">
          <el-input 
            v-model="registerForm.email" 
            placeholder="请输入邮箱"
            clearable
          >
            <template #prefix>
              <el-icon><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="手机号码" prop="phone">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入手机号"
            clearable
          >
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="registerForm.password" 
            placeholder="8-20位字母和数字组合"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
          <div class="password-strength">
            <div :class="['strength-bar', getPasswordStrengthClass(0)]"></div>
            <div :class="['strength-bar', getPasswordStrengthClass(1)]"></div>
            <div :class="['strength-bar', getPasswordStrengthClass(2)]"></div>
            <div :class="['strength-bar', getPasswordStrengthClass(3)]"></div>
            <div class="strength-text">{{ passwordStrengthText }}</div>
          </div>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="registerForm.confirmPassword" 
            placeholder="请再次输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="agreement">
          <el-checkbox v-model="registerForm.agreement">
            我已阅读并同意<el-link type="primary" href="#">《用户协议》</el-link>
            和<el-link type="primary" href="#">《隐私政策》</el-link>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item prop="verification">
          <div class="verification-container">
            <el-input 
              v-model="registerForm.verification" 
              placeholder="请输入验证码"
              clearable
              style="flex: 1;"
            >
              <template #prefix>
                <el-icon><Key /></el-icon>
              </template>
            </el-input>
            <el-button 
              :disabled="countdown > 0" 
              @click="sendVerification" 
              class="verification-btn"
            >
              {{ countdown > 0 ? `重新发送(${countdown}s)` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submitRegister" 
            class="register-btn"
          >
            立即注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-redirect">
        已有账号？<el-link type="primary" @click="goToLogin">立即登录</el-link>
      </div>
    </div>
    
    <div class="register-footer">
      <p>© 2023 购物网站 版权所有</p>
      <p><el-link type="info">隐私政策</el-link> | <el-link type="info">用户协议</el-link> | <el-link type="info">帮助中心</el-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, Message, Iphone, Lock, Key 
} from '@element-plus/icons-vue'

const router = useRouter()

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreement: false,
  verification: ''
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在 3 到 16 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱', trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 20, message: '密码长度在 8 到 20 个字符', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ],
  verification: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
})

// 密码强度检测
const passwordStrength = computed(() => {
  if (registerForm.password.length === 0) return 0
  if (registerForm.password.length < 6) return 1
  
  let strength = 0
  if (/[a-z]/.test(registerForm.password)) strength++
  if (/[A-Z]/.test(registerForm.password)) strength++
  if (/\d/.test(registerForm.password)) strength++
  if (/[^\w]/.test(registerForm.password)) strength++
  
  return Math.min(4, strength + 1)
})

const passwordStrengthText = computed(() => {
  const texts = ['', '非常弱', '弱', '中等', '强']
  return texts[passwordStrength.value]
})

const getPasswordStrengthClass = (level) => {
  if (level < passwordStrength.value) {
    return `strength-${passwordStrength.value}`
  }
  return ''
}

// 验证码倒计时
const countdown = ref(0)
let timer = null

// 自定义验证方法
function validatePassword(rule, value, callback) {
  if (value.length < 8) {
    callback(new Error('密码长度至少8位'))
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
    callback(new Error('必须包含字母和数字'))
  } else {
    callback()
  }
}

function validateConfirmPassword(rule, value, callback) {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

function validateAgreement(rule, value, callback) {
  if (!value) {
    callback(new Error('请同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 发送验证码
function sendVerification() {
  // 简单模拟发送验证码逻辑
  countdown.value = 60
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
  
  // 模拟API请求
  setTimeout(() => {
    ElMessage({
      message: '验证码已发送至您的手机',
      type: 'success',
      duration: 2000
    })
  }, 800)
}

// 提交注册
function submitRegister() {
  // 实际项目中这里是API请求
  ElMessage({
    message: '注册成功！欢迎使用购物网站',
    type: 'success',
    duration: 2000
  })
  
  // 跳转到登录页
  setTimeout(() => {
    router.push('/login')
  }, 1500)
}

// 前往登录页
function goToLogin() {
  router.push('/login')
}

// 组件卸载时清除计时器
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background-color: white;
  border-radius: 10px;
  padding: 40px 30px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  font-size: 26px;
  color: #303133;
  margin-bottom: 10px;
}

.register-header p {
  color: #606266;
  font-size: 16px;
}

.el-form {
  margin-top: 20px;
}

.password-strength {
  display: flex;
  margin-top: 8px;
  align-items: center;
}

.strength-bar {
  height: 6px;
  flex: 1;
  margin-right: 5px;
  background-color: #e4e7ed;
  border-radius: 3px;
  transition: all 0.3s;
}

.strength-bar.strength-1 {
  background-color: #ff4949;
}

.strength-bar.strength-2 {
  background-color: #ff9900;
}

.strength-bar.strength-3 {
  background-color: #13ce66;
}

.strength-bar.strength-4 {
  background-color: #1890ff;
}

.strength-text {
  font-size: 12px;
  color: #909399;
  margin-left: 10px;
  min-width: 50px;
}

.verification-container {
  display: flex;
  gap: 10px;
}

.verification-btn {
  width: 120px;
}

.register-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  margin-top: 10px;
}

.login-redirect {
  text-align: center;
  margin-top: 20px;
  color: #606266;
  font-size: 14px;
}

.login-redirect .el-link {
  margin-left: 5px;
}

.register-footer {
  margin-top: 30px;
  text-align: center;
  color: #909399;
  font-size: 12px;
}

.register-footer p {
  margin: 5px 0;
}

.register-footer .el-link {
  margin: 0 5px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .register-card {
    padding: 30px 20px;
  }
  
  .verification-container {
    flex-direction: column;
  }
  
  .verification-btn {
    width: 100%;
  }
}
</style>