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
        <!-- 选择地址标题 -->
        <div class="section-title">
          <el-icon><Location /></el-icon> 收货地址
          <el-icon @click="addNewAddress" class="add-icon"> <Plus /> </el-icon>
        </div>

        <!-- 地址列表 -->
        <div class="address-list">
          <div 
            v-for="address in addresses" 
            :key="address.id"
            :class="['address-item', { 'active': address.id === selectedAddressId }]"
            @click="selectAddress(address.id)"
          >
            <div class="address-info">
              <div class="name-phone">
                <span class="name">{{ address.name }}</span>
                <span class="phone">{{ address.phone }}</span>
              </div>
              <div class="address-detail">{{ address.province }} {{ address.city }} {{ address.district }} {{ address.street }}</div>
            </div>
            <div class="address-actions">
              <el-tag v-if="address.isDefault" size="small" type="success">默认</el-tag>
              <el-button type="primary" text size="small" @click.stop="editAddress(address.id as unknown as number)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button type="danger" text size="small" @click.stop="confirmDeleteAddress(address.id)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单商品 -->
      <div class="order-items-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon> 订单商品
        </div>
        <div class="order-items">
          <div class="order-item" v-for="(item, index) in selectedItemsForCheckout" :key="index">
            <div class="item-image">
              <el-image :src="item.imageUrl" fit="cover" loading="lazy" class="product-img" :alt="item.name" />
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
          <el-radio-group v-model="orderStore.deliveryMethod">
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
            v-model="orderStore.orderRemark"
            type="textarea"
            :rows="2"
            placeholder="请输入订单备注，如有特殊要求请在此说明"
            maxlength="200"
            show-word-limit
          />
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="checkout-footer">
        <div class="checkout-footer-left">
          <span>商品总价({{ orderStore.subtotal.toFixed(2) }})</span>
          <span>配送费({{ deliveryFee.toFixed(2) }})</span>
          <span>总额({{ totalAmount.toFixed(2) }})</span>
        </div>
        <div class="checkout-footer-right">
          <el-icon @click="proceedToPayment" class="footer-icon"> <ArrowRightBold /> </el-icon>
        </div>
      </div>
    </div>
  </div>

  <!-- 地址弹窗 -->
  <AddressDialog v-model="userStore.AddressDialogVisible" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import { useCartStore } from '../store/cart'
import { useUserStore } from '../store/user'
import { useOrderStore } from '../store/order'

import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import CardSteps from '../layouts/CardSteps.vue'
import AddressDialog from '../layouts/AddressDialog.vue'

import { Location, Edit, Delete, Plus, Goods, Van, ChatLineRound, ArrowRightBold } from '@element-plus/icons-vue'

// 使用stores
const cartStore = useCartStore()
const userStore = useUserStore()
const orderStore = useOrderStore()

// 从store解构获取非响应式方法
const { 
  openEditAddressDialog: editAddress,
  openAddAddressDialog: addNewAddress
} = userStore

const { setActiveStep } = cartStore

// 从store中解构响应式数据
const { 
  addresses
} = storeToRefs(userStore)

// 从orderStore中解构响应式数据
const {
  selectedItemsForCheckout,
  selectedAddressId,
  deliveryFee,
  totalAmount
} = storeToRefs(orderStore)

// 从orderStore解构获取非响应式方法
const { 
  selectAddress,
  confirmDeleteAddress,
  proceedToPayment
} = orderStore

// 页面加载时的操作
onMounted(() => {
  console.log('确认订单页面已加载')
  // 购物车步骤条设置为第2步
  setActiveStep(1)
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

.add-icon {
  margin-left: auto;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-icon:hover {
  transform: translateY(-6px);
}

/* 地址部分 */
.address-section,
.order-items-section,
.delivery-section,
.order-remark-section,
.checkout-footer {
  background: var(--light-card-bg);
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
  background-color: #fafafaad;
}

.address-item.active {
  background-color: #fafafaad;
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

.address-detail {
  font-size: 14px;
}

.address-actions {
  display: flex;
  gap: 10px;
  align-items: center;
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
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 5px;
}

.item-spec {
  font-size: 12px;
  background: #f5f7fa;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
}

.item-price,
.item-quantity,
.item-subtotal {
  font-size: 16px;
  width: 100px;
  text-align: center;
}

.item-subtotal {
  font-weight: 500;
}

/* 配送方式和支付方式 */
.delivery-options,
.payment-options {
  padding: 10px 0;
}

/* 底部操作栏 */
.checkout-footer {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-top: 20px;
  margin-bottom: 0;
}

.checkout-footer-left {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 10px;
}
.checkout-footer-left span {
  font-size: 14px;
  font-weight: 400;
}

.checkout-footer-right {
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 20px;
}

.footer-icon{
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.25s ease;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

.footer-icon:hover {
  transform: translateY(-8px);
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