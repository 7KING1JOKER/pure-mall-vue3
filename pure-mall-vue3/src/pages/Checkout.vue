<template>
  <div class="checkout-container">
    <!-- 响应式菜单栏 -->
    <PcMenu />
    <!-- 确认订单头部 -->
    <div class="checkout-header">
      <h1><el-icon><Document /></el-icon> 确认订单</h1>
      <el-steps :active="2" simple>
        <el-step title="购物车" icon="ShoppingCart" />
        <el-step title="确认订单" icon="Document" />
        <el-step title="付款" />
        <el-step title="完成" />
      </el-steps>
    </div>

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

      <!-- 支付方式 -->
      <div class="payment-method-section">
        <div class="section-title">
          <el-icon><CreditCard /></el-icon> 支付方式
        </div>
        <div class="payment-options">
          <el-radio-group v-model="paymentMethod">
            <el-radio label="alipay">支付宝</el-radio>
            <el-radio label="wechat">微信支付</el-radio>
            <el-radio label="creditcard">信用卡</el-radio>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import PcMenu from '../layouts/PcMenu.vue'
import { Document, Location, Edit, Delete, Plus, Goods, Van, CreditCard, ChatLineRound } from '@element-plus/icons-vue'

const router = useRouter()

// 收货地址数据
const addresses = ref([
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南路XX号XX大厦XX室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detail: '天河路XX号XX公寓XX室',
    isDefault: false
  }
])

// 订单商品数据（模拟从购物车获取的已选商品）
const orderItems = ref([
  {
    id: 1,
    name: '无线蓝牙降噪耳机',
    spec: '黑色',
    price: 299,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1606220588914-08f6c7f2a8d2?w=400'
  },
  {
    id: 2,
    name: '便携式咖啡机',
    spec: '白色',
    price: 399,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1556911220-f7d27ca5528e?w=400'
  }
])

// 配送方式
const deliveryMethod = ref('standard')

// 支付方式
const paymentMethod = ref('alipay')

// 订单备注
const orderRemark = ref('')

// 计算商品总价
const subtotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 计算配送费用
const deliveryFee = computed(() => {
  return deliveryMethod.value === 'express' ? 15 : 0
})

// 计算应付总额
const totalAmount = computed(() => {
  return subtotal.value + deliveryFee.value
})

// 选择地址
const selectAddress = (index: number) => {
  addresses.value.forEach((address, i) => {
    address.isDefault = i === index
  })
}

// 编辑地址
const editAddress = (index: number) => {
  ElMessage.info(`编辑地址：${addresses.value[index].name}`)
  // 实际项目中这里会打开编辑地址的表单
}

// 删除地址
const deleteAddress = (index: number) => {
  ElMessageBox.confirm(
    `确定要删除 ${addresses.value[index].name} 的地址吗？`,
    '删除地址',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    addresses.value.splice(index, 1)
    ElMessage.success('地址已删除')
  }).catch(() => {
    // 取消删除
  })
}

// 添加新地址
const addNewAddress = () => {
  ElMessage.info('添加新地址')
  // 实际项目中这里会打开添加地址的表单
}

// 返回购物车
const goBack = () => {
  router.push('/cart')
}

// 提交订单，进入支付页面
const proceedToPayment = () => {
  // 这里可以添加订单提交的逻辑，如表单验证等
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
  width: 100%;
  height: calc(100vh - 60px);
  margin: 60px auto 0;
  padding: 20px;
  overflow-y: auto;
}

/* 确认订单头部 */
.checkout-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.checkout-header h1 {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

/* 内容区域通用样式 */
.checkout-content {
  max-width: 1200px;
  margin: 0 auto;
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
.payment-method-section,
.order-remark-section,
.order-summary-section {
  background: #fff;
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

/* 订单汇总 */
.order-summary-section {
  background: #fafafa;
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