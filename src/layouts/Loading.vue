<template>
  <div class="loading-page">
    <div class="loading-spinner"></div>
    <div class="loading-text">图片加载中...</div>
  </div>
</template>

<script setup lang="ts">
// 无需props，纯展示
</script>

<style scoped>
.loading-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #333, #fff 80%);
}
.loading-spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #333;
  border-top: 5px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loading-text {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}
</style>
