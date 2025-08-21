<template>
  <el-dialog
    v-model="visible"
    title="登录账户"
    width="30%"
    center
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form ref="formRef" :model="formData" :rules="rules">
      <el-form-item prop="username">
        <el-input v-model="formData.username" placeholder="用户名" prefix-icon="User" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input 
          v-model="formData.password" 
          type="password" 
          placeholder="密码" 
          prefix-icon="Lock" 
          show-password 
        />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">登录</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

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
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})

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

// 取消操作
const cancel = () => {
  formRef.value?.resetFields()
  visible.value = false
  emit('cancel')
}
</script>

<style scoped>
/* 可以添加组件特定的样式 */
</style>