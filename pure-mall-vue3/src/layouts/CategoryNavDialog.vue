<template>
  <el-dialog
    v-model="dialogVisible"
    title="商品分类"
    width="90%"
    :before-close="handleClose"
    custom-class="category-nav-dialog"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="category-tags-container">
      <!-- 全部分类 -->
      <el-tag
        :type="currentCategory.id === '' ? 'primary' : 'default'"
        @click="selectCategory({ id: '', label: '全部商品', icon: 'Menu' })"
        class="category-tag"
      >
        全部商品
      </el-tag>
      
      <!-- 遍历所有分类和子分类 -->
      <template v-for="category in categories" :key="category.id">
        <el-tag
          :type="currentCategory.id === category.id ? 'primary' : 'default'"
          @click="selectCategory(category)"
          class="category-tag"
          v-if="category.children && category.children.length > 0"
        >
          {{ category.label }}
        </el-tag>
        
        <template v-if="category.children && category.children.length > 0">
          <el-tag
            v-for="subCategory in category.children"
            :key="subCategory.id"
            :type="currentCategory.id === subCategory.id ? 'primary' : 'default'"
            @click="selectCategory(subCategory)"
            class="sub-category-tag"
          >
            {{ subCategory.label }}
          </el-tag>
        </template>
      </template>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useCategoryStore } from '../store/category';
import { storeToRefs } from 'pinia';
import type { CategoryNode } from '../store/category';

// Props
const props = defineProps<{
  modelValue: boolean;
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

// 使用category store
const categoryStore = useCategoryStore();

// 从store解构获取数据和方法
const { categories, currentCategory } = storeToRefs(categoryStore);
const { handleNodeClick } = categoryStore;

// 跟踪鼠标是否在弹窗内
const isMouseInside = ref(false);

// 计算属性 - 控制对话框显示/隐藏
const dialogVisible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

// 当鼠标进入弹窗时标记
const handleMouseEnter = () => {
  isMouseInside.value = true;
};

// 当鼠标离开弹窗时标记
const handleMouseLeave = () => {
  isMouseInside.value = false;
  // 稍微延迟后检查状态，如果确实离开了则关闭弹窗
  setTimeout(() => {
    if (!isMouseInside.value) {
      dialogVisible.value = false;
    }
  }, 100);
};

// 选择分类
const selectCategory = (category: CategoryNode) => {
  // 调用store的方法来选择分类并加载商品
  handleNodeClick(category);
  // 关闭对话框
  dialogVisible.value = false;
};

// 处理关闭事件
const handleClose = () => {
  dialogVisible.value = false;
};

// 监听外部控制的显示状态
watch(() => props.modelValue, (newValue) => {
  if (newValue !== dialogVisible.value) {
    dialogVisible.value = newValue;
  }
});
</script>

<style scoped>
.category-nav-dialog {
  .el-dialog__body {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
}

.category-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f0f0f0;
  border-color: #dcdfe6;
}

.category-tag:hover {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

.sub-category-tag {
  font-size: 13px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fafafa;
  border-color: #dcdfe6;
  margin-left: 15px;
}

.sub-category-tag:hover {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

/* 自定义滚动条样式 */
.category-tags-container::-webkit-scrollbar {
  width: 6px;
}

.category-tags-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.category-tags-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.category-tags-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>