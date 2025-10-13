<template>
    <div class="cart-header">
      <el-steps 
        :active="activeStep"
        class="cart-steps"
        direction="vertical"
      >
        <el-step title="购物车" :icon="ShoppingCart" />
        <el-step title="确认订单" :icon="DocumentChecked"/>
        <el-step title="付款" :icon="Money"/>
        <el-step title="完成" :icon="CircleCheck"/>
      </el-steps>
    </div>
</template>

<script setup lang="ts">
import { ShoppingCart, CircleCheck, Money, DocumentChecked } from '@element-plus/icons-vue';
import { useCartStore } from '../store/cart';

// 使用购物车store
const cartStore = useCartStore();

// 从store解构获取数据和方法
const { activeStep } = cartStore;
</script>

<style scoped>
/* 购物车头部 */
.cart-header {
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.cart-steps {
  height: 95%;
}
.cart-steps :deep(.el-step__title) {
  color: #000;
}

.cart-steps :deep(.el-step__line) {
  margin-top: 25px;
  background-color: #ffffff30;
}

.cart-steps :deep(.el-step__icon) {
  color: #000;
  background-color: transparent;
}
</style>