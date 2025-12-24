<template>
    <div class="product-size-dialog">
        <!-- 尺码选择弹窗 -->
        <el-dialog
            title="尺码选择"
            v-model="productStore.productSizeDialogVisible"
            top="0" width="25%"
            transition="fade" :open-delay="0.3"
        >
        
        <!-- 尺码选择方块 -->
        <div class="size-squres">
            <div v-for="productSize in productStore.productSizeList" class="size-square" :class="{ 'selected': isSelected(productSize) }" @click="selectSize(productSize)">
                <h1> {{ productSize.detail }} </h1>
                <h1>({{ productSize.size }})</h1>
            </div>
        </div>

        <!-- 尺码选择提示 -->
        <div class="size-guider">
            <div class="size-guider-header" @click="toggleGuider">
                <span class="size-guider-title">尺码规格说明</span>
                <span class="size-guider-icon">{{ isGuiderExpanded ? '-' : '+' }}</span>
            </div>
            <el-collapse-transition>
                <div v-if="isGuiderExpanded" class="size-guider-content">
                    <img src="../assets/product-size-guider.png" alt="尺码说明图" class="size-guider-image">
                </div>
            </el-collapse-transition>
        </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/product';

// 使用store
const productStore = useProductStore();

// 从store中解构响应式状态
const { isGuiderExpanded } = storeToRefs(productStore);

// 方法直接从productStore调用，不需要使用storeToRefs
const toggleGuider = () => {
  productStore.toggleGuider();
};

// 判断当前尺码是否被选中
const isSelected = (productSize) => {
  // 拼接当前尺码信息字符串
  const sizeInfo = `${productSize.detail} (${productSize.size})`;
  // 与store中保存的选中尺码信息进行比较
  return productStore.selectedSize === sizeInfo;
};

// 选中尺码处理函数
const selectSize = (productSize) => {
  // 拼接尺码信息字符串
  const sizeInfo = `${productSize.detail} (${productSize.size})`;
  // 保存到store中
  productStore.setSelectedSize(sizeInfo);
};
</script>

<style scoped>

.size-squres {
  margin-top: 20px;
  padding-top: 8px;
  padding-left: 20px;
  padding-right: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.size-squres .size-square {
  border: 1px solid rgba(0, 0, 0, 0.15);
  height: 80px;
  width: 80px;
  padding: 6px;
  text-align: left;
  transition: border-color 0.2s ease, transform 0.2s ease;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

.size-square:hover {
  border: 1px solid #000;
  transform: translateY(-2px);
}

.size-square.selected {
  border: 1px solid #000;
  background-color: rgba(0, 0, 0, 0.05);
}

.size-square h1 {
  color: #000;
  font-size: 12px;
  font-weight: 600;
}

/* 尺码说明样式 */
.size-guider {
  margin-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 8px;
  padding-left: 20px;
  padding-right: 20px;
}

.size-guider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding-bottom: 10px;
}

.size-guider-title {
  font-size: 12px;
  color: #000;
}

.size-guider-icon {
  font-size: 14px;
  color: #000;
  transition: transform 0.2s ease;
  transform: translateZ(0);
}

.size-guider-content {
  overflow: hidden;
}

.size-guider-image {
  width: 100%;
  height: auto;
  display: block;
}

/* 过渡动画 */
.slide-enter-active, .slide-leave-active {
  transition: max-height 0.4s ease, opacity 0.3s ease;
  max-height: 500px;
  overflow: hidden;
  transform: translateZ(0);
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateZ(0);
}

</style>