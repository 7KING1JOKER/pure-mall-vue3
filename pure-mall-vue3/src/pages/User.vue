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
              <div class="user-name">张明</div>
              <div class="user-email">zhangming@example.com</div>
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
            <component 
              :is="tabIcons[activeTab]"
              class="el-icon"
            />
            <span>{{ tabTitles[activeTab] }}</span>
          </div>
        </div>
      </template>
      
      <!-- 个人资料 -->
      <div v-if="activeTab === 'profile'" class="profile-section">
        <el-descriptions title="基本信息" :column="2" border>
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
        
        <el-descriptions title="会员信息" :column="2" border style="margin-top: 20px;">
          <el-descriptions-item
            v-for="(item, index) in memberInfo"
            :key="index"
            :label="item.label"
            label-class-name="profile-label"
            class-name="profile-content"
          >
            {{ item.value }}
          </el-descriptions-item>
        </el-descriptions>
        <el-button type="primary" @click="EditProfileDialogVisible = true">修改资料</el-button>
      </div>
      
      <!-- 我的订单 -->
      <div v-if="activeTab === 'orders'" class="orders-section" style="margin-top: 20px;">
        <el-table 
          :data="orders" style="width: 100%" border="true"
          :header-row-style="{ background: 'transparent' }"
        >
          <el-table-column prop="id" label="订单号" width="180" />
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="product" label="商品" width="250" />
          <el-table-column prop="amount" label="金额" width="100" />
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-tag :type="statusType(scope.row.status)" effect="dark">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button size="small" type="primary">查看</el-button>
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
                <p>邮编：{{ address.zip }}</p>
                <p>电话：{{ address.phone }}</p>
              </div>
              <template #footer>
                <el-button-group>
                  <el-button type="primary" icon="Edit" text>编辑</el-button>
                  <el-button type="danger" icon="Delete" text>删除</el-button>
                  <el-button v-if="!address.isDefault" type="success" icon="Check" text>设为默认</el-button>
                </el-button-group>
              </template>
            </el-card>
          </el-col>
        </el-row>
        <el-button type="primary" icon="Plus" style="margin-top: 20px;">添加新地址</el-button>
      </div>

      <!-- 我的收藏 -->
      <div v-if="activeTab === 'wishlist'">
        <el-empty description="暂无收藏内容" :image-size="200">
          <el-button type="primary">开始收藏</el-button>
        </el-empty>
      </div>
    </el-card>
    <EditProfileDialog :v-model="EditProfileDialogVisible" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
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
  ElEmpty
} from 'element-plus'
import {
  User,
  ShoppingCart,
  Location,
  Star,
  Edit,
  Plus,
  Delete,
  Check
} from '@element-plus/icons-vue'
import PcMenu from '../layouts/PcMenu.vue'



// 响应式数据

const vip = ref('会员')
const activeTab = ref('profile')
const EditProfileDialogVisible = ref(false) // 登录弹窗状态
const tabIcons = reactive({
  profile: User,        // 个人资料图标
  orders: ShoppingCart, // 我的订单图标
  address: Location,    // 地址管理图标
  wishlist: Star       // 我的收藏图标
})
const tabTitles = reactive({
  profile: '个人资料',
  orders: '我的订单',
  address: '地址管理',
  wishlist: '我的收藏'
})

const basicInfo = ref([
  { label: '用户名', value: '张明' },
  { label: '邮箱', value: 'zhangming@example.com' },
  { label: '手机', value: '13800138000' },
  { label: '性别', value: '男' },
  { label: '生日', value: '1990-05-15' }
])

const memberInfo = ref([
  { label: '会员等级', value: '黄金会员' },
  { label: '积分', value: '3,850 分' },
  { label: '优惠券', value: '5 张可用' }
])

const orders = ref([
  { id: '20230528001', date: '2023-05-28', product: 'Apple iPhone 14 Pro Max', amount: '¥8,999', status: '已完成' },
  { id: '20230527002', date: '2023-05-27', product: 'Samsung Galaxy S23 Ultra', amount: '¥7,899', status: '待发货' },
  { id: '20230525003', date: '2023-05-25', product: 'Sony WH-1000XM5 耳机', amount: '¥2,599', status: '已发货' },
  { id: '20230520004', date: '2023-05-20', product: 'MacBook Pro 14英寸', amount: '¥14,999', status: '已完成' },
  { id: '20230515005', date: '2023-05-15', product: 'Nike Air Jordan 1', amount: '¥1,299', status: '已取消' },
  { id: '20230528001', date: '2023-05-28', product: 'Apple iPhone 14 Pro Max', amount: '¥8,999', status: '已完成' },
  { id: '20230527002', date: '2023-05-27', product: 'Samsung Galaxy S23 Ultra', amount: '¥7,899', status: '待发货' },
  { id: '20230525003', date: '2023-05-25', product: 'Sony WH-1000XM5 耳机', amount: '¥2,599', status: '已发货' },
  { id: '20230520004', date: '2023-05-20', product: 'MacBook Pro 14英寸', amount: '¥14,999', status: '已完成' },
  { id: '20230515005', date: '2023-05-15', product: 'Nike Air Jordan 1', amount: '¥1,299', status: '已取消' },
  { id: '20230515005', date: '2023-05-15', product: 'Nike Air Jordan 1', amount: '¥1,299', status: '已取消' },
  { id: '20230528001', date: '2023-05-28', product: 'Apple iPhone 14 Pro Max', amount: '¥8,999', status: '已完成' },
  { id: '20230527002', date: '2023-05-27', product: 'Samsung Galaxy S23 Ultra', amount: '¥7,899', status: '待发货' },
  { id: '20230525003', date: '2023-05-25', product: 'Sony WH-1000XM5 耳机', amount: '¥2,599', status: '已发货' },
  { id: '20230520004', date: '2023-05-20', product: 'MacBook Pro 14英寸', amount: '¥14,999', status: '已完成' },
  { id: '20230515005', date: '2023-05-15', product: 'Nike Air Jordan 1', amount: '¥1,299', status: '已取消' }
])

const addresses = ref([
  {
    name: '张明 (家)',
    phone: '13800138000',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    street: '建国路88号现代城A座1508室',
    zip: '100022',
    isDefault: true
  },
  {
    name: '张明 (公司)',
    phone: '13800138111',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    street: '中关村大街1号海龙大厦12层',
    zip: '100080',
    isDefault: false
  }
])

// 方法
const statusType = (status) => {
  const map = {
    '已完成': 'success',
    '待发货': 'warning',
    '已发货': '',
    '已取消': 'danger'
  }
  return map[status] || 'info'
}

const handleMenuSelect = (index) => {
  activeTab.value = index
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

/* 我的订单部分样式优化 */
.orders-section :deep(.el-table),
.orders-section :deep(.el-table__body),
/* 表头样式需要绑定header-row-style */
.orders-section :deep(.el-table__header),
.orders-section :deep(.el-table__row),
.orders-section :deep(.el-table__cell) {
  background: transparent !important;
}

/* 地址管理部分样式优化 */
.address-section :deep(.el-card) {
  background: transparent !important;
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
  color: #606266;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
  
  .sidebar {
    flex-direction: row;
    width: 80%;
  }

  .content-card {
    overflow-y: hidden; /* 关闭滚动 */
    width: 90%;
  }
}

@media (max-width: 768px) {
  .el-col {
    width: 100%;
  }
  
  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
