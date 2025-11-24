<template>
   <RouterView />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useUserStore } from './store/user';

const userStore = useUserStore();

// 浏览器页面隐藏事件处理函数
const handlePageHide = () => {
  userStore.logout();
};

onMounted(() => {
  // 添加页面隐藏事件监听器，只有在页面真正关闭或隐藏时才执行
  window.addEventListener('pagehide', handlePageHide);
});

onUnmounted(() => {
  // 移除页面隐藏事件监听器，避免内存泄漏
  window.removeEventListener('pagehide', handlePageHide);
});
</script>

<style scoped>

</style>
