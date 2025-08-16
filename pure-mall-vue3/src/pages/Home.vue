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
        :ellipsis="false"
        @select="handleSelect"
      >
        <el-menu-item index="home" route="/">
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
    <div class="scroll-container">
      <!-- 轮播图区域 -->
      <section class="scroll-section section-carousel">
          <el-carousel 
            :interval="5000" 
            indicator-position="inside"
            class="fullscreen-carousel"
          >
            <el-carousel-item v-for="item in carouselItems" :key="item.id">
              <div class="carousel-item">
                <img 
                  :src="item.image" 
                  class="carousel-image"
                  :alt="item.title"
                >
                <div class="carousel-overlay">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
      </section>

      <!-- 卡片列表区域1 -->
      <section class="scroll-section section-cards">
        <div class="card-list">
          <ImageCard
            v-for="(card, index) in cards1" 
            :key="index" 
            :imageUrl="card.image" 
            :title="card.title"
            :overlayOpacity="0.7"
            :titleColor="'white'"
          />
        </div>
      </section>

      <!-- 卡片列表区域2 -->
      <section class="scroll-section section-cards">
        <div class="card-list">
          <ImageCard
            v-for="(card, index) in cards2" 
            :key="index" 
            :imageUrl="card.image" 
            :title="card.title"
            :overlayOpacity="0.7"
            :titleColor="'white'"
          />
        </div>
      </section>

      <!-- 页脚区域 -->
      <section class="scroll-section section-footer">
        <div class="footer-content">
          <div class="footer-logo">
            <el-image 
              src="https://vuejs.org/images/logo.png" 
              fit="contain" 
              style="width: 80px; height: 80px;"
            />
            <h3>Pure Mall</h3>
          </div>
          <div class="footer-links">
            <div class="link-group">
              <h4>购物指南</h4>
              <a href="#">购物流程</a>
              <a href="#">会员介绍</a>
              <a href="#">常见问题</a>
            </div>
            <div class="link-group">
              <h4>配送方式</h4>
              <a href="#">上门自提</a>
              <a href="#">配送服务</a>
              <a href="#">运费说明</a>
            </div>
            <div class="link-group">
              <h4>售后服务</h4>
              <a href="#">退款说明</a>
              <a href="#">保修政策</a>
              <a href="#">取消订单</a>
            </div>
          </div>
          <div class="footer-copyright">
            <p>© 2023 Pure Mall. All rights reserved.</p>
          </div>
        </div>
      </section>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  HomeFilled,
  Menu,
  ShoppingCart,
  User,
  Search,
  More
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import ImageCard from '../components/ImageCard.vue'


// data
// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: "春",
    description: "简约设计，舒适体验",
    image: "https://picsum.photos/1200/800?random=1"
  },
  {
    id: 2,
    title: "夏",
    description: "透气材质，清爽一夏",
    image: "https://picsum.photos/1200/800?random=2"
  },
  {
    id: 3,
    title: "秋",
    description: "温暖质感，优雅风格",
    image: "https://picsum.photos/1200/800?random=3"
  },
  {
    id: 4,
    title: "冬",
    description: "厚实面料，抵御严寒",
    image: "https://picsum.photos/1200/800?random=4"
  }
])

// 卡片数据
const cards1 = ref([
  {
    title: "春季",
    image: "https://plus.unsplash.com/premium_photo-1675804669850-a1c3b87589d5?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    title: "夏日",
    image: "https://images.unsplash.com/photo-1682685797229-b2930538da47?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNjZW5lcnl8ZW58MHx8MHx8fDA%3D"
  }
])

const cards2 = ref([
  {
    title: "秋季",
    image: "https://images.unsplash.com/photo-1617634667039-8e4cb277ab46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNjZW5lcnl8ZW58MHx8MHx8fDA%3D"
  },
  {
    title: "冬日",
    image: "https://images.unsplash.com/photo-1504714146340-959ca07e1f38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHNjZW5lcnl8ZW58MHx8MHx8fDA%3D"
  }
])

// 路由相关
const route = useRoute()

// 响应式状态
const isMobile = ref(false)
const drawerVisible = ref(false)
const activeIndex = ref(route.path)
const searchQuery = ref('') // 搜索关键词



// methods
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

/* 响应式菜单栏样式 */
.responsive-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}

.responsive-menu .logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
}

.responsive-menu .logo .el-image {
  width: 50px !important;
  height: 50px !important;
}

.responsive-menu .el-menu {
  border-bottom: none !important;
}

.responsive-menu .el-menu > .el-menu-item:nth-child(1) {
  margin-right: auto;
}

.desktop-menu {
  display: flex;
  justify-content: center;
}

/* 搜索下拉框样式 */
.search-dropdown-content {
  padding: 15px;
  width: 300px;
}

.search-input {
  width: 100%;
}

/* 侧栏样式 */
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

.scroll-container {
  /* 全屏滑动 */
  height: calc(100vh - 60px); /* 减去顶部菜单高度 */
  overflow-y: auto; /* 启用滚动 */
  scroll-snap-type: y mandatory; /* 关键属性 */
  scroll-behavior: smooth; /* 平滑滚动 */
  margin-top: 60px; /* 顶部菜单高度 */
}

/* 滚动区域 */
.scroll-section {
  height: calc(100vh - 60px); /* 每个区域占满一屏 */
  min-height: calc(100vh - 60px);
  scroll-snap-align: start; /* 关键属性 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  box-sizing: border-box;
}

/* 轮播图区域 */
.section-carousel {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
}

.section-carousel {
  position: relative;
  padding: 0; /* 移除内边距 */
}

.fullscreen-carousel {
  width: 100%;
  height: 100%; /* 占据整个父容器高度 */
  position: absolute;
  top: 0;
  left: 0;
}

.fullscreen-carousel:deep(.el-carousel__container) {
  height: 100% !important;
}

.carousel-item {
  position: relative;
  height: 100%;
  width: 100%;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: rgba(0, 0, 0, 0.3); /* 半透明遮罩 */
  color: white;
  padding: 20px;
}

.carousel-overlay h3 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  animation: fadeInUp 1s ease forwards;
}

.carousel-overlay p {
  font-size: 1.5rem;
  margin-bottom: 20px;
  animation: fadeInUp 1s ease 0.3s forwards;
}

/* 箭头导航样式 */
:deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.3);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

:deep(.el-carousel__arrow i) {
  font-size: 20px;
}

/* 图片list内容 */
.section-cards {
  background-color: skyblue;
  padding: 0;
}

.section-cards .card-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}

.card-list > * {
  flex: 1;
  min-width: 0;
  height: 100%;
  transition: all 0.3s ease;
}

/* 页脚区域 */
.section-footer {
  background-color: #2c3e50;
  color: white;
}

.footer-content {
  max-width: 1200px;
  width: 100%;
  padding: 40px 20px;
}

.footer-logo {
  text-align: center;
  margin-bottom: 40px;
}

.footer-logo h3 {
  margin-top: 15px;
  font-size: 1.8rem;
  font-weight: 300;
}

.footer-links {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.link-group {
  min-width: 200px;
  margin-bottom: 30px;
}

.link-group h4 {
  font-size: 1.2rem;
  margin-bottom: 20px;
  font-weight: 400;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

.link-group a {
  display: block;
  color: #bdc3c7;
  margin-bottom: 10px;
  text-decoration: none;
  transition: color 0.3s;
}

.link-group a:hover {
  color: white;
}

.footer-copyright {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}



/* 调整el-menu-item激活样式 */

/* 桌面菜单激活状态 */
.desktop-menu .el-menu-item:hover {
  background-color: transparent !important;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .section-cards .card-list {
    flex-direction: column;
  }
  
  .card-list > * {
    height: 50%; /* 移动端各占50%高度 */
    min-height: 300px; /* 最小高度 */
  }
}

@media (max-width: 768px) {
   .scroll-container {
    height: calc(100vh - 50px); /* 减去顶部菜单高度 */
    margin-top: 50px; /* 移动端顶部菜单较小 */
    scroll-snap-type: none; /* 移动端禁用滚动捕捉 */
  }
  
  .scroll-section {
    height: calc(100vh - 50px);
    min-height: calc(100vh - 50px);
    padding: 80px 20px;
  }
  
  .carousel-title {
    font-size: 2.2rem;
  }
  
  .carousel-subtitle {
    font-size: 1.2rem;
  }
  
  .carousel-image {
    height: 300px;
  }
  
  .card-list > * {
    min-height: 250px; /* 更小的屏幕调整最小高度 */
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

</style>