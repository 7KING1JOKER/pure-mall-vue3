<template>
  <el-dialog :model-value="modelValue" @update:modelValue="emitClose" title="修改资料" class="edit-profile-dialog">
    <el-form :model="editForm" class="edit-form">
      <el-form-item label="用户名" class="form-item">
        <el-input v-model="editForm.username" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" class="form-item">
        <el-input v-model="editForm.email" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="手机" class="form-item">
        <el-input v-model="editForm.phone" class="input-style"></el-input>
      </el-form-item>
      <el-form-item label="性别" class="form-item">
        <el-select v-model="editForm.gender" placeholder="请选择" class="input-style">
          <el-option label="男" value="男" />
          <el-option label="女" value="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" class="form-item">
        <el-date-picker v-model="editForm.birthday" type="date" placeholder="选择日期" class="input-style" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emitClose" class="btn-cancel">取消</el-button>
      <el-button type="primary" @click="saveProfile" class="btn-save">保存</el-button>
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
    if (item.label === '性别') obj.gender = item.value
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
    { label: '性别', value: editForm.value.gender },
    { label: '生日', value: editForm.value.birthday }
  ]
  userStore.basicInfo = arr
  emitClose()
}
</script>

<style scoped>
.edit-profile-dialog .el-dialog {
  background: rgba(255,255,255,0.95);
  color: #333;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  border: 1px solid #333;
}
.edit-profile-dialog .el-dialog__header {
  border-bottom: 1px solid #333;
  color: #000;
  font-weight: bold;
  font-size: 20px;
  letter-spacing: 2px;
}
.edit-form {
  padding: 10px 0 0 0;
}
.form-item {
  margin-bottom: 18px;
  border-bottom: 1px solid #333;
  padding-bottom: 8px;
}
.input-style {
  background: #fff;
  color: #333;
  border: none;
  border-bottom: 1px solid #333 !important;
  border-radius: 0;
  box-shadow: none;
}
.input-style:focus {
  border-bottom: 1.5px solid #000 !important;
}
.btn-cancel {
  background: #fff;
  color: #333;
  border: 1px solid #333;
  border-radius: 4px;
}
.btn-save {
  background: #333;
  color: #fff;
  border: 1px solid #333;
  border-radius: 4px;
}
.btn-cancel:hover, .btn-save:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12);
}

</style>