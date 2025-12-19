<template>
  <div class="order-complete-container">
    <!-- 响应式菜单栏 -->
    <PcMenu />

    <!-- 购物车步骤条 -->
    <CardSteps />

    <!-- 订单完成内容区域 -->
    <div class="order-complete-content">
      <!-- 订单成功信息 -->
      <div class="success-section">
        <el-result
          icon="success"
          title="订单支付成功"
          sub-title="感谢您的购买，您的订单已经成功支付！"
        >
          <template #extra>
            <div class="order-info">
              <div class="info-item">
                <span class="label">订单编号：</span>
                <span class="value">{{ orderNumber }}</span>
              </div>
              <div class="info-item">
                <span class="label">支付时间：</span>
                <span class="value">{{ paymentTime }}</span>
              </div>
              <div class="info-item">
                <span class="label">支付金额：</span>
                <span class="value amount">¥{{ orderAmount.toFixed(2) }}</span>
              </div>
              <div class="info-item">
                <span class="label">支付方式：</span>
                <span class="value">{{ formattedPaymentMethod }}</span>
              </div>
            </div>
            <div class="action-buttons">
              <el-button @click="viewOrderDetails">查看订单详情</el-button>
              <el-button @click="continueShopping">继续购物</el-button>
            </div>
          </template>
        </el-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useOrderStore } from '../store/order'
import { useCartStore } from '../store/cart'
import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import CardSteps from '../layouts/CardSteps.vue'

const router = useRouter()

// 使用store
const orderStore = useOrderStore()
const cartStore = useCartStore()

// 使用orderStore中的getters和state
const { currentOrder } = storeToRefs(orderStore)

const { orderNumber, paymentTime, orderAmount, formattedPaymentMethod } = orderStore

const { setActiveStep } = cartStore
// 购物车步骤条设置为第4步
setActiveStep(3)

// 查看订单详情
const viewOrderDetails = () => {
  // 跳转到订单详情页面，使用正确的路由名称和参数格式
  if (currentOrder.value) {
    // 使用订单编号作为ID参数
    router.push({
      name: 'OrderDetail',
      params: { orderNumber: currentOrder.value.orderNumber }
    })
    console.log('跳转到订单详情，订单编号:', currentOrder.value.orderNumber)
  }
}

// 继续购物
const continueShopping = () => {
  router.push('/')
}
</script>

<style scoped>
.order-complete-container {
  padding: 20px;
  gap: 20px;
  margin-top: 60px;
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
}

/* 内容区域通用样式 */
.order-complete-content {
  width: 90%;
  border-radius: 5px;
  border: 1px solid #fff;
  background-color: var(--light-card-bg);
  backdrop-filter: blur(2px);
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.success-section {
  height: 100%;
}

.success-section,
.logistics-section,
.order-items-section,
.recommended-section {
  background: var(--light-card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.order-items-section .order-items {
  background: var(--light-card-bg);
}

/* 我的订单部分样式优化 */
.orders-items :deep(.el-table),
.orders-items :deep(.el-table__body),
/* 表头样式需要绑定header-row-style */
.orders-items :deep(.el-table__header),
.orders-items :deep(.el-table__row),
.orders-items :deep(.el-table__cell) {
  background: var(--light-card-bg);
}

/* 订单成功信息 */
.order-info {
  margin: 20px 0;
  padding: 15px;
  background: var(--light-card-bg);
  border-radius: 8px;
  text-align: left;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  width: 100px;
  color: #666;
}

.value {
  flex: 1;
  font-weight: 500;
}

.value.amount {
  color: #e53935;
  font-size: 20px;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

/* 物流信息 */
.logistics-info {
  display: flex;
  gap: 30px;
}

.delivery-address,
.delivery-status {
  flex: 1;
}

.delivery-address h3,
.delivery-status h3 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.delivery-address p {
  margin: 5px 0;
  color: #666;
}

/* 订单商品 */
.product-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
  margin-bottom: 5px;
}

.product-specs {
  font-size: 12px;
  color: #666;
}

.subtotal {
  color: #e53935;
  font-weight: 500;
}

/* 推荐商品 */
.product-card {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.card-image {
  height: 160px;
  width: 100%;
  object-fit: cover;
}

.card-content {
  padding: 10px;
}

.card-title {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.card-price {
  color: #e53935;
  font-weight: 600;
}

/* 底部操作栏 */
.order-complete-footer {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-complete-container {
    padding: 15px;
    margin-top: 52px;
    height: calc(100vh - 52px);
  }
  
  .logistics-info {
    flex-direction: column;
    gap: 20px;
  }
  
  .info-item {
    flex-wrap: wrap;
  }
  
  .label {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .action-buttons .el-button {
    width: 100%;
    margin-left: 0;
    margin-bottom: 10px;
  }
}
</style>