<template>
    <div class="cart-container">
      <!-- 响应式菜单栏 -->
      <PcMenu />
      <!-- 购物车头部 -->
      <div class="cart-header">
        <h1><el-icon><ShoppingCart /></el-icon> 我的购物车</h1>
        <el-steps :active="activeStep" simple class="cart-steps">
          <el-step title="购物车" icon="ShoppingCart" />
          <el-step title="确认订单" />
          <el-step title="付款" />
          <el-step title="完成" />
        </el-steps>
      </div>

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
                <el-button type="danger" icon="Delete" circle plain @click="removeItem(index)" />
                <el-button type="info" icon="Star" circle plain @click="addToWishlist(item)" />
              </div>
            </div>
          </div>

          <!-- 购物车底部操作区 -->
          <div class="cart-footer">
            <div class="footer-left">
              <el-checkbox :checked="selectAll" @change="setSelectAll">全选</el-checkbox>
              <el-button type="text" @click="removeSelected" :disabled="selectedCount === 0">
                <el-icon><Delete /></el-icon> 删除({{ selectedCount }})
              </el-button>
              <el-button type="text" @click="clearCart">
                <el-icon><Remove /></el-icon> 清空购物车
              </el-button>
            </div>
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
                  <el-button type="success" @click="checkout">去结算</el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 为您推荐区域 -->
          <div class="recommended-products">
            <h2>为您推荐</h2>
            <div class="product-list">
              <div class="product-card" v-for="product in recommendedProducts" :key="product.id">
                <el-image :src="product.image" fit="cover" class="product-img" />
                <div class="product-info">
                  <div class="product-name">{{ product.name }}</div>
                  <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                  <el-button 
                    type="primary" 
                    size="small" 
                    @click="addToCart(product)" 
                    icon="Plus"
                  >
                    加入购物车
                  </el-button>
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
import { ShoppingCart, Delete, Remove } from '@element-plus/icons-vue';
import PcMenu from '../layouts/PcMenu.vue';

// 使用购物车store
const cartStore = useCartStore();

// 从store解构获取数据和方法
const { cartItems, recommendedProducts } = cartStore;
const { 
  setSelectAll, 
  removeItem, 
  removeSelected, 
  clearCart, 
  addToCart, 
  addToWishlist, 
  goShopping, 
  checkout 
} = cartStore;

// 从store获取计算属性
const { selectedCount, totalQuantity, totalAmount, selectAll } = cartStore;

// 当前步骤（购物车流程）
const activeStep = 1;
</script>

<style scoped>

/* 购物车容器 */
.cart-container {
  height: calc(100vh - 60px);
  width: 100%;
  margin: 60px auto 0;
  padding: 20px;
  overflow-y: auto;
}

/* 购物车头部 */
.cart-header {
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.cart-header .cart-steps {
  background: var(--light-card-bg);
}

.cart-header h1 {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* 购物车商品列表 */
.cart-items {
  background: var(--light-card-bg);
  border-radius: 8px;
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
  border-radius: 4px;
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
  border-radius: 3px;
}

.item-price {
  width: 100px;
  color: #e53935;
  font-weight: 500;
}

.item-quantity {
  width: 140px;
}

.item-subtotal {
  width: 120px;
  font-weight: 600;
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
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
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
  color: #666;
}

.total-amount {
  font-size: 18px;
}

.total-amount .amount {
  font-weight: 600;
  color: #e53935;
  font-size: 22px;
}

/* 为您推荐 */
.recommended-products {
  margin-top: 40px;
}

.recommended-products h2 {
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--light-card-bg);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-img {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
}

.product-info {
  padding: 15px;
  text-align: center;
}

.product-name {
  font-weight: 500;
  margin-bottom: 8px;
  font-size: 16px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  color: #e53935;
  font-weight: 600;
  font-size: 18px;
  margin: 10px 0 15px;
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
  
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>