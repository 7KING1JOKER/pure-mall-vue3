<template>
  <div class="category-nav-dialog-container">
    <el-dialog
      v-model="dialogVisible"
      title="商品分类" transition="fade"
      width="100%" top="60px"
      :before-close="handleClose"
      modal-class="custom-category-mask"
      custom-class="category-nav-dialog"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div class="category-tags-container">
        <!-- 遍历所有分类 -->
        <template v-for="category in categories" :key="category.id">
          <template v-if="category.children && category.children.length > 0">
            <!-- 有子分类时显示子分类 -->
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
          <template v-else>
            <!-- 没有子分类时直接显示当前分类 -->
            <el-tag
              :type="currentCategory.id === category.id ? 'primary' : 'default'"
              @click="selectCategory(category)"
              class="sub-category-tag"
            >
              {{ category.label }}
            </el-tag>
          </template>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref } from 'vue';
import { useCategoryStore } from '../store/category';
import { storeToRefs } from 'pinia';
import type { CategoryNode } from '../api/interfaces';

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
  max-height: 400px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  text-align: left;
}

.sub-category-tag {
  display: inline-block;
  width: fit-content;
  white-space: nowrap;
  color: #0000007e;
  text-align: left;
  padding-left: 20px;
  transition: all 0.3s ease;
}

/* 选中状态的样式 */
.sub-category-tag.el-tag--primary {
  color: #000;
  font-weight: 400;
  transition: all 0.3s ease;
}

/* 鼠标悬停效果 */
.sub-category-tag:hover {
  transform: translateY(-2px);
}


</style>