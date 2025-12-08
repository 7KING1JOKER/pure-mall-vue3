<template>
  <div 
    class="product-card"
    @click="goToProductDetail"
  >
    <el-image 
      :src="product.images[0] || ''"
      fit="cover"
      class="product-image"
    />
    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { Product } from '@/api/interfaces';

const props = defineProps<{
  product: Product;
}>();

const router = useRouter();

// 跳转到商品详情页
const goToProductDetail = () => {
  router.push(`/product/${props.product.id}`);
};

</script>

<style scoped>
.product-card {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 93%;
  background-color: #f5f7fa;
}

.product-info {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.product-name {
  font-size: 0.7rem;
  font-weight: 350;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 1;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  color: #000000;
  flex: 1;
  margin-right: 10px;
}

.product-price {
  font-size: 0.7rem;
  font-weight: 350;
  color: #000000;
}

/* 移动端响应式设计 */
@media (max-width: 992px) {
  .product-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .product-name {
    line-clamp: 2;
    -webkit-line-clamp: 2;
  }
}
</style>