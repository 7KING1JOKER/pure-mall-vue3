<template>
    <div class="cart-container">
      <!-- 响应式菜单栏 -->
      <PcMenu />

      <!-- 购物车步骤条 -->
      <CardSteps />

      <!-- 购物车内容区域 -->
      <div class="cart-content">
        <!-- 购物车为空的状态 -->
        <div v-if="cartItems.length === 0" class="empty-cart">
          <el-empty description="您的购物车是空的" :image-size="200">
            <template #image>
              <img src="https://img.icons8.com/fluency/200/shopping-cart-empty.png" alt="empty cart">
            </template>
            <el-button type="primary" @click="goShopping">去购物</el-button>
          </el-empty>
        </div>

        <!-- 购物车有商品时的状态 -->
        <div v-else>
          <!-- 购物车商品列表 -->
          <div class="cart-items">
            <div class="cart-item" v-for="(item, index) in cartItems" :key="item.id">
              <div class="item-checkbox">
                <el-checkbox v-model="item.selected" />
              </div>
              <div class="item-image">
                <el-image 
                  :src="item.image" 
                  fit="cover" 
                  class="product-img"
                  :preview-src-list="[item.image]"
                  hide-on-click-modal
                />
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.name }}</div>
                <div class="item-description">{{ item.description }}</div>
                <div class="item-spec">规格：{{ item.spec }}</div>
              </div>
              <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
              <div class="item-quantity">
                <el-input-number
                  v-model="item.quantity" 
                  :min="1" 
                  :max="10" 
                  size="small"
                />
              </div>
              <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
              <div class="item-actions">
                <el-button type="danger" circle plain @click="removeItem(index)">
                  <el-icon><Delete /></el-icon>
                </el-button>
                <el-button type="info" circle plain @click="addToWishlist(item)">
                  <el-icon><Star /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <!-- 购物车底部操作区 -->
          <div class="cart-footer">
            <!-- 购物车底部左侧操作 -->
            <div class="footer-left">
              <el-checkbox :checked="selectAll" @change="setSelectAll">全选</el-checkbox>
              <el-button type="text" @click="removeSelected" :disabled="selectedCount === 0">
                <el-icon><Delete /></el-icon> 删除({{ selectedCount }})
              </el-button>
              <el-button type="text" @click="clearCart">
                <el-icon><Remove /></el-icon> 清空购物车
              </el-button>
            </div> 

            <!-- 购物车底部右侧操作 -->
            <div class="footer-right">
              <div class="summary">
                <div class="total-quantity">
                  共 {{ totalQuantity }} 件商品
                </div>
                <div class="total-amount">
                  <span>总计：</span>
                  <span class="amount">¥{{ totalAmount.toFixed(2) }}</span>
                </div>
                <div class="actions">
                  <el-icon @click="checkout" class="checkout-icon"> <ArrowRightBold /> </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../store/cart';
import { storeToRefs } from 'pinia';
import { Delete, Remove, Star, ArrowRightBold } from '@element-plus/icons-vue';
import PcMenu from '../layouts/PcMenu.vue';
import CardSteps from '../layouts/CardSteps.vue';
import { onMounted } from 'vue';


// 使用购物车store
const cartStore = useCartStore();

// 使用storeToRefs解构响应式数据和计算属性
const { cartItems, selectedCount, totalQuantity, totalAmount, selectAll } = storeToRefs(cartStore);

// 直接解构方法（方法不需要使用storeToRefs）
const { 
  setSelectAll, 
  removeItem, 
  removeSelected, 
  clearCart, 
  addToWishlist, 
  goShopping, 
  checkout,
  setActiveStep
} = cartStore;

onMounted(() => {
  console.log('购物车页面已加载')
  // 购物车步骤条设置为第1步
  setActiveStep(0)
})


</script>

<style scoped>

/* 购物车容器 */
.cart-container {
  padding: 20px;
  gap: 20px;
  margin-top: 60px;
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
}

/* 购物车内容 */
.cart-content {
  width: 90%;
  border-radius: 5px;
  border: 1px solid #fff;
  background-color: var(--light-card-bg);
  backdrop-filter: blur(2px);
  overflow-y: auto;
  max-height: calc(100vh - 100px);
}

.cart-items {
  background: var(--light-card-bg);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 40px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  transition: all 0.3s;
}

.cart-item:hover {
  background-color: #fafafaad;
}

.cart-item > div {
  padding: 0 10px;
}

.item-checkbox {
  width: 40px;
}

.item-image {
  width: 120px;
}

.item-image .el-image {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border: 1px solid #eee;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 5px;
}

.item-description {
  font-size: 13px;
  color: #888;
  margin-bottom: 5px;
}

.item-spec {
  font-size: 13px;
  color: #666;
  background: #f5f7fa;
  display: inline-block;
  padding: 2px 6px;
}

.item-price {
  width: 100px;
  font-weight: 300;
}

.item-quantity {
  width: 140px;
}

.item-subtotal {
  width: 120px;
  font-weight: 400;
  color: #333;
}

.item-actions {
  width: 120px;
  display: flex;
  gap: 5px;
}

/* 购物车底部 */
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--light-card-bg);
  padding: 20px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  width: 100%;
  bottom: 0;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-right {
  display: flex;
}

.summary {
  display: flex;
  align-items: center;
  gap: 30px;
}

.total-quantity {
  font-size: 16px;
  color: #000;
  font-weight: 300;
}

.total-amount {
  font-size: 12px;
}

.total-amount .amount {
  font-size: 18px;
  font-weight: 350;
}

.checkout-icon {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkout-icon:hover {
  transform: translateY(-10px);
}


.product-img {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
}

/* 空购物车 */
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-item {
    flex-wrap: wrap;
    gap: 15px;
  }
  
  .cart-item > div {
    flex: 1 1 33%;
    padding: 5px;
  }
  
  .item-checkbox {
    order: 1;
  }
  
  .item-image {
    order: 2;
  }
  
  .item-info {
    order: 3;
    flex: 1 1 100%;
  }
  
  .item-price {
    order: 4;
  }
  
  .item-quantity {
    order: 5;
  }
  
  .item-subtotal {
    order: 6;
  }
  
  .item-actions {
    order: 7;
    flex: 1 1 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
  
  .cart-footer {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
  
  .footer-left {
    justify-content: space-between;
  }
  
  .summary {
    flex-direction: column;
    gap: 15px;
    align-items: flex-end;
  }
  
}
</style>