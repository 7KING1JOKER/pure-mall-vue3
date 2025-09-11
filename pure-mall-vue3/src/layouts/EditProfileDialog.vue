<template>
  <el-dialog title="修改资料">
    <el-form :model="editForm">
      <el-form-item label="用户名">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <!-- 其他字段 -->
    </el-form>
    <template #footer>
      <el-button type="primary" @click="saveProfile">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
const editForm = ref({
  name: '张明',
  email: 'zhangming@example.com'
  // 其他字段
})
</script>