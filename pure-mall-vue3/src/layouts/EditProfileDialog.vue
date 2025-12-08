<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emitClose" title="修改资料" class="edit-profile-dialog">
    <el-form :model="editForm" class="edit-form" label-width="80px" label-position="right">
      <el-form-item label="用户名" class="form-item">
        <el-input v-model="editForm.username" class="input-style" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" class="form-item">
        <el-input v-model="editForm.email" class="input-style" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="手机" class="form-item">
        <el-input v-model="editForm.phone" class="input-style" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别" class="form-item">
        <el-select v-model="editForm.sex" placeholder="请选择" class="input-style">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" class="form-item">
        <el-date-picker v-model="editForm.birthday" value-format="YYYY-MM-DD" type="date" placeholder="选择日期" class="input-style" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="emitClose" class="btn-cancel">取消</el-button>
        <el-button type="primary" @click="saveProfile" class="btn-save">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useUserStore } from '../store/user'
import { storeToRefs } from 'pinia'
const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const { basicInfo } = storeToRefs(userStore)

// 将basicInfo转为表单对象
function infoToForm(infoArr) {
  const obj = {}
  infoArr.forEach(item => {
    if (item.label === '用户名') obj.username = item.value
    if (item.label === '邮箱') obj.email = item.value
    if (item.label === '手机') obj.phone = item.value
    if (item.label === '性别') obj.sex = item.value
    if (item.label === '生日') obj.birthday = item.value
  })
  return obj
}
const editForm = ref(infoToForm(basicInfo.value))

// 弹窗打开时同步数据
watch(() => props.modelValue, (val) => {
  if (val) {
    editForm.value = infoToForm(basicInfo.value)
  }
})

function emitClose() {
  emit('update:modelValue', false)
}

function saveProfile() {
  // 更新Pinia store basicInfo
  const arr = [
    { label: '用户名', value: editForm.value.username },
    { label: '邮箱', value: editForm.value.email },
    { label: '手机', value: editForm.value.phone },
    { label: '性别', value: editForm.value.sex },
    { label: '生日', value: editForm.value.birthday }
  ]
  userStore.basicInfo = arr
  
  // 调用更新用户信息方法
  userStore.updateUserInfo(userStore.username, editForm.value)

  emitClose()
}
</script>

<style scoped>
/* 对话框样式与AddressDialog对齐 */
.edit-profile-dialog .el-dialog {
  width: 500px;
  background: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.edit-profile-dialog .el-dialog__header {
  padding: 20px 20px 15px;
  border-bottom: 1px solid #ebeef5;
}

.edit-profile-dialog .el-dialog__title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

/* 表单样式调整 */
.edit-form {
  padding: 20px;
}

.form-item {
  margin-bottom: 20px;
  border-bottom: none;
  padding-bottom: 0;
}

:deep(.el-form-item__label) {
  text-align: right;
  width: 80px;
}

.input-style {
  background: #fff;
  color: #333;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-shadow: none;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.input-style:focus {
  border-color: #409eff !important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

/* 错误提示样式 */
:deep(.el-form-item__error) {
  position: static;
  margin-top: 2px;
  font-size: 12px;
  color: #f56c6c;
}

/* 按钮样式调整 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
}

.btn-cancel {
  background: #fff;
  color: #606266;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 10px;
}

.btn-save {
  background: #409eff;
  color: #fff;
  border: 1px solid #409eff;
  border-radius: 4px;
}

.btn-cancel:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}

.btn-save:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .edit-profile-dialog .el-dialog {
    width: 90% !important;
    margin: 0 auto;
  }
  
  :deep(.el-form-item__label) {
    text-align: left;
    width: auto;
  }
}
</style>