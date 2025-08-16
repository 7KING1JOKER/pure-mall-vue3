<template>
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'

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
</style>