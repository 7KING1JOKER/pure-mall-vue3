<template>
  <div class="order-detail-container">
    <!-- 响应式菜单 -->
    <PcMenu />
    
    <!-- 订单详情内容 -->
    <div class="order-detail-content">
        
    </div>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import PcMenu from '../layouts/PcMenu.vue'
import Footer from '../layouts/Footer.vue'

// 路由相关
const route = useRoute()
const router = useRouter()


</script>

<style scoped>
.order-detail-container {
  margin-top: 60px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.order-detail-content {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;
}

/* footer区域 */
.section-footer {
  height: 80vh;
}
</style>