<template>
  <div class="order-detail-container">
    <!-- 响应式菜单 -->
    <PcMenu />
    
    <!-- 订单详情内容 -->
    <div class="order-detail-content" v-if="currentOrder">
      <!-- 订单配送目前到达地址 -->
      <div class="order-delivery-address">
        <div class="map-container" id="GaoDeMap">
          <!-- 高德地图容器 -->
          <div id="mapContainer" class="map-container-element"></div>
          <div class="address-info">
            <span v-if="currentOrder.deliveryAddress"> {{ currentOrder.deliveryAddress }}</span>
            <span v-else> 配送地址获取中... </span>
          </div>
        </div>
      </div>

      <!-- 订单其它信息 -->
      <div class="order-list">
        <!-- 订单基本信息 -->
        <h1 class="order-title">订单信息</h1>

        <div class="order-info-item-container">
          <div class="order-info-item">
            <span class="info-label">订单编号：</span>
            <span class="info-value">{{ currentOrder.orderNumber }}</span>
          </div>
          <div class="order-info-item">
            <span class="info-label">下单时间：</span>
            <span class="info-value">{{ currentOrder.orderTime }}</span>
          </div>
          <div class="order-info-item">
            <span class="info-label">支付时间：</span>
            <span class="info-value">{{ currentOrder.paymentTime || '未支付' }}</span>
          </div>
          <div class="order-info-item">
            <span class="info-label">支付方式：</span>
            <span class="info-value">{{ currentOrder.paymentMethod }}</span>
          </div>
          <div class="order-info-item">
            <span class="info-label">订单状态：</span>
            <span class="info-value order-status">{{ currentOrder.status }}</span>
          </div>
          <div v-if="currentOrder.remark" class="order-info-item">
            <span class="info-label">订单备注：</span>
            <span class="info-value">{{ currentOrder.remark }}</span>
          </div>
        </div>

        <!-- 商品列表 -->
        <div class="order-products">
          <h1 class="products-title">商品信息</h1>
          <div class="product-item-container" id="sortableProductList">
            
            <div class="product-item" v-for="(item, index) in currentOrder.items" :key="index">
              <div class="product-image">
                <el-image :src="item.image" fit="cover" />
              </div>
              <!-- 还需要展示商品名称、数量、单价、颜色、尺码 -->
              <div class="product-info">
                <span>{{ item.name }}</span>
                <span>x{{ item.quantity }} & {{ item.spec }}</span>
                <span>¥{{ item.price.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单金额 -->
        <div class="order-amount">
          <div class="amount-item-container">
            <div class="amount-item">
              <span class="amount-label">商品总价：</span>
              <span class="amount-value">¥{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="amount-item">
              <span class="amount-label">订单总额：</span>
              <span class="amount-value total">¥{{ currentOrder.orderAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    
    <!-- 订单不存在时的提示 -->
    <div class="order-not-found" v-else>
      <h1>订单不存在或已被删除</h1>
      <el-button type="primary" @click="router.push('/')">返回首页</el-button>
    </div>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PcMenu from '../layouts/PcMenu.vue';
import Footer from '../layouts/Footer.vue';
import { useOrderStore } from '../store/order';
import { storeToRefs } from 'pinia';

// 其它js库的引入
import Sortable from 'sortablejs';
import AMapLoader from '@amap/amap-jsapi-loader';

// 路由相关
const route = useRoute();
const router = useRouter();

// 订单详情相关
const orderStore = useOrderStore();
const { currentOrder } = storeToRefs(orderStore);

// 获取订单编号，支持从params和query两种方式
const orderId = computed(() => {
  // 优先从query参数获取orderNumber，这是从OrderComplete页面跳转过来的方式
  if (route.query.orderNumber) {
    return route.query.orderNumber as string;
  }
  // 其次从params获取id，这是其他可能的跳转方式
  return route.params.id as string;
});

// 计算商品总价
const subtotal = computed(() => {
  if (!currentOrder.value) return 0;
  return currentOrder.value.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// 地图相关变量
let map: any = null;
let AMap: any = null;
let geocoder: any = null;

// 可拖动实例变量
let sortableInstance: any = null;

// 初始化可拖动功能
const initSortable = () => {
  // 如果已经有实例，先销毁
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  
  const productContainer = document.getElementById('sortableProductList');
  if (productContainer) {
    sortableInstance = new Sortable(productContainer, {
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      onEnd: function(evt: any) {
        console.log('拖动结束，原始位置:', evt.oldIndex, '新位置:', evt.newIndex);
        // 这里可以添加拖动结束后的处理逻辑，比如更新商品顺序
      }
    });
  }
};

// 初始化高德地图
const initMap = async () => {
  if (!currentOrder.value) return;
  
  try {
    // 使用 AMapLoader 加载高德地图
    AMap = await AMapLoader.load({
      key: '23a0f1f67aead8dc5a1e8ef4c4b39085', // 替换为您自己的高德地图API Key
      version: '2.0',
      plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.Geocoder'],
      AMapUI: { // 如果需要使用 AMapUI 组件库
        version: '1.1',
        plugins: []
      }
    });
    
    // 创建地图实例
    map = new AMap.Map('mapContainer', {
      zoom: 15,
      center: [113.27, 23.13], // 默认中心点，广州附近
      resizeEnable: true,
    });
    
    // 添加控件
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Scale());
    
    // 初始化地理编码
    geocoder = new AMap.Geocoder();
    
    // 根据地址定位
    locateAddress();
  } catch (error) {
    console.error('高德地图初始化失败:', error);
  }
};

// 根据地址定位
const locateAddress = () => {
  if (!AMap || !geocoder || !currentOrder.value) {
    console.error('地图相关对象未初始化');
    return;
  }
  
  // 使用 deliveryAddress 作为定位地址
  const address = currentOrder.value.deliveryAddress;
  
  // 检查地址参数是否有效
  if (!address || typeof address !== 'string' || address.trim() === '') {
    console.error('无效的地址参数：地址为空或不是有效的字符串');
    return;
  }
  
  // 地理编码：将地址转换为坐标
  geocoder.getLocation(address.trim(), (status: string, result: any) => {
    if (status === 'complete' && result.geocodes && result.geocodes.length > 0) {
      const location = result.geocodes[0].location;
      // 设置地图中心点
      map.setCenter([location.lng, location.lat]);
      
      // 添加标记
      new AMap.Marker({
        position: [location.lng, location.lat],
        title: address,
        map: map
      });
    } else {
      console.error('地址解析失败:', result || status);
      // 如果地址解析失败，可以使用默认位置
      console.log('使用默认位置...');
    }
  });
};


// 加载订单详情
onMounted(() => {
  if (orderId.value) {
    // 尝试通过订单编号获取订单
    const order = orderStore.getOrderByNumber(orderId.value);
    if (order) {
      // 如果找到订单，更新当前订单
      orderStore.currentOrder = order;
      console.log('找到订单，成功加载订单详情');
    } else {
      console.log('未找到订单，设置currentOrder为null');
      // 明确设置currentOrder为null，这样会显示订单不存在的提示
      orderStore.currentOrder = null;
    }
  } else {
    // 如果没有订单ID，设置currentOrder为null
    orderStore.currentOrder = null;
    console.log('没有提供订单ID');
  }
  
  // 初始化地图和可拖动功能
  nextTick(() => {
    initMap();
    initSortable();
  });
});

// 组件卸载时清理
onUnmounted(() => {
  // 销毁可拖动实例
  if (sortableInstance) {
    sortableInstance.destroy();
    sortableInstance = null;
  }
  
  // 销毁地图实例
  if (map) {
    map.destroy();
    map = null;
  }
  
  // 移除窗口大小变化监听
  window.removeEventListener('resize', handleResize);
});


// 监听 currentOrder 变化，重新定位
watch(currentOrder, () => {
  if (currentOrder.value && map) {
    locateAddress();
  }
});

// 窗口大小变化处理函数
const handleResize = () => {
  if (map) {
    map.resize();
  }
};

// 监听窗口大小变化，重新调整地图大小
window.addEventListener('resize', handleResize);
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

/* 左侧地址区域 */
.order-delivery-address {
  flex: 1;
  position: relative;
}

.address-title {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  padding: 20px;
  margin: 0;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-container-element {
    width: 100%;
    height: 100%;
  }

.address-info {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  padding: 12px;
}
.address-info span {
  font-size: 16px;
  font-weight: 350;
  text-decoration: underline;
}


/* 右侧订单信息区域 */
.order-list {
  backdrop-filter: blur(0.8px);
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 30px;
}

.order-list > * {
  padding: 15px;
  padding-top: 30px;
}

.order-title, .products-title {
  font-size: 14px;
  font-weight: 450;
}

.product-item-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.order-info-item-container, .amount-item-container {
  display: flex;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 6px;
}

.order-info-item, .amount-item {
  display: flex;
  font-size: 14px;
}

.info-label, .amount-label {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
}

.info-value, .amount-value {
  font-size: 14px;
  font-weight: 320;
  line-height: 1.5;
}

/* 商品列表 */
.product-item {
  display: flex;
  flex-direction: column;
  padding: 15px 0;
}

.product-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.product-info span {
  font-size: 12px;
  font-weight: 350;
}

/* 订单不存在时的提示 */
.order-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 60px);
  gap: 30px;
}

.order-not-found h1 {
  font-size: 16px;
  font-weight: 400;
}

/* footer区域 */
.section-footer {
  height: 80vh;
}
</style>