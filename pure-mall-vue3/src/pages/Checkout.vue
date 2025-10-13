<template>
  <div class="checkout-container">
    <!-- 响应式菜单栏 -->
    <PcMenu />
    <!-- 购物车步骤条 -->
    <CardSteps />

    <!-- 确认订单内容区域 -->
    <div class="checkout-content">
      <!-- 收货地址 -->
      <div class="address-section">
        <div class="section-title">
          <el-icon><Location /></el-icon> 收货地址
        </div>
        <div class="address-list">
          <div 
            v-for="(address, index) in addresses" 
            :key="index"
            :class="['address-item', { 'active': address.isDefault }]"
            @click="selectAddress(index)"
          >
            <div class="address-info">
              <div class="name-phone">
                <span class="name">{{ address.name }}</span>
                <span class="phone">{{ address.phone }}</span>
              </div>
              <div class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.detail }}</div>
            </div>
            <div class="address-actions">
              <el-tag v-if="address.isDefault" size="small" type="success">默认</el-tag>
              <el-button type="primary" text size="small" @click.stop="editAddress(index)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" text size="small" @click.stop="deleteAddress(index)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          <div class="add-address">
            <el-button type="dashed" @click="addNewAddress">
              <el-icon><Plus /></el-icon> 添加新地址
            </el-button>
          </div>
        </div>
      </div>

      <!-- 订单商品 -->
      <div class="order-items-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon> 订单商品
        </div>
        <div class="order-items">
          <div class="order-item" v-for="(item, index) in orderItems" :key="index">
            <div class="item-image">
              <el-image :src="item.image" fit="cover" class="product-img" />
            </div>
            <div class="item-info">
              <div class="item-title">{{ item.name }}</div>
              <div class="item-spec">规格：{{ item.spec }}</div>
            </div>
            <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            <div class="item-quantity">x{{ item.quantity }}</div>
            <div class="item-subtotal">¥{{ (item.price * item.quantity).toFixed(2) }}</div>
          </div>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="delivery-section">
        <div class="section-title">
          <el-icon><Van /></el-icon> 配送方式
        </div>
        <div class="delivery-options">
          <el-radio-group v-model="deliveryMethod">
            <el-radio label="standard">标准配送 (免费)</el-radio>
            <el-radio label="express">快速配送 (¥15.00)</el-radio>
          </el-radio-group>
        </div>
      </div>


      <!-- 订单备注 -->
      <div class="order-remark-section">
        <div class="section-title">
          <el-icon><ChatLineRound /></el-icon> 订单备注
        </div>
        <div class="remark-input">
          <el-input
            v-model="orderRemark"
            type="textarea"
            :rows="2"
            placeholder="请输入订单备注，如有特殊要求请在此说明"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>

      <!-- 订单汇总 -->
      <div class="order-summary-section">
        <div class="summary-item">
          <span>商品总价：</span>
          <span>¥{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-item">
          <span>配送费用：</span>
          <span>¥{{ deliveryFee.toFixed(2) }}</span>
        </div>
        <div class="summary-item total">
          <span>应付总额：</span>
          <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="checkout-footer">
        <el-button @click="goBack">返回购物车</el-button>
        <el-button type="primary" @click="proceedToPayment">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '../store/order'
import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import { Location, Edit, Delete, Plus, Goods, Van, ChatLineRound } from '@element-plus/icons-vue'
import CardSteps from '../layouts/CardSteps.vue'

const router = useRouter()

// 使用order store
const orderStore = useOrderStore()

// 从store解构获取非响应式方法
const { 
  selectAddress,
  editAddress,
  deleteAddress,
  addNewAddress
} = orderStore

// 从store中解构响应式数据
const { 
  addresses,
  orderItems,
  deliveryMethod,
  orderRemark,
  subtotal,
  deliveryFee,
  totalAmount
} = storeToRefs(orderStore)

// 返回购物车
const goBack = () => {
  router.push('/cart')
}

// 提交订单，进入支付页面
const proceedToPayment = () => {
  // 创建订单
  orderStore.createOrder()
  // 提交成功后跳转到支付页面
  router.push('/payment')
}

// 页面加载时的操作
onMounted(() => {
  console.log('确认订单页面已加载')
  // 实际项目中这里可能会从API获取数据
})
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  gap: 20px;
  margin-top: 60px;
  height: calc(100vh - 60px);
  width: 100%;
  display: flex;
}

/* 内容区域通用样式 */
.checkout-content {
  width: 90%;
  border-radius: 5px;
  border: 1px solid #fff;
  background-color: var(--light-card-bg);
  backdrop-filter: blur(2px);
  overflow-y: auto;
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

/* 地址部分 */
.address-section,
.order-items-section,
.delivery-section,
.order-remark-section,
.order-summary-section {
  background: var(--light-card-bg);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.address-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.address-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.address-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.address-item.active {
  border-color: #67c23a;
  background-color: #f0f9eb;
}

.address-info {
  flex: 1;
}

.name-phone {
  margin-bottom: 8px;
}

.name {
  font-weight: 500;
  margin-right: 15px;
}

.phone {
  color: #666;
}

.address-detail {
  color: #666;
  font-size: 14px;
}

.address-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-address {
  margin-top: 10px;
}

/* 订单商品部分 */
.order-items {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  margin-right: 15px;
}

.item-image .el-image {
  width: 70px;
  height: 70px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #eee;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: 500;
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

.item-price,
.item-quantity,
.item-subtotal {
  width: 100px;
  text-align: center;
}

.item-price {
  color: #e53935;
}

.item-subtotal {
  font-weight: 600;
}

/* 配送方式和支付方式 */
.delivery-options,
.payment-options {
  padding: 10px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.summary-item.total {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  border-top: 1px solid #eee;
  padding-top: 15px;
  margin-top: 15px;
}

.total-amount {
  color: #e53935;
  font-size: 24px;
}

/* 底部操作栏 */
.checkout-footer {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .checkout-container {
    padding: 15px;
    margin-top: 52px;
    height: calc(100vh - 52px);
  }
  
  .order-item {
    flex-wrap: wrap;
  }
  
  .item-image {
    width: 60px;
  }
  
  .item-image .el-image {
    width: 50px;
    height: 50px;
  }
  
  .item-price,
  .item-quantity,
  .item-subtotal {
    width: auto;
    margin-right: 15px;
  }
  
  .item-subtotal {
    width: 100%;
    text-align: right;
    margin-top: 10px;
  }
}
</style>