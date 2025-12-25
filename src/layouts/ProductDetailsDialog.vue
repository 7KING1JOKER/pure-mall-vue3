<template>
    <div class="product-details-dialog">
        <!-- 商品详情弹窗 -->
        <el-dialog
            :title="product?.name || '商品详情'"
            v-model="productStore.productDetailsDialogVisible"
            top="0" width="25%"
            transition="fade" :open-delay="0.3"
        >

        <!-- 商品描述 -->
        <div class="product-description">
            <div class="size-guider-header" @click="toggleGuiderDesc">
                <span class="size-guider-title">描述</span>
                <span class="size-guider-icon">{{ isDescExpanded ? '-' : '+' }}</span>
            </div>
            <el-collapse-transition>
                <div v-if="isDescExpanded" class="size-guider-content">
                    <div v-html="formatText(product?.brief || '暂无描述')" class="product-font-content"></div>
                </div>
            </el-collapse-transition>
        </div>

        <div class="product-details">
             <div class="size-guider-header" @click="toggleGuiderDetails">
                <span class="size-guider-title">细节</span>
                <span class="size-guider-icon">{{ isDetailsExpanded ? '-' : '+' }}</span>
            </div>
            <el-collapse-transition>
                <div v-if="isDetailsExpanded" class="size-guider-content">
                    <div v-html="(product?.detail || '暂无描述')" class="product-font-content"></div>
                </div>
            </el-collapse-transition>
        </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useProductStore } from '../store/product';

// 使用store
const productStore = useProductStore();

const { 
    productDetailsDialogVisible,
    product
} = storeToRefs(productStore);

// 商品展开状态
const isDetailsExpanded = ref(false);
const isDescExpanded = ref(false);

// 切换描述展开状态
const toggleGuiderDesc = () => {
    isDescExpanded.value = !isDescExpanded.value;
};

// 切换细节展开状态
const toggleGuiderDetails = () => {
    isDetailsExpanded.value = !isDetailsExpanded.value;
};

// 格式化文本，将换行符转换为HTML换行标签
const formatText = (text) => {
    if (!text) return '';
    // 替换换行符为<br>标签
    let formattedText = text.replace(/\n/g, '<br>');
    // 保留列表项的格式
    formattedText = formattedText.replace(/(<br>)-/g, '<br>-');
    return formattedText;
};

</script>

<style scoped>

.product-description {
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
  transition: transform 0.3s ease;
}

.size-guider-content {
  padding-top: 10px;
  overflow: hidden;
}

.size-guider-content .product-font-content {
  font-size: 12px;
  color: #000;
}

.product-details {
  margin-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  padding-top: 8px;
  padding-left: 20px;
  padding-right: 20px;
}
</style>