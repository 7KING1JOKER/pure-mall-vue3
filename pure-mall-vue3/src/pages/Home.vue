<template>
  <div class="home-container">
    <!-- <template v-if="loading">
      <Loading />
    </template>
    <template v-else> -->
      <!-- 响应式菜单栏 -->
      <PcMenu />
      <!-- 页面内容 -->
      <div class="scroll-container">
        <!-- 轮播图区域 -->
        <section class="scroll-section section-carousel">
          <Carousel />
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
          <Footer />
        </section>
      </div>
    <!-- </template> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import PcMenu from '../layouts/PcMenu.vue'
import Footer from '../layouts/Footer.vue'
import ImageCard from '../components/ImageCard.vue'
import Carousel from '../components/Carousel.vue'
import Loading from '../layouts/Loading.vue'

// data
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

const loading = ref(true)

function checkImagesLoaded() {
  const urls = [...cards1.value, ...cards2.value].map(card => card.image)
  let loaded = 0
  urls.forEach(url => {
    const img = new window.Image()
    img.onload = img.onerror = () => {
      loaded++
      if (loaded === urls.length) {
        loading.value = false
      }
    }
    img.src = url
  })
}

onMounted(() => {
  nextTick(() => {
    checkImagesLoaded()
  })
  
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  min-height: calc(100vh - 60px); /* 确保轮播图区域占满屏幕 */
  padding: 0; /* 移除内边距 */
}

/* 图片list内容 */
.section-cards {
  background-color: skyblue;
  padding: 0;
}

/* section-cards的水平滑动 */

.section-cards .card-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}

.card-list > * {
  flex: 0 0 50%;
  min-width: 0;
  height: 100%;
  transition: all 0.3s ease;
}

/* 页脚区域 */
.section-footer {
  background-color: #2c3e50;
  color: white;
}


/* 调整el-menu-item激活样式 */

/* 桌面菜单激活状态 */
.desktop-menu .el-menu-item:hover {
  background-color: transparent !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
   .scroll-container {
    height: calc(100vh - 52px);
    min-height: calc(100vh - 52px);
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 52px !important;
  }
  
  .scroll-section {
    min-height: calc(100vh - 52px) !important;
    padding: 0 !important;
    display: block; /* 移动端使用块级布局 */
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

  .card-list {
    flex-direction: column; /* 列表在小屏幕上垂直排列 */
    height: auto;
  }

  .card-list > * {
    width: 100%; /* 宽度占满视口 */
    height: 100%; /* 高度继承父容器 */
    flex: none;
  }

  .footer-links {
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: calc(100vh - 52px);
  }
}
</style>
