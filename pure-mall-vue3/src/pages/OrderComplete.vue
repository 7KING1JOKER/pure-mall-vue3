<template>
  <div class="order-complete-container">
    <!-- 响应式菜单栏 -->
    <PcMenu />
    <!-- 订单完成头部 -->
    <div class="order-complete-header">
      <h1><el-icon><SuccessFilled /></el-icon> 订单完成</h1>
      <el-steps :active="4" simple finish-status="success" class="cart-steps">
        <el-step title="购物车" icon="ShoppingCart" />
        <el-step title="确认订单" icon="Document" />
        <el-step title="付款" icon="CreditCard" />
        <el-step title="完成" icon="SuccessFilled" />
      </el-steps>
    </div>

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
                <el-button type="text" size="small" @click="copyOrderNumber">
                  <el-icon><CopyDocument /></el-icon> 复制
                </el-button>
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
                <span class="value">{{ paymentMethod }}</span>
              </div>
            </div>
            <div class="action-buttons">
              <el-button type="primary" @click="viewOrderDetails">查看订单详情</el-button>
              <el-button @click="continueShopping">继续购物</el-button>
            </div>
          </template>
        </el-result>
      </div>

      <!-- 物流信息 -->
      <div class="logistics-section">
        <div class="section-title">
          <el-icon><Van /></el-icon> 物流信息
        </div>
        <div class="logistics-info">
          <div class="delivery-address">
            <h3>收货地址</h3>
            <p>{{ deliveryInfo.name }} {{ deliveryInfo.phone }}</p>
            <p>{{ deliveryInfo.address }}</p>
          </div>
          <div class="delivery-status">
            <h3>配送状态</h3>
            <el-steps direction="vertical" :active="1">
              <el-step title="订单已支付" :description="paymentTime" />
              <el-step title="商品打包中" description="预计24小时内发货" />
              <el-step title="商品已发货" description="" />
              <el-step title="配送中" description="" />
              <el-step title="已送达" description="" />
            </el-steps>
          </div>
        </div>
      </div>

      <!-- 订单商品 -->
      <div class="order-items-section">
        <div class="section-title">
          <el-icon><Goods /></el-icon> 订单商品
        </div>
        <div class="order-items">
          <el-table :data="orderItems" style="width: 100%">
            <el-table-column label="商品信息">
              <template #default="{ row }">
                <div class="product-info">
                  <el-image :src="row.image" :preview-src-list="[row.image]" fit="cover" class="product-image" />
                  <div class="product-details">
                    <div class="product-name">{{ row.name }}</div>
                    <div class="product-specs">{{ row.specs }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120">
              <template #default="{ row }">
                <span>¥{{ row.price.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="100" />
            <el-table-column label="小计" width="120">
              <template #default="{ row }">
                <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 推荐商品 -->
      <div class="recommended-section">
        <div class="section-title">
          <el-icon><Star /></el-icon> 为您推荐
        </div>
        <div class="recommended-products">
          <el-carousel :interval="4000" type="card" height="240px">
            <el-carousel-item v-for="(item, index) in recommendedProducts" :key="index">
              <div class="product-card" @click="viewProduct(item.id)">
                <el-image :src="item.image" fit="cover" class="card-image" />
                <div class="card-content">
                  <div class="card-title">{{ item.name }}</div>
                  <div class="card-price">¥{{ item.price.toFixed(2) }}</div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="order-complete-footer">
        <el-button @click="goToUserCenter">查看我的订单</el-button>
        <el-button type="primary" @click="continueShopping">继续购物</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useOrderStore } from '../store/order'
import { useProductStore } from '../store/product'
import { storeToRefs } from 'pinia'
import PcMenu from '../layouts/PcMenu.vue'
import { SuccessFilled, CopyDocument, Van, Goods, Star } from '@element-plus/icons-vue'

const router = useRouter()

// 使用store
const orderStore = useOrderStore()
const productStore = useProductStore()
const { currentOrder } = storeToRefs(orderStore)

// 默认地址信息
const defaultDeliveryInfo = {
  name: '张三',
  phone: '138****1234',
  address: '北京市朝阳区三里屯街道10号楼501室'
}

// 默认订单商品
const defaultOrderItems = [
  {
    id: 1,
    name: '2023新款连帽卫衣',
    specs: '颜色：黑色；尺码：L',
    image: 'https://picsum.photos/id/237/200/200',
    price: 299,
    quantity: 1
  },
  {
    id: 2,
    name: '休闲宽松牛仔裤',
    specs: '颜色：蓝色；尺码：32',
    image: 'https://picsum.photos/id/238/200/200',
    price: 399,
    quantity: 1
  }
]

// 订单信息计算属性
const orderNumber = computed(() => currentOrder.value?.orderNumber || '')
const paymentTime = computed(() => currentOrder.value?.paymentTime || new Date().toLocaleString())
const orderAmount = computed(() => currentOrder.value?.orderAmount || 0)
const paymentMethod = computed(() => currentOrder.value?.paymentMethod || '支付宝')
const deliveryInfo = computed(() => currentOrder.value?.deliveryInfo || defaultDeliveryInfo)
const orderItems = computed(() => currentOrder.value?.items || defaultOrderItems)

// 推荐商品 - 从product store获取或使用默认数据
const recommendedProducts = computed(() => {
  if (productStore.productDatabase.length > 0) {
    // 从所有商品中随机选择4个作为推荐商品
    const shuffled = [...productStore.productDatabase].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4).map(product => ({
      id: product.id,
      name: product.name,
      image: product.images[0],
      price: product.price
    }))
  }
  // 默认推荐商品
  return [
    {
      id: 101,
      name: '时尚休闲外套',
      image: 'https://picsum.photos/id/239/300/300',
      price: 459
    },
    {
      id: 102,
      name: '百搭T恤',
      image: 'https://picsum.photos/id/240/300/300',
      price: 129
    },
    {
      id: 103,
      name: '运动鞋',
      image: 'https://picsum.photos/id/241/300/300',
      price: 359
    },
    {
      id: 104,
      name: '时尚背包',
      image: 'https://picsum.photos/id/242/300/300',
      price: 199
    }
  ]
})

// 复制订单号
const copyOrderNumber = () => {
  navigator.clipboard.writeText(orderNumber.value)
    .then(() => {
      ElMessage.success('订单号已复制到剪贴板')
    })
    .catch(() => {
      ElMessage.error('复制失败，请手动复制')
    })
}

// 查看订单详情
const viewOrderDetails = () => {
  // 实际项目中跳转到订单详情页
  ElMessage.info('查看订单详情功能开发中')
}

// 继续购物
const continueShopping = () => {
  router.push('/')
}

// 查看商品详情
const viewProduct = (productId: number) => {
  // 实际项目中跳转到商品详情页
  ElMessage.info(`查看商品ID: ${productId}`)
}

// 跳转到用户中心
const goToUserCenter = () => {
  router.push('/user')
}
</script>

<style scoped>
.order-complete-container {
  width: 100%;
  height: calc(100vh - 60px);
  margin: 60px auto 0;
  padding: 20px;
  overflow-y: auto;
}

/* 订单完成头部 */
.order-complete-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.order-complete-header h1 {
  font-size: 28px;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.order-complete-header .cart-steps {
  background: var(--light-card-bg);
}

/* 内容区域通用样式 */
.order-complete-content {
  max-width: 800px;
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