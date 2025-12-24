<template>
  <PcMenu />
  <div class="main-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <!-- 用户简介卡片 -->
      <el-card class="user-profile-card">
        <template #header>
          <div class="user-profile-header">
            <el-avatar :size="80" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            <div class="user-info">
              <div class="user-name"> {{ userStore.username }} </div>
              <div class="user-email"> {{ userStore.email }} </div>
            </div>
          </div>
        </template>
        <el-tag
            type="primary"
            effect="plain"
            color="transparent"
            style="color: #333;"
        >
           {{ vip }} 
        </el-tag> 
      </el-card>
      
      <!-- 用户侧栏功能 -->
      <el-menu 
        :default-active="activeTab" 
        class="nav-menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="profile">
          <el-icon><User /></el-icon>
          <span :class="{ 'through-line': activeTab === 'profile' }">个人资料</span>
        </el-menu-item>
        <el-menu-item index="orders">
          <el-icon><ShoppingCart /></el-icon>
          <span :class="{ 'through-line': activeTab === 'orders' }">我的订单</span>
        </el-menu-item>
        <el-menu-item index="address">
          <el-icon><Location /></el-icon>
          <span :class="{ 'through-line': activeTab === 'address' }">地址管理</span>
        </el-menu-item>
        <el-menu-item index="wishlist">
          <el-icon><Star /></el-icon>
          <span :class="{ 'through-line': activeTab === 'wishlist' }">我的收藏</span>
        </el-menu-item>
      </el-menu>
    </div>
    
    <!-- 用户中心内容区 -->
    <el-card class="content-card">
      <template #header>
        <div class="content-header">
          <div class="content-title">
            <!-- 动态元组件渲染图标 -->
            <el-icon>
              <component
                :is="getIconComponent(tabIcons[activeTab])"
              />
            </el-icon>
            <span>{{ tabTitles[activeTab] }}</span>
          </div>
        </div>
      </template>
      
      <!-- 个人资料 -->
      <div v-if="activeTab === 'profile'" class="profile-section">
        <el-descriptions title="基本信息" :column="2" :border="true">
          <el-descriptions-item
            v-for="(item, index) in basicInfo"
            :key="index"
            :label="item.label"
            label-class-name="profile-label"
            class-name="profile-content"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-icon @click="userStore.EditProfileDialogVisible = true" style="margin-top: 20px;" class="edit-icon"> <Edit /> </el-icon>
      </div>
      
      <!-- 我的订单 -->
      <div v-if="activeTab === 'orders'" class="orders-section" style="margin-top: 20px;">
        <el-table 
          :data="userStore.orders" style="max-width: 100%; width: auto;" :border="true"
          :header-row-style="{ background: 'transparent' }"
        >
          <el-table-column prop="orderNumber" label="订单号" width="180" />
          <el-table-column prop="createTime" label="下单时间" width="180" />
          <el-table-column prop="orderAmount" label="订单金额" width="120" />
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-tag :type="userStore.statusType(scope.row.status)" effect="dark">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-icon  @click="viewOrderDetail(scope.row.orderNumber)" size="30px"> <Search /> </el-icon>
              <el-icon @click="confirmDeleteOrder(scope.row.orderNumber)" size="30px"> <Delete /> </el-icon>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 地址管理 -->
      <div v-if="activeTab === 'address'" class="address-section" style="margin-top: 20px;">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(address, index) in addresses" :key="index">
            <el-card class="address-card" shadow="hover">
              <template #header>
                <div class="address-header">
                  <span class="address-name">{{ address.name }}</span>
                  <el-tag v-if="address.isDefault" type="success" size="small">默认地址</el-tag>
                </div>
              </template>
              <div class="address-detail">
                <p>{{ address.province }} {{ address.city }} {{ address.district }}</p>
                <p>{{ address.street }}</p>
                <p>邮编：{{ address.postcode }}</p>
                <p>电话：{{ address.phone }}</p>
              </div>
              <template #footer>
                  <el-button type="primary" :icon="Edit" text @click="editAddress(address.id)"></el-button>
                  <el-button type="danger" :icon="Delete" text @click="confirmDeleteAddress(address.id)"></el-button>
                  <el-button v-if="!address.isDefault" type="success" :icon="Check" text @click="setAsDefault(address.id)" style="color: #333;">Default</el-button>
              </template>
            </el-card>
          </el-col>
        </el-row>
        <el-icon @click="addNewAddress" class="add-icon"> <DocumentAdd /> </el-icon>
      </div>

      <!-- 我的收藏 -->
      <div v-if="activeTab === 'wishlist'" class="wishlist-section" style="margin-top: 20px;">
        <div v-if="wishlistItems.length === 0" class="empty-wishlist">
          <el-empty description="暂无收藏内容" :image-size="200">
            <el-button type="primary" @click="router.push('/category')">开始收藏</el-button>
          </el-empty>
        </div>
        <div v-else class="wishlist-container">
          <div v-for="item in wishlistItems" :key="item.id" class="wishlist-item-list">
            <div class="wishlist-item-wrapper">
              <ProductCard :product="item" />
              <el-icon class="delete-wishlist-btn" @click="confirmRemoveFromWishlist(item)"> <Close /> </el-icon>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 编辑资料弹窗 -->
    <EditProfileDialog v-model="userStore.EditProfileDialogVisible" />
    <!-- 添加地址弹窗 -->
    <AddressDialog v-model="userStore.AddressDialogVisible" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
   ElCard, 
   ElAvatar, 
   ElTag, 
   ElMenu, 
   ElMenuItem, 
   ElIcon, 
   ElButton, 
   ElButtonGroup,
   ElDescriptions, 
   ElDescriptionsItem, 
   ElTable, 
   ElTableColumn, 
   ElRow, 
   ElCol,
   ElEmpty,
   ElMessageBox,
   ElMessage
  } from 'element-plus'

import {
  User,
  ShoppingCart,
  Location,
  Star,
  Edit,
  Plus,
  Delete,
  Check,
  Close,
  DocumentAdd,
  Search
} from '@element-plus/icons-vue'

import PcMenu from '../layouts/PcMenu.vue'
import EditProfileDialog from '../layouts/EditProfileDialog.vue'
import AddressDialog from '../layouts/AddressDialog.vue'
import { useUserStore } from '../store/user'
import { useOrderStore } from '../store/order'
import { storeToRefs } from 'pinia'
import ProductCard from '../components/ProductCard.vue'

// 获取store中的响应式数据
const userStore = useUserStore()
const orderStore = useOrderStore()
const router = useRouter()
const {
  vip,
  activeTab,
  tabIcons,
  tabTitles,
  basicInfo,
  memberInfo,
  addresses
} = storeToRefs(userStore)
const { wishlistItems ,handleMenuSelect } = userStore

// 地址管理相关方法
// 添加新地址
const addNewAddress = () => {
  userStore.openAddAddressDialog()
}

// 编辑地址
const editAddress = (addressId) => {
  userStore.openEditAddressDialog(addressId)
}

// 确认删除地址
const confirmDeleteAddress = (addressId) => {
  ElMessageBox.confirm(
    '确定要删除这个地址吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.deleteAddress(userStore.username, addressId)
  }).catch(() => {
    // 取消删除，不做任何操作
    ElMessage.info('删除操作已取消')
  })
}

// 设置为默认地址
const setAsDefault = (addressId) => {
  userStore.setDefaultAddress(userStore.username, addressId)
}

// 获取订单状态对应的类型
const getStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'paid': 'primary',
    'shipped': 'info',
    'delivered': 'success',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'default'
}

// 获取订单状态的中文文本
const getStatusText = (status) => {
  const statusMap = {
    'pending': '待付款',
    'paid': '已付款',
    'shipped': '已发货',
    'delivered': '已送达',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 查看订单详情
const viewOrderDetail = (orderNumber) => {
  if (orderNumber) {
    router.push({
      name: 'OrderDetail',
      params: { orderNumber }
    })
    // console.log('跳转到订单详情，订单编号:', orderNumber)
  } else {
    ElMessage.error('无法获取订单信息')
  }
}

// 确认删除订单
const confirmDeleteOrder = (orderNumber) => {
  ElMessageBox.confirm(
    '确定要删除这个订单吗？此操作不可恢复。',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    const response = await orderStore.deleteOrder(orderNumber);
    const response2 = await orderStore.deleteOrderItems(userStore.userId, orderNumber);
  }).catch(() => {
    // 取消删除，不做任何操作
  })
}

// 从收藏夹移除商品
const confirmRemoveFromWishlist = (item) => {
  ElMessageBox.confirm(
    `确定要从收藏夹移除「${item.name}」吗？`,
    '移除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 从收藏夹服务端中移除商品
    userStore.removeWishlistItem(userStore.username, item.id);

    // 使用userStore的removeFromWishlist方法删除商品
    userStore.removeFromWishlist(item.id);
  }).catch(() => {
    // 取消移除，不做任何操作
  })
}

// 添加到购物车
const addToCart = (item) => {
  userStore.addToCart(item);
}

// 获取图标组件函数
const getIconComponent = (iconName) => {
  const iconMap = {
    'User': User,
    'ShoppingCart': ShoppingCart,
    'Location': Location,
    'Star': Star
  }
  return iconMap[iconName] || User
}

</script>

<style scoped>
.responsive-menu {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.main-container {
  margin-top: 60px;
  display: flex;
  padding: 20px;
  gap: 20px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto !important; /* 启用滚动 */
}

.sidebar .user-profile-card {
  height: auto;
  background-color: var(--light-card-bg);
  margin-bottom: 20px;
}

.sidebar .el-menu {
  background-color: transparent !important;
}
.sidebar .el-menu .el-menu-item {
  background-color: transparent !important;
  border-bottom: 1px solid #333 !important;
}

.sidebar .el-menu .el-menu-item span.through-line {
  text-decoration: line-through;
}

.user-profile-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.user-email {
  color: #909399;
  font-size: 14px;
}

.nav-menu {
  border-right: none;
}

/* 个人资料部分样式优化 */
.profile-section :deep(.el-descriptions .el-descriptions__body),
.profile-section :deep(.profile-label),
.profile-section :deep(.profile-content) {
  background: transparent !important;
}

.edit-icon, .add-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  will-change: transform;
}

.edit-icon:hover, .add-icon:hover {
  transform: translateY(-4px);
}

.edit-icon::after , .add-icon::after {
  content: 'Edit';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 5px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  /* 使伪元素不接收鼠标事件，解决hover边界抽搐问题 */
  pointer-events: none;
}

.add-icon::after {
  content: 'Add';
}

.edit-icon:hover::after, .add-icon:hover::after {
  opacity: 1;
  visibility: visible;
  margin-left: 8px;
}

/* 我的订单部分样式优化 */
.orders-section :deep(.el-table),
.orders-section :deep(.el-table__body),
/* 表头样式需要绑定header-row-style */
.orders-section :deep(.el-table__header),
.orders-section :deep(.el-table__row),
.orders-section :deep(.el-table__cell) {
  background: transparent !important;
}

/* 调整表格宽度以适应内容 */
.orders-section :deep(.el-table) {
  width: 100% !important;
  max-width: 840px !important; /* 5列宽度总和：180+180+120+120+160=760，加上边框和内边距 */
  table-layout: fixed;
  box-sizing: border-box;
  min-width: 0 !important;
}

/* 修复Element Plus表格内部宽度计算问题 */
.orders-section :deep(.el-table__inner-wrapper) {
  width: 100% !important;
  min-width: 0 !important;
}

.orders-section :deep(.el-table__header-wrapper),
.orders-section :deep(.el-table__body-wrapper) {
  width: 100% !important;
  overflow-x: hidden !important;
  min-width: 0 !important;
}

/* 确保表头和表格内容对齐 */
.orders-section :deep(.el-table__header),
.orders-section :deep(.el-table__body) {
  table-layout: fixed;
  width: 100% !important;
  min-width: 0 !important;
}

/* 确保所有列的宽度总和等于表格宽度 */
.orders-section :deep(.el-table__header-wrapper .el-table__header th.el-table__cell),
.orders-section :deep(.el-table__body-wrapper .el-table__row td.el-table__cell) {
  box-sizing: border-box;
  min-width: 0 !important;
}

/* 阻止Element Plus表格的自动宽度调整 */
.orders-section :deep(.el-table__column-resizer) {
  display: none !important;
}

.orders-section :deep(.el-table__cell) {
  color: #606266 !important;
}

/* 订单商品列表样式 */
.order-item {
  display: inline;
}

.order-item-separator {
  color: #606266;
}

/* 地址管理部分样式优化 */
.address-section :deep(.el-card) {
  border-radius: 0 !important;
  background: transparent !important;
}

/* 增大地址卡片底部按钮图标大小 */
.address-card :deep(.el-button) {
  font-size: 20px; /* 可以根据需要调整大小 */
}

.content-card {
  flex: 1;
  overflow-y: auto !important; /* 启用滚动 */
  background-color: var(--light-card-bg);
  backdrop-filter: blur(2px);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.address-card {
  margin-bottom: 20px;
}

.address-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.address-name {
  font-weight: bold;
}

.address-detail p {
  margin: 5px 0;
}

/* 收藏夹样式 */
.wishlist-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}

.wishlist-item-wrapper {
  position: relative;
  margin-bottom: 20px;
}

/* 当hover商品卡片容器时，商品卡片也有上移动画 */
.wishlist-item-wrapper:hover .product-card {
  transform: translateY(-5px);
}

.delete-wishlist-btn {
  color: #ffffffaa !important;
  position: absolute;
  left: 210px;
  top: 10px;
  z-index: 10;
  opacity: 0.8;
  transition: transform 0.25s ease, opacity 0.25s ease;
  /* 启用硬件加速 */
  transform: translateZ(0);
}

/* 当hover商品卡片时，删除图标也有上移动画 */
.wishlist-item-wrapper:hover .delete-wishlist-btn {
  transform: translateY(-5px);
  opacity: 1;
}

/* 调整收藏夹中ProductCard的大小 */
.wishlist-item-wrapper :deep(.product-card) {
  width: 240px;
  height: 360px;
}

.empty-wishlist {
  margin-top: 50px;
  text-align: center;
}

/* 修复MessageBox确认按钮文字颜色问题 */
/* 穿透样式，修改Element Plus MessageBox确认按钮的文字颜色 */
:deep(.el-message-box .el-button--primary) {
  color: #333 !important;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 20px;
  }
  
  .sidebar {
    width: 90%;
  }

  .content-card {
    width: 90%;
  }
  
  /* 移动端调整sidebar内容 */
  .user-profile-header {
    gap: 10px;
  }
  
  .user-name {
    font-size: 16px;
  }
  
  .user-email {
    font-size: 12px;
  }
  
  .nav-menu .el-menu-item {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
  }
  
  /* 调整content-card内容 */
  .content-title {
    font-size: 16px;
    gap: 8px;
  }
  
  .address-card {
    margin-bottom: 15px;
  }
  
  .address-detail p {
    font-size: 14px;
    margin: 3px 0;
  }

  .orders-section {
    overflow-x: auto;
  }

  /* 调整收藏夹中ProductCard的大小 */
  .wishlist-item-wrapper :deep(.product-card) {
    width: 200px;
    height: 300px;
  }

  .delete-wishlist-btn  {
    left: 180px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding: 10px;
    gap: 10px;
  }
  
  .sidebar {
    width: 95%;
  }
  
  .content-card {
    width: 95%;
  }
  
  .el-col {
    width: 100%;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  /* 进一步减小移动端样式 */
  .user-profile-card {
    margin-bottom: 15px;
  }
  
  .user-profile-header .el-avatar {
    width: 60px !important;
    height: 60px !important;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .user-email {
    font-size: 11px;
  }
  
  .nav-menu .el-menu-item {
    padding: 0 8px;
    height: 36px;
    line-height: 36px;
    font-size: 13px;
  }
  
  .content-title {
    font-size: 14px;
    gap: 6px;
  }
  
  .address-detail p {
    font-size: 13px;
    margin: 2px 0;
  }
  
  .address-header .address-name {
    font-size: 14px;
  }
  
  .el-button {
    font-size: 12px;
    padding: 4px 10px;
  }
  
  /* 收藏夹样式调整 */
  .wishlist-container {
    gap: 15px;
  }
}
</style>
