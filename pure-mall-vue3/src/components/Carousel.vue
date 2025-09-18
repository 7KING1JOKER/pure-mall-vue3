<template>
    <el-carousel 
    :interval="5000" 
    indicator-position="none"
    motion-blur="true"
    @change="handleCarouselChange"
    class="fullscreen-carousel"
    >
    <el-carousel-item v-for="(item,index) in carouselItems" :key="index">
        <div class="carousel-item">
        <img 
            :src="item.image" 
            class="carousel-image"
            :alt="item.title"
        >
        <div class="carousel-overlay">
          <h3 :class="{'animate-in': activeItemId === item.id}">{{ item.title }}</h3>
          <p :class="{'animate-in': activeItemId === item.id}">{{ item.description }}</p>
        </div>
        </div>
    </el-carousel-item>
    </el-carousel>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: "春",
    description: "简约设计，舒适体验",
    image: "https://images.unsplash.com/photo-1640406896486-532488702c4c?q=80&w=980&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "夏",
    description: "透气材质，清爽一夏",
    image: "https://images.unsplash.com/photo-1604513830532-8fce22d9941f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    title: "秋",
    description: "温暖质感，优雅风格",
    image: "https://images.unsplash.com/photo-1505898683753-a875a57542e4?q=80&w=995&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 4,
    title: "冬",
    description: "厚实面料，抵御严寒",
    image: "https://images.unsplash.com/photo-1741604047914-5805eb7ff554?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
])

// 当前激活的轮播项ID
const activeItemId = ref(carouselItems.value[0].id)

// 处理轮播切换事件
const handleCarouselChange = (currentIndex: number) => {
  // 重置所有动画状态
  activeItemId.value = -1
  
  // 下一帧再设置新激活项，触发动画
  requestAnimationFrame(() => {
    activeItemId.value = carouselItems.value[currentIndex].id
  })
}
</script>

<style scoped>
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
  font-size: 3rem;
  margin-bottom: 10px;
}

.carousel-overlay p {
  font-size: 1rem;
  margin-bottom: 20px;
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

/* 动画类 */
.animate-in {
  animation: slide-fade-in 0.8s ease forwards;
}

.animate-in:nth-child(1) {
  animation: slide-fade-in 800ms ease 300ms forwards;
}

/* .animate-in:nth-child(2) {
  animation: slide-fade-in 800ms ease 600ms forwards;
} */

/* 动画定义 */
@keyframes slide-fade-in {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
    filter: blur(2px);
  }
  50% {
    opacity: 0.8;
    transform: translateY(5px) scale(0.98);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
</style>