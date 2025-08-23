<template>
  <div class="login-dialog">
    <!-- 登录弹窗 -->
    <el-dialog
      v-model="visible"
      width="30%"
      modal-class="custom-register-mask"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="login-content">
        <div class="login-header">
          <h2>pure-mall</h2>
        </div>
        
        <el-form ref="formRef" :model="formData" :rules="rules" class="login-form">
          <el-form-item prop="username">
            <div class="input-container">
              <el-input 
                v-model="formData.username" 
                placeholder="用户名"
                size="large"
                clearable
                @input="updateUnderline('username')"
                @focus="activeInput = 'username'"
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
          
          <el-form-item prop="password">
            <div class="input-container">
              <el-input 
                v-model="formData.password" 
                type="password" 
                placeholder="密码"
                size="large"
                show-password
                @input="updateUnderline('password')"
                @focus="activeInput = 'password'"
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
          
          <div class="form-footer">
            <el-button 
              class="login-btn" 
              type="primary" 
              size="large"
              @click="submit"
            >
              登录
            </el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { User,  Lock } from '@element-plus/icons-vue'

const emit = defineEmits(['success', 'cancel'])

const visible = defineModel<boolean>('visible', { required: true })

// 表单数据
const formData = reactive({
  username: '',
  password: ''
})

// 表单引用
const formRef = ref<FormInstance | null>(null)

// 验证规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在3到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少8位', trigger: 'blur' }
  ]
})

// 动态下划线相关状态
const activeInput = ref('')
const usernameWidth = ref(0)
const passwordWidth = ref(0)

// 创建测量元素
const measureSpan = document.createElement('span')
measureSpan.style.visibility = 'hidden'
measureSpan.style.position = 'absolute'
measureSpan.style.whiteSpace = 'pre'
measureSpan.style.font = 'inherit'
document.body.appendChild(measureSpan)

// 更新下划线宽度
const updateUnderline = (field: keyof typeof formData) => {
  nextTick(() => {
    const text = formData[field]
    if (!text) {
      // 文本为空时宽度为0
      if (field === 'username') usernameWidth.value = 0
      if (field === 'password') passwordWidth.value = 0
      return
    }
    
    // 设置测量元素的字体样式
    const input = document.querySelector(`.input-container:nth-child(${
      field === 'username' ? 1 : 
      2
    }) .el-input__inner`)
    
    if (input) {
      const computedStyle = window.getComputedStyle(input)
      measureSpan.style.font = computedStyle.font
    }
    
    // 测量文本宽度
    measureSpan.textContent = text
    const width = measureSpan.offsetWidth
    
    // 更新对应字段的下划线宽度
    if (field === 'username') usernameWidth.value = width
    if (field === 'password') passwordWidth.value = width
  })
}

// 提交表单
const submit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  
  // 模拟API调用
  try {
    // 这里应该是实际的登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElNotification({
      title: '登录成功',
      message: '欢迎回来',
      type: 'success'
    })
    
    // 通知父组件登录成功
    emit('success', {
      username: formData.username
    })
    
    // 清空表单
    formRef.value?.resetFields()
    
    // 关闭弹窗
    visible.value = false
  } catch (error) {
    ElNotification({
      title: '登录失败',
      message: '用户名或密码错误，请重试',
      type: 'error'
    })
  }
}

onMounted(() => {
  updateUnderline('username')
  updateUnderline('password')
})

</script>

<style scoped>

/* 对话框内容容器 */
.login-content {
  padding: 20px;
}

/* 注册头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 表单样式 */
.login-form {
  margin-top: 20px;
}

/* 表单项间距 */
.login-form .el-form-item {
  margin-bottom: 24px;
}

/* 输入框容器 */
.input-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

/* 输入框样式 */
.login-form :deep(.el-input) {
  --el-input-bg-color: transparent;
  --el-input-border-radius: 8px;
  --el-input-padding: 0 15px;
}

.login-form :deep(.el-input__wrapper) {
  box-shadow: none !important; /* 去除默认阴影(边框) */
}

.login-form :deep(.el-input__inner) {
  height: 48px;
  line-height: 48px;
  font-size: 0.95rem;
  text-align: left;
}

.login-form :deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  padding-left: 10px;
  color: #999;
  transition: color 0.3s;
}

.login-form :deep(.el-input.is-focus .el-input__prefix) {
  color: #409eff;
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
.login-btn {
  width: 100%;
  font-weight: 600;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 1rem;
  background-color: transparent;
  color: #ffffffb7;
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
}
</style>

