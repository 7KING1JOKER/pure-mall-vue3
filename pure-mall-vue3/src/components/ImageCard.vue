<template>
  <div class="image-container">
    <el-image
      :src="imageUrl"
      fit="cover"
      class="image"
    ></el-image>
    <div class="image-info">
      <h1 class="image-title">{{ title }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">

// 定义组件属性
defineProps({
  imageUrl: {
    type: String,
    default: 'https://picsum.photos/1200/800?random=1'
  },
  title: {
    type: String,
    default: 'Sample Image Card'
  },
  titleColor: {
    type: String,
    default: 'white'
  }
})



</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.image-info {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  padding: 20px;
  color: v-bind('titleColor');
  transition: all 0.3s ease;
}

.image-title {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  transition: all 0.5s ease;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .image-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .image-info {
    padding: 15px;
  }
  
  .image-title {
    font-size: 1.3rem;
  }

  .image-container {
    height: 100%; /* 继承父容器高度 */
  }
}
</style>