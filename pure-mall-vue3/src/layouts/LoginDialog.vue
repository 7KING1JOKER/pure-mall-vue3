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
          <el-form-item prop="loginUserName" class="prop-loginUserName">
            <div class="input-container">
              <el-input 
                v-model="formData.loginUserName" 
                placeholder="用户名"
                size="large"
                clearable
                @input="updateUnderline('loginUserName')"
                @focus="activeInput = 'loginUserName'"
                @blur="(e: Event) => updateUnderline('loginUserName', e)"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'loginUserName' }">
                <div class="dynamic-underline" :style="{ width: `${loginUserNameWidth}px` }"></div>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item prop="loginPassWord" class="prop-loginPassWord">
            <div class="input-container">
              <el-input 
                v-model="formData.loginPassWord" 
                type="loginPassWord" 
                placeholder="密码"
                size="large"
                show-loginPassWord
                @input="updateUnderline('loginPassWord')"
                @focus="activeInput = 'loginPassWord'"
                @blur="(e: Event) => updateUnderline('loginPassWord', e)"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
              <div class="input-underline" :class="{ active: activeInput === 'loginPassWord' }">
                <div class="dynamic-underline" :style="{ width: `${loginPassWordWidth}px` }"></div>
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
  loginUserName: '',
  loginPassWord: ''
})

// 表单引用
const formRef = ref<FormInstance | null>(null)

// 验证规则
const rules = reactive<FormRules>({
  loginUserName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '用户名长度在3到16个字符', trigger: 'blur' }
  ],
  loginPassWord: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, message: '密码长度至少8位', trigger: 'blur' }
  ]
})

// 动态下划线相关状态
const activeInput = ref('')
const loginUserNameWidth = ref(0)
const loginPassWordWidth = ref(0)

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
      if (field === 'loginUserName') loginUserNameWidth.value = inputWidth
      // 密码框宽度稍微大一点: 额外的切换按钮 or 密码输入框的DOM结构不同
      if (field === 'loginPassWord') loginPassWordWidth.value = inputWidth + 20
      return
    }
    
    // 文本为空时宽度为0
    if (!text) {
      if (field === 'loginUserName') loginUserNameWidth.value = 0
      if (field === 'loginPassWord') loginPassWordWidth.value = 0
      return
    }
    
    
    if (input) {
      const computedStyle = window.getComputedStyle(input)
      measureSpan.style.font = computedStyle.font
    }
    
    // 测量文本宽度
    measureSpan.textContent = text
    const width = measureSpan.offsetWidth
    
    // 更新对应字段的下划线宽度
    if (field === 'loginUserName') loginUserNameWidth.value = width
    if (field === 'loginPassWord') loginPassWordWidth.value = width
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
      loginUserName: formData.loginUserName
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
  updateUnderline('loginUserName')
  updateUnderline('loginPassWord')
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

.input-container .el-icon {
  color: #ffffff85;
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

/* 错误提示样式 */
.login-form :deep(.el-form-item__error) {
  color: #333; /* 错误提示文字颜色变为黑色 */
}
</style>

