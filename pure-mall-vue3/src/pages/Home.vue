<template>
  <div class="home-container">
    <!-- 响应式菜单栏 -->
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
        :router="true"
        @select="handleSelect"
      >
        <el-menu-item index="home" route="/">
          <el-icon><HomeFilled /></el-icon>
        </el-menu-item>
        <el-menu-item index="category" route="/category">
          <el-icon><Menu /></el-icon>
        </el-menu-item>
        <el-menu-item index="cart" route="/cart">
          <el-icon><ShoppingCart /></el-icon>
        </el-menu-item>
        <el-menu-item index="user" route="/user">
          <el-icon><User /></el-icon>
        </el-menu-item>
      </el-menu>

      <!-- 移动端汉堡菜单按钮 -->
      <div v-else class="mobile-menu-toggle">
        <el-button 
          type="primary" 
          @click="drawerVisible = true"
          icon="Menu"
          circle
        />
      </div>

      <!-- 侧边抽屉菜单 (窄屏显示) -->
      <el-drawer 
        v-model="drawerVisible" 
        direction="ltr" 
        size="70%"
        :with-header="false"
      >
        <el-menu 
          class="mobile-menu"
          :default-active="activeIndex"
          @select="handleSelect"
        >
          <el-menu-item index="home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="categories">
            <el-icon><Menu /></el-icon>
            <span>分类</span>
          </el-menu-item>
          <el-menu-item index="cart">
            <el-icon><ShoppingCart /></el-icon>
            <span>购物车</span>
          </el-menu-item>
          <el-menu-item index="profile">
            <el-icon><User /></el-icon>
            <span>我的</span>
          </el-menu-item>
        </el-menu>
      </el-drawer>
    </div>

    <!-- 页面内容 -->
    <div class="content">
      <h1>欢迎来到pure mall</h1>
      <p>这是一个基于 Vue 3 的商城应用</p>
      
      <div class="demo-content">
        <el-card v-for="i in 5" :key="i" class="demo-card">
          <template #header>
            <div class="card-header">
              <span>商品 {{ i }}</span>
            </div>
          </template>
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">
          <div style="padding: 14px;">
            <span>美味的汉堡</span>
            <div class="bottom">
              <el-button text class="button">查看详情</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  HomeFilled,
  Menu,
  ShoppingCart,
  User
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

// 路由相关
const route = useRoute()

// 响应式状态
const isMobile = ref(false)
const drawerVisible = ref(false)
const activeIndex = ref(route.path)

// 检测屏幕宽度
const checkScreenWidth = () => {
  isMobile.value = window.innerWidth < 768
}

// 菜单选择处理
const handleSelect = (index: string) => {
  activeIndex.value = index
  console.log(`导航到: ${index}`)
  // 在移动端选择后关闭抽屉
  if (isMobile.value) {
    drawerVisible.value = false
  }
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
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.responsive-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.responsive-menu .logo {
    position: absolute;
    left: 50%;
    z-index: 1001;
}

.responsive-menu .logo .el-image {
  width: 10px;
  height: 10px;
}

.responsive-menu .el-menu > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.desktop-menu {
  display: flex;
  justify-content: center;
}

.mobile-menu-toggle {
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mobile-menu-toggle .el-button {
  margin-left: 10px;
}

.mobile-menu {
  height: 100%;
}

.content {
  margin-top: 60px; /* 为顶部菜单留出空间 */
  padding: 20px;
  flex: 1;
  text-align: center;
}

.demo-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.demo-card {
  width: 240px;
}

.image {
  width: 100%;
  display: block;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button {
  padding: 0;
  min-height: auto;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content {
    margin-top: 50px; /* 移动端顶部按钮较小 */
  }
  
  .demo-card {
    width: 100%;
    max-width: 300px;
  }
}

</style>