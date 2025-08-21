<template>
  <PcMenu />
  <div class="main-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="user-profile">
        <el-avatar :size="100" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" class="user-avatar"></el-avatar>
        <div class="user-name">张明</div>
        <div class="user-email">zhangming@example.com</div>
      </div>
      
      <div class="nav-links">
        <div class="nav-link" :class="{active: activeTab === 'profile'}" @click="activeTab = 'profile'">
          <i class="fas fa-user-circle"></i> 个人资料
        </div>
        <div class="nav-link" :class="{active: activeTab === 'orders'}" @click="activeTab = 'orders'">
          <i class="fas fa-shopping-bag"></i> 我的订单
        </div>
        <div class="nav-link" :class="{active: activeTab === 'address'}" @click="activeTab = 'address'">
          <i class="fas fa-map-marker-alt"></i> 地址管理
        </div>
        <div class="nav-link" :class="{active: activeTab === 'security'}" @click="activeTab = 'security'">
          <i class="fas fa-shield-alt"></i> 账户安全
        </div>
        <div class="nav-link" :class="{active: activeTab === 'wishlist'}" @click="activeTab = 'wishlist'">
          <i class="fas fa-heart"></i> 我的收藏
        </div>
      </div>
    </div>
    
    <!-- 用户中心内容区 -->
    <div class="content">
      <div class="content-header">
        <div class="content-title">
          <i class="fas fa-user-circle" style="margin-right: 10px;"></i>
          {{ tabTitles[activeTab] }}
        </div>
        <el-button type="primary" icon="el-icon-edit" v-if="activeTab === 'profile'">编辑资料</el-button>
      </div>
      
      <!-- 个人资料 -->
      <div v-if="activeTab === 'profile'">
        <div class="info-card">
          <h3><i class="fas fa-info-circle"></i> 基本信息</h3>
          <div class="info-item">
            <div class="info-label">用户名：</div>
            <div class="info-value">张明</div>
          </div>
          <div class="info-item">
            <div class="info-label">邮箱：</div>
            <div class="info-value">zhangming@example.com</div>
          </div>
          <div class="info-item">
            <div class="info-label">手机：</div>
            <div class="info-value">13800138000</div>
          </div>
          <div class="info-item">
            <div class="info-label">性别：</div>
            <div class="info-value">男</div>
          </div>
          <div class="info-item">
            <div class="info-label">生日：</div>
            <div class="info-value">1990-05-15</div>
          </div>
        </div>
        
        <div class="info-card">
          <h3><i class="fas fa-trophy"></i> 会员信息</h3>
          <div class="info-item">
            <div class="info-label">会员等级：</div>
            <div class="info-value">黄金会员</div>
          </div>
          <div class="info-item">
            <div class="info-label">积分：</div>
            <div class="info-value">3,850 分</div>
          </div>
          <div class="info-item">
            <div class="info-label">优惠券：</div>
            <div class="info-value">5 张可用</div>
          </div>
        </div>
      </div>
      
      <!-- 我的订单 -->
      <div v-if="activeTab === 'orders'">
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="id" label="订单号" width="180"></el-table-column>
          <el-table-column prop="date" label="日期" width="120"></el-table-column>
          <el-table-column prop="product" label="商品" width="250"></el-table-column>
          <el-table-column prop="amount" label="金额" width="100"></el-table-column>
          <el-table-column label="状态" width="120">
            <template #default="scope">
              <el-tag :type="statusType(scope.row.status)" effect="dark">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default>
              <el-button size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 地址管理 -->
      <div v-if="activeTab === 'address'">
        <el-row :gutter="20">
          <el-col :span="12" v-for="(address, index) in addresses" :key="index">
            <el-card class="address-card" shadow="hover">
              <div class="address-header">
                <span class="address-name">{{ address.name }}</span>
                <el-tag v-if="address.isDefault" type="success" size="small">默认地址</el-tag>
              </div>
              <div class="address-detail">
                <p>{{ address.province }} {{ address.city }} {{ address.district }}</p>
                <p>{{ address.street }}</p>
                <p>邮编：{{ address.zip }}</p>
                <p>电话：{{ address.phone }}</p>
              </div>
              <div class="address-actions">
                <el-button type="text" icon="el-icon-edit">编辑</el-button>
                <el-button type="text" icon="el-icon-delete">删除</el-button>
                <el-button v-if="!address.isDefault" type="text" icon="el-icon-check">设为默认</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-button type="primary" icon="el-icon-plus" style="margin-top: 20px;">添加新地址</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ElTable, 
  ElTableColumn, 
  ElTag, 
  ElButton, 
  ElCard, 
  ElRow, 
  ElCol 
} from 'element-plus'
import PcMenu from '../components/PcMenu.vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('profile')
const tabTitles = reactive({
  profile: '个人资料',
  orders: '我的订单',
  address: '地址管理',
  security: '账户安全',
  wishlist: '我的收藏'
})
const orders = ref([
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
</script>

<style scoped>
/* 为导航栏添加阴影 */
.responsive-menu {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.main-container {
  margin-top: 60px;
  display: flex;
  flex: 1;
  padding: 20px;
  gap: 20px;
}

.sidebar {
  width: 250px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px 0;
  height: fit-content;
}

.user-profile {
  text-align: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #6a11cb;
  margin-bottom: 15px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
}

.user-email {
  color: #777;
  font-size: 14px;
}

.nav-links {
  padding: 15px 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 25px;
  cursor: pointer;
  transition: all 0.3s;
  color: #555;
}

.nav-link i {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.nav-link:hover, .nav-link.active {
  background: linear-gradient(to right, #f0f5ff, #e6eeff);
  color: #2575fc;
  border-left: 4px solid #2575fc;
}

.content {
  flex: 1;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.content-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.info-card {
  background: linear-gradient(to right, #f8f9ff, #f0f5ff);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #2575fc;
}

.info-card h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.info-item {
  display: flex;
  margin-bottom: 10px;
}

.info-label {
  width: 100px;
  color: #7f8c8d;
  font-weight: 500;
}

.info-value {
  flex: 1;
  color: #2c3e50;
}

.address-card {
  margin-bottom: 20px;
}

.address-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.address-name {
  font-weight: bold;
  margin-right: 10px;
}

.address-detail p {
  margin: 5px 0;
  color: #555;
}

.address-actions {
  margin-top: 10px;
  text-align: right;
}

@media (max-width: 992px) {
  .main-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 20px 15px;
  }
  
  .el-col {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>