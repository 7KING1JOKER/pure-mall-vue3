<template>
  <div class="responsive-menu">
    <!-- Logo -->
    <div class="logo">
      <el-image 
        src="https://vuejs.org/images/logo.png" 
        fit="contain" 
        style="width: 50px; height: 50px;"
      />
    </div>
    
    <!-- 顶部导航栏 (宽屏显示) -->
    <el-menu 
      v-if="!isMobile" 
      mode="horizontal" 
      class="desktop-menu"
      :default-active="activeIndex"
      :ellipsis="false"
      :router="false"
      @select="handleSelect"
    >
      <el-menu-item index="/">
        <el-icon><HomeFilled /></el-icon>
      </el-menu-item>
      
      <!-- 搜索菜单项 -->
      <el-sub-menu index="search" popper-class="search-dropdown">
        <template #title>
          <el-icon><Search /></el-icon>
        </template>
        <!-- 下拉搜索框 -->
        <div class="search-dropdown-content">
          <el-input
            v-model="searchQuery"
            placeholder="Search products..."
            class="search-input"
            clearable
            @keyup.enter="handleSearch"
          >
          </el-input>
        </div>
      </el-sub-menu>
      
      <el-menu-item index="/category">
        <el-icon><Menu /></el-icon>
      </el-menu-item>
      
      <el-menu-item index="/cart">
        <el-icon><ShoppingCart /></el-icon>
      </el-menu-item>
      
      <el-menu-item index="/user">
        <el-icon><User /></el-icon>
      </el-menu-item>
    </el-menu>

    <!-- 移动端汉堡菜单按钮 -->
    <div v-else class="mobile-menu-toggle">
      <el-button 
        type="primary" 
        @click="drawerVisible = true"
        :icon="More"
        circle
        size="medium"
      />
    </div>

    <!-- 侧边抽屉菜单 (窄屏显示) -->
    <el-drawer 
      v-model="drawerVisible" 
      direction="ltr" 
      size="30%"
      :router="false"
      :with-header="false"
    >
      <el-menu 
        class="mobile-menu"
        :default-active="activeIndex"
        @select="handleSelect"
      >
        <el-menu-item index="/">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/category">
          <el-icon>
            <Menu />
          </el-icon>
          <span>分类</span>
        </el-menu-item>
        <el-menu-item index="/cart">
          <el-icon>
            <ShoppingCart />
          </el-icon>
          <span>购物车</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <el-icon>
            <User />
          </el-icon>
          <span>我的</span>
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- 注册弹窗组件 -->
    <RegisterDialog 
      v-model:visible="registerDialogVisible" 
      @success="handleRegisterSuccess"
      @to-login="openLoginDialog"
      @cancel="handleRegisterCancel"
    />
    
    <!-- 登录弹窗组件 -->
    <LoginDialog 
      v-model:visible="loginDialogVisible" 
      @success="handleLoginSuccess"
      @cancel="handleLoginCancel"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeFilled,
  Menu,
  ShoppingCart,
  User,
  Search,
  More
} from '@element-plus/icons-vue'

import RegisterDialog from '../layouts/RegisterDialog.vue'
import LoginDialog from '../layouts/LoginDialog.vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式状态
const isMobile = ref(false)
const drawerVisible = ref(false)
const activeIndex = ref(route.path)
const searchQuery = ref('') // 搜索关键词

const isLoggedIn = ref(false) // 假设用户登录状态
const registerDialogVisible = ref(false) // 注册弹窗状态
const loginDialogVisible = ref(false) // 登录弹窗状态
console.log('当前路由路径:', activeIndex.value)

// 检测屏幕宽度
const checkScreenWidth = () => {
  isMobile.value = window.innerWidth < 768
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log("执行搜索:", searchQuery.value)
    // 这里可以添加实际的搜索逻辑
    // 例如: 调用API搜索商品，或跳转到搜索结果页
  }
}

// 菜单选择处理
const handleSelect = (index: string) => {
  activeIndex.value = index

  // 处理user路由跳转
  if(index === '/user') {
    handleUserClick()
    return
  }

  console.log(`导航到: ${index}`)

  router.push(index)

  if (isMobile.value) {
    drawerVisible.value = false // 关闭抽屉菜单
  }
}

// 处理用户点击
const handleUserClick = () => {
  // 检查用户是否登录 - 这里应该是从全局状态获取
  
  if (isLoggedIn.value) {
    router.push('/user')
  } else {
    // 显示注册弹窗
    registerDialogVisible.value = true
  }
  
  // 在移动端选择后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false
  }
}

// 注册成功处理
const handleRegisterSuccess = (userData: { username: string; email: string }) => {
  console.log('注册成功:', userData)
  // 这里可以保存用户信息到全局状态
}

// 打开登录弹窗
const openLoginDialog = () => {
  loginDialogVisible.value = true
}

// 注册取消处理
const handleRegisterCancel = () => {
  console.log('注册已取消')
}

// 登录成功处理
const handleLoginSuccess = (userData: { username: string }) => {
  console.log('登录成功:', userData)
  // 更新登录状态
  isLoggedIn.value = true
  
  // 跳转到用户中心
  router.push('/user')
}

// 登录取消处理
const handleLoginCancel = () => {
  console.log('登录已取消')
}

// 生命周期钩子
onMounted(() => {
  checkScreenWidth()
  window.addEventListener('resize', checkScreenWidth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenWidth)
})
</script>

<style scoped>
.responsive-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

.logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

.logo .el-image {
  width: 50px !important;
  height: 50px !important;
}

.el-menu {
  border-bottom: none !important;
}

.desktop-menu {
  display: flex;
  justify-content: center;
}

.desktop-menu > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

/* 激活状态样式 */
.responsive-menu :deep(.el-menu-item.is-active) .el-icon {
  color: #409eff !important;
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

.mobile-menu-toggle {
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mobile-menu-toggle .el-button {
  color: #000000;
  background-color: #ffffff;
  border: none;
  margin-left: 10px;
}

.mobile-menu-toggle .el-button:hover {
  color: rgb(64, 158, 255);
}

.mobile-menu {
  height: 100%;
}

/* 调整el-menu-item激活样式 */
.desktop-menu .el-menu-item:hover {
  background-color: transparent !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
}

</style>

<style>
/* 全局样式需要放在非scoped中 */
.search-dropdown-content {
  padding: 15px;
  width: 300px;
}

.search-input {
  width: 100%;
}
</style>