<template>
  <div class="product-detail-container">
    <!-- 响应式菜单 -->
    <PcMenu />
    
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/category' }">商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>商品详情</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 商品详情主体 -->
    <div class="product-detail-main" v-if="product">
      <!-- 左侧商品图片 -->
      <div class="product-gallery">
        <el-carousel :interval="4000" type="card" height="400px" indicator-position="outside">
          <el-carousel-item v-for="(image, index) in product.images" :key="index">
            <el-image :src="image" fit="contain" class="gallery-image" />
          </el-carousel-item>
        </el-carousel>
        
        <!-- 缩略图 -->
        <div class="thumbnails">
          <div 
            v-for="(image, index) in product.images" 
            :key="index"
            class="thumbnail-item"
            :class="{ active: currentImageIndex === index }"
            @click="setCurrentImageIndex(index)"
          >
            <el-image :src="image" fit="cover" />
          </div>
        </div>
      </div>
      
      <!-- 右侧商品信息 -->
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        
        <div class="product-brief">{{ product.brief }}</div>
        
        <div class="product-price-box">
          <div class="price-label">价格</div>
          <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
          <div class="product-original-price" v-if="product.originalPrice">¥{{ product.originalPrice.toFixed(2) }}</div>
        </div>
        
        <div class="product-sales">已售 {{ product.sales }} 件</div>
        
        <!-- 规格选择 -->
        <div class="product-specs">
          <div class="spec-label">规格</div>
          <div class="spec-options">
            <el-radio-group v-model="selectedSpec" @change="setSelectedSpec">
              <el-radio-button 
                v-for="spec in product.specs" 
                :key="spec.id" 
                :label="spec.id"
              >
                {{ spec.name }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
        
        <!-- 数量选择 -->
        <div class="product-quantity">
          <div class="quantity-label">数量</div>
          <el-input-number 
            v-model="quantity" 
            :min="1" 
            :max="99"
            size="large"
          />
          <span class="stock-info">库存 {{ currentSpecStock }} 件</span>
        </div>
        
        <!-- 操作按钮 -->
        <div class="product-actions">
          <el-button 
            type="primary" 
            size="large" 
            icon="ShoppingCart"
            @click="addToCart"
          >
            加入购物车
          </el-button>
          <el-button 
            type="danger" 
            size="large"
            @click="buyNow"
          >
            立即购买
          </el-button>
          <el-button 
            icon="Star" 
            size="large"
            @click="addToWishlist()"
          >
            收藏
          </el-button>
        </div>
        
        <!-- 服务承诺 -->
        <div class="product-services">
          <div class="service-item">
            <el-icon><Check /></el-icon>
            <span>正品保证</span>
          </div>
          <div class="service-item">
            <el-icon><Check /></el-icon>
            <span>极速发货</span>
          </div>
          <div class="service-item">
            <el-icon><Check /></el-icon>
            <span>7天无理由退换</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 商品详情选项卡 -->
    <div class="product-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品详情" name="detail">
          <div class="product-detail-content" v-html="product?.detail"></div>
        </el-tab-pane>
        <el-tab-pane label="规格参数" name="params">
          <el-descriptions :column="2" border>
            <el-descriptions-item 
              v-for="(param, index) in product?.params" 
              :key="index"
              :label="param.name"
            >
              {{ param.value }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane label="用户评价" name="reviews">
          <div class="reviews-container">
            <div class="review-item" v-for="review in product?.reviews" :key="review.id">
              <div class="review-header">
                <el-avatar :size="40" :src="review.avatar">{{ (review.username || review.user).charAt(0) }}</el-avatar>
                <div class="review-user">
                  <div class="review-username">{{ review.username || review.user }}</div>
                  <div class="review-time">{{ review.time || review.date }}</div>
                </div>
                <div class="review-rating">
                  <el-rate v-model="review.rating" disabled />
                </div>
              </div>
              <div class="review-content">{{ review.content }}</div>
              <div class="review-images" v-if="review.images && review.images.length > 0">
                <el-image 
                  v-for="(image, index) in review.images" 
                  :key="index"
                  :src="image"
                  :preview-src-list="review.images"
                  fit="cover"
                  class="review-image"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <!-- 相关推荐 -->
    <div class="related-products">
      <h2 class="section-title">相关推荐</h2>
      <div class="related-products-grid">
        <div 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id" 
          class="related-product-card"
          @click="goToProductDetail(relatedProduct.id)"
        >
          <el-image 
            :src="relatedProduct.image" 
            fit="cover" 
            class="related-product-image"
          />
          <div class="related-product-info">
            <h3 class="related-product-name">{{ relatedProduct.name }}</h3>
            <div class="related-product-price">¥{{ relatedProduct.price.toFixed(2) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useProductStore } from '../store/product';
import { storeToRefs } from 'pinia';
import PcMenu from '../layouts/PcMenu.vue';
import { Check } from '@element-plus/icons-vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const productId = computed(() => Number(route.params.id));

// 使用store
const productStore = useProductStore();

// 从store中解构响应式数据
const { 
  product, 
  relatedProducts, 
  selectedSpec, 
  quantity, 
  currentImageIndex,
  currentSpecStock,
  activeTab
} = storeToRefs(productStore);

// 从store中解构方法
const { 
  loadProductDetail,
  setSelectedSpec,
  addToCart: addToCartInStore,
  buyNow: buyNowInStore,
  addToWishlist,
  setCurrentImageIndex
} = productStore;

// 商品数据模型接口（已在store中定义）

// 初始化时加载商品详情
onMounted(() => {
  loadProductDetail(productId.value);
});

// 监听商品ID变化，重新加载商品详情
watch(productId, () => {
  loadProductDetail(productId.value);
});

// 添加到购物车
const addToCart = () => {
  if (addToCartInStore()) {
    ElMessage.success('已成功添加到购物车');
  }
};

// 立即购买
const buyNow = () => {
  if (buyNowInStore()) {
    // 跳转到结算页面
    router.push('/checkout');
  }
};

// 跳转到其他商品详情
const goToProductDetail = (id: number) => {
  router.push(`/product/${id}`);
};

// 数量加减处理函数已经在store中实现并通过模板直接调用
</script>

<style scoped>
.product-detail-container {
  margin-top: 60px;
  padding: 20px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: var(--light-card-bg);
  border-radius: 4px;
}

.product-detail-main {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  background: var(--light-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 30px;
}

.product-gallery {
  flex: 1;
  max-width: 500px;
}

.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thumbnails {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  border: 2px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thumbnail-item:hover, .thumbnail-item.active {
  border-color: #409eff;
}

.thumbnail-item .el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.product-brief {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.product-price-box {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 15px 0;
  border-top: 1px dashed #eee;
  border-bottom: 1px dashed #eee;
}

.price-label, .spec-label, .quantity-label {
  font-size: 14px;
  color: #666;
  width: 60px;
}

.product-price {
  font-size: 28px;
  font-weight: bold;
  color: #e53935;
}

.product-original-price {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
}

.product-sales {
  font-size: 14px;
  color: #999;
}

.product-specs, .product-quantity {
  display: flex;
  align-items: center;
  gap: 15px;
}

.spec-options {
  flex: 1;
}

.stock-info {
  margin-left: 15px;
  font-size: 14px;
  color: #999;
}

.product-actions {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.product-services {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #eee;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.service-item .el-icon {
  color: #67c23a;
}

.product-tabs {
  margin-top: 30px;
  background: var(--light-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}

.product-detail-content {
  padding: 20px 0;
}

.reviews-container {
  padding: 20px 0;
}

.review-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.review-user {
  margin-left: 15px;
  flex: 1;
}

.review-username {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.review-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.review-content {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin-bottom: 15px;
}

.review-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.review-image {
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.related-products {
  margin-top: 30px;
  background: var(--light-card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: var(--light-card-bg);
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.related-product-image {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
}

.related-product-info {
  padding: 15px;
}

.related-product-name {
  font-size: 14px;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 10px;
  color: #333;
}

.related-product-price {
  font-size: 18px;
  font-weight: bold;
  color: #e53935;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .product-detail-main {
    flex-direction: column;
  }
  
  .product-gallery {
    max-width: 100%;
  }
  
  .related-products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .related-products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .product-actions {
    flex-wrap: wrap;
  }
  
  .product-actions .el-button {
    flex: 1;
  }
}

@media (max-width: 576px) {
  .related-products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-services {
    flex-direction: column;
    gap: 10px;
  }
}
</style>