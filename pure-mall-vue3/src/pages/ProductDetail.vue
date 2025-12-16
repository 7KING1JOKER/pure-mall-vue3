<template>
  <div class="product-detail-container">
    <!-- 响应式菜单 -->
    <PcMenu />
    
    <!-- 商品详情主体 -->
    <div class="product-detail-main" v-if="product">
      <!-- 左侧商品图片 -->
      <div class="product-gallery">
        <el-carousel
          :interval="4000"
          direction="vertical"
          class="productDetail-carousel"
          >
          <el-carousel-item v-for="(image, index) in product.images" :key="index">
            <el-image :src="image" fit="cover" class="gallery-image" />
          </el-carousel-item>
        </el-carousel>
      </div>
      
      <!-- 右侧商品信息 -->
      <div class="product-info">
        <!-- 面包导航 -->
        <div class="product-breadcrumb">
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/category' }">全部</el-breadcrumb-item>
            <!-- 父级分类路径 -->
            <el-breadcrumb-item v-if="productCategoryInfo.name" :to="{ path: '/category' }"
              @click=""
            >
              {{ productCategoryInfo.name }}
            </el-breadcrumb-item>
            <!-- 当前产品路径 -->
            <el-breadcrumb-item :to="{ path: `/product/${productId}` }" :replace="false">{{ product.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-icon @click="$router.push('/category')" class="breadcrumb-icon"> <ArrowRight /> </el-icon>
        </div>

        <!-- 商品标题、价格、销售量 -->
        <div class="product-content">
          <h1 class="product-title">{{ product.name }}</h1>
          <h2 class="product-price">¥ {{ product.price.toFixed(2) }}</h2>
        </div>
        
        <!-- 颜色选择 -->
        <div class="color-select">
          <div class="color-text"> {{ selectedSpec && product.specs ? product.specs.find(spec => spec.id === selectedSpec)?.name : '请选择颜色' }} </div>
          <div class="color-options">
            <div 
              v-for="spec in product.specs"
              :key="spec.id" 
              class="color-option" 
              :class="{ 'selected': selectedSpec === spec.id }"
              @click="setSelectedSpec(spec.id)"
            >
              <div 
                class="color-circle" 
                :style="{ backgroundColor: getColorValue(spec.name) }"
              ></div>
            </div>
          </div>
        </div>
        
        <!-- 其它描述 + 购买功能 -->
        <div class="product-desc">
          <h2 class="desc-item product-desc-content"
              @click="useProductStore().productDetailsDialogVisible = true"
          >细节 & 描述</h2>
          <h2 class="desc-item product-desc-size"
              @click="useProductStore().productSizeDialogVisible = true"
          >尺码 & 选择</h2>
          <div class="product-actions">
            <div class="action-button add-to-wish-wrapper">
              <el-icon class="add-to-wish" @click="addToWishlist(product)">
                <Notebook />
              </el-icon>
              <span class="action-text">收藏</span>
            </div>
            <div class="action-button add-to-cart-wrapper">
              <el-icon class="add-to-cart" @click="addCartItem(product)">
                <ShoppingBag />
              </el-icon>
              <span class="action-text">购物车</span>
            </div>
          </div>
        </div>

        <!-- 缩放图展示 -->
        <h1 class="zoom-title">缩放图</h1>
        <div class="product-gallery-zoom">
          <div v-for="(image, index) in product.images" :key="index" class="product-gallery-item">
            <el-image :src="image" fit="contain" class="zoom-image" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
    <Footer />

    <!-- 商品详情对话框 -->
    <ProductDetailsDialog v-model="useProductStore().productDetailsDialogVisible" />
    
    <!-- 商品规格对话框 -->
    <ProductSizeDialog v-model="useProductStore().productSizeDialogVisible" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '../store/product';
import { useCartStore } from '../store/cart';
import { useUserStore } from '../store/user';
import { storeToRefs } from 'pinia';
import { ShoppingBag, Notebook, ArrowRight } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ProductDetailsDialog from '../layouts/ProductDetailsDialog.vue';
import ProductSizeDialog from '../layouts/ProductSizeDialog.vue';

import PcMenu from '../layouts/PcMenu.vue';
import Footer from '../layouts/Footer.vue';

// 路由相关
const route = useRoute();
const productId = computed(() => Number(route.params.id));

// 使用store
const productStore = useProductStore();
const cartStore = useCartStore();
const userStore = useUserStore();

// 从store中解构响应式数据
const { 
  product, 
  selectedSpec
} = storeToRefs(productStore);


// 计算属性：根据产品ID获取对应的分类信息
const productCategoryInfo = computed(() => {
  if (!product.value) return { id: '', name: '' };
  
  // 从product.ts的逻辑可以看出，产品ID的前几位代表不同的分类
  const productIdNum = productId.value;
  let categoryId = '';
  let categoryName = '';
  
  // 根据ID范围设置不同的分类信息
  if (productIdNum >= 1001 && productIdNum <= 1020) {
    categoryId = '1';
    categoryName = '上衣';
  } else if (productIdNum >= 1021 && productIdNum <= 1032) {
    categoryId = '2';
    categoryName = '下装';
  } else if (productIdNum >= 1033 && productIdNum <= 1036) {
    categoryId = '3';
    categoryName = '鞋子';
  } else if (productIdNum >= 1037 && productIdNum <= 1040) {
    categoryId = '4';
    categoryName = '配饰';
  } else if (productIdNum >= 1041 && productIdNum <= 1044) {
    categoryId = '5';
    categoryName = '内衣';
  } else if (productIdNum >= 1045 && productIdNum <= 1048) {
    categoryId = '6';
    categoryName = '箱包';
  }
  
  return { id: categoryId, name: categoryName };
});

// 从store中解构方法
const { 
  loadProductDetail,
  setSelectedSpec,
  getColorValue
} = productStore;


// 添加到收藏夹方法
const addToWishlist = (item: any) => {
  userStore.addToWishlistItem(userStore.username, item.id);
  userStore.addToWishlist(item);
};

// 添加到购物车方法
const addCartItem = (product: any) => {
  // 检查是否已选择尺码
  if (productStore.selectedSize === '') {
    // 提示用户先选择尺码
    ElMessage.warning('请先选择尺码');
    return;
  }
  
  cartStore.addToCart({
    productId: product.id,
    userId: Number(userStore.userId),
    name: product.name,
    price: product.price,
    quantity: 1,
    imageUrl: product.images[0],
    spec: productStore.selectedColor + ' ' + productStore.selectedSize,
    description: product.description,
    selected: true
  });
  
  // 成功加入购物车后重置选中的尺码
  productStore.setSelectedSize('');
};


// 初始化时加载商品详情
onMounted(() => {
  loadProductDetail(productId.value);
});

// 监听商品ID变化，重新加载商品详情
watch(productId, () => {
  loadProductDetail(productId.value);
});


</script>

<style scoped>

.product-detail-container {
  margin-top: 60px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.product-detail-main {
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: row;
}

.product-gallery {
  flex: 1;
}

.productDetail-carousel {
  background-color: #333;
  height: 100%;
  width: 100%;
}

/* 确保el-carousel-item占满父级容器 */
.productDetail-carousel:deep(.el-carousel__container) {
  background-color: #fff;
  height: 100%;
  width: 100%;
}

/* 调整指示器位置到左中位置 */
.productDetail-carousel:deep(.el-carousel__indicators) {
  top: 50%;
  left: 10px !important; /* 距离左侧的距离 */
  right: auto; /* 取消右侧定位 */
  transform: translateY(-50%);
}
.productDetail-carousel:deep(.el-carousel__indicator) {
  margin: 5px 0; /* 垂直方向的间距 */
}

/* 确保el-image占满父级容器 */
.gallery-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-breadcrumb {
  display: flex;
}

.breadcrumb-icon {
  margin-right: 100px;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.breadcrumb-icon:hover {
  transform: translateX(-10px);
}

.product-info {
  backdrop-filter: blur(0.8px);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
}

.product-info > * {
  padding: 15px;
  padding-top: 30px;
}

.breadcrumb{
  display: block;
  width: 100%;
}

/* 为面包屑的所有元素设置统一的大小和颜色 */
.breadcrumb :deep(.el-breadcrumb__separator),
.breadcrumb :deep(.el-breadcrumb__inner),
.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 1.5;
}

.product-content {
  display: flex;
  flex-direction: column;
}

.product-content h1 {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.2;
}

.product-content h2 {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 450;
  line-height: 1.5;
}


.color-select {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.color-text {
  font-size: 15px;
  font-weight: 500;
}

.color-options {
  display: flex;
  gap: 15px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-option.selected > .color-circle {
  transform: scale(0.8);
}

.color-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.product-desc {
  display: flex;
  flex-direction: column;
}

.desc-item {
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
}

.desc-item::after {
  content: '›';  /* 使用更明显的箭头符号 */
  display: inline-block;
  margin-left: 5px;
  opacity: 0;
  font-size: 20px;  /* 增大箭头尺寸 */
  color: #333;
  font-weight: bold;
  transition: all 0.3s ease;
  vertical-align: middle;
  position: relative;
  top: -1px;
}

.desc-item:hover::after {
  opacity: 1;
  transform: translateX(2px);
}

.product-actions {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-actions .el-icon {
  font-size: 16px;
  font-weight: 400;
}

.action-text {
  position: relative;
  margin-left: 5px;
  color: #000000;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
}

.action-button:hover .action-text {
  opacity: 1;
  transform: translateX(2px);
}

.zoom-title {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
}

.product-gallery-zoom {
  position: absolute;
  display: flex;
  width: 70%;
  bottom: 0;
  gap: 0;
}

.product-gallery-item {
  flex: 1;
}

.zoom-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-image:hover {
  border: 1px solid #fff;
}

@media (max-width: 1442px) {
  /* 调整产品信息的内边距 */
  .product-info > * {
    padding-top: 5px;
  }
}

/* 响应式设计 - 在小屏幕上变为垂直排列 */
@media (max-width: 768px) {
  .product-detail-container {
    margin-top: 52px;
    height: calc(100vh - 52px);
  }
  
  .product-detail-main {
    display: flex;
    flex-direction: column;
    height: calc(2*(100vh - 52px));
  }
  
  .product-detail-main > * {
    width: 100%;
    height: calc(100vh - 52px);
    scroll-snap-align: start;
  }
  
  
  /* 调整面包屑图标位置 */
  .breadcrumb-icon {
    margin-right: 20px; /* 减小右侧间距 */
    font-size: 20px; /* 减小图标大小 */
  }
  
  /* 调整产品信息的内边距 */
  .product-info > * {
    padding: 10px;
    padding-top: 15px;
  }
}

</style>