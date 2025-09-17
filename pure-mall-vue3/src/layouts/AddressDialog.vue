<template>
  <el-dialog
    :title="userStore.isEditingAddress ? '编辑地址' : '添加新地址'"
    v-model="dialogVisible"
    width="500px"
  >
    <el-form
      :model="addressForm"
      :rules="rules"
      ref="addressFormRef"
      label-width="80px"
      label-position="right"
    >
      <el-form-item label="收货人" prop="name">
        <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
      </el-form-item>
      
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="addressForm.phone" placeholder="请输入手机号码" />
      </el-form-item>
      
      <el-form-item label="所在地区" required>
        <div class="region-selects">
          <el-form-item prop="province" class="region-item">
            <el-select v-model="addressForm.province" placeholder="省份">
              <el-option label="北京市" value="北京市" />
              <el-option label="上海市" value="上海市" />
              <el-option label="广东省" value="广东省" />
              <el-option label="江苏省" value="江苏省" />
              <el-option label="浙江省" value="浙江省" />
            </el-select>
          </el-form-item>
          
          <el-form-item prop="city" class="region-item">
            <el-select v-model="addressForm.city" placeholder="城市">
              <el-option label="北京市" value="北京市" />
              <el-option label="上海市" value="上海市" />
              <el-option label="广州市" value="广州市" />
              <el-option label="深圳市" value="深圳市" />
              <el-option label="杭州市" value="杭州市" />
            </el-select>
          </el-form-item>
          
          <el-form-item prop="district" class="region-item">
            <el-select v-model="addressForm.district" placeholder="区/县">
              <el-option label="朝阳区" value="朝阳区" />
              <el-option label="海淀区" value="海淀区" />
              <el-option label="东城区" value="东城区" />
              <el-option label="西城区" value="西城区" />
              <el-option label="丰台区" value="丰台区" />
            </el-select>
          </el-form-item>
        </div>
      </el-form-item>
      
      <el-form-item label="详细地址" prop="street">
        <el-input
          v-model="addressForm.street"
          type="textarea"
          :rows="2"
          placeholder="请输入详细地址信息，如街道、门牌号等"
        />
      </el-form-item>
      
      <el-form-item label="邮政编码" prop="zip">
        <el-input v-model="addressForm.zip" placeholder="请输入邮政编码" />
      </el-form-item>
      
      <el-form-item>
        <el-checkbox v-model="addressForm.isDefault">设为默认收货地址</el-checkbox>
      </el-form-item>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const userStore = useUserStore()

// 表单引用
const addressFormRef = ref<FormInstance>()

// 对话框可见性
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 表单数据
const addressForm = reactive({
  id: '',
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  street: '',
  zip: '',
  isDefault: false
})

// 表单验证规则
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  province: [
    { required: true, message: '请选择省份', trigger: 'change' }
  ],
  city: [
    { required: true, message: '请选择城市', trigger: 'change' }
  ],
  district: [
    { required: true, message: '请选择区/县', trigger: 'change' }
  ],
  street: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 100, message: '长度在 5 到 100 个字符', trigger: 'blur' }
  ],
  zip: [
    { required: true, message: '请输入邮政编码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入正确的邮政编码', trigger: 'blur' }
  ]
})

// 监听当前地址变化，更新表单数据
watch(() => userStore.currentAddress, (newAddress) => {
  if (newAddress) {
    // 复制地址数据到表单
    Object.assign(addressForm, newAddress)
  }
}, { immediate: true })

// 保存地址
const saveAddress = async () => {
  if (!addressFormRef.value) return
  
  await addressFormRef.value.validate((valid, fields) => {
    if (valid) {
      userStore.saveAddress({
        ...addressForm,
        id: addressForm.id || undefined // 如果是新地址，id为undefined
      })
    } else {
      console.log('表单验证失败', fields)
      ElMessage.error('请完善表单信息')
    }
  })
}
</script>

<style scoped>
.region-selects {
  display: flex;
  gap: 10px;
}

.region-item {
  margin-bottom: 0;
  flex: 1;
}

:deep(.el-form-item__error) {
  position: static;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .region-selects {
    flex-direction: column;
    gap: 0;
  }
  
  .region-item {
    margin-bottom: 18px;
  }
}
</style>