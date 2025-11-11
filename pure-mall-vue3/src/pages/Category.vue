<template>
    <div class="category-container">
      <!-- 响应式菜单 -->
      <PcMenu />
      <!-- 顶部区域 -->
      <div class="top-container">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item @click="handleAllClick">全部</el-breadcrumb-item>
          <el-breadcrumb-item @mouseenter="categoryStore.CategoryNavVisible = true">
            商品分类
          </el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentCategory.id">{{ currentCategory.label }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 筛选工具栏 -->
        <div class="filter-toolbar">
          <div class="filter-left">
            <el-dropdown @command="handleSortChange">
              <span class="dropdown-link">
                  {{ sortOptions[currentSort as keyof typeof sortOptions] }}<el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="default">综合排序</el-dropdown-item>
                  <el-dropdown-item command="priceAsc">价格从低到高</el-dropdown-item>
                  <el-dropdown-item command="priceDesc">价格从高到低</el-dropdown-item>
                  <el-dropdown-item command="salesDesc">销量优先</el-dropdown-item>
                  <el-dropdown-item command="newest">最新上架</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
      <!-- 分类主体区域 -->
      <div class="category-main">
        <!-- 分类导航 -->
        <!-- 右侧商品列表 -->
        <div class="product-list">

          <!-- 商品网格 -->
          <div class="product-grid">
            <ProductCard 
              v-for="product in displayProducts" 
              :key="product.id" 
              :product="product"
            />
          </div>
          
          <!-- 无商品时的提示 -->
          <div v-if="displayProducts.length === 0" class="no-products">
            <el-empty description="暂无商品" />
          </div>

          <!-- 分页控件 -->
          <div class="pagination-container">
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :page-size="pageSize"
              :total="totalProducts"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>

      <!-- footer -->
      <Footer />

      <!-- 分类导航 -->
      <CategoryNav v-model="categoryStore.CategoryNavVisible" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useCategoryStore } from '../store/category';
import { storeToRefs } from 'pinia';
import { ArrowDown } from '@element-plus/icons-vue';
import PcMenu from '../layouts/PcMenu.vue';
import Footer from '../layouts/Footer.vue';
import ProductCard from '../components/ProductCard.vue';
import CategoryNav from '../layouts/CategoryNavDialog.vue';

// 使用category store
const categoryStore = useCategoryStore();

// 从store解构获取非响应式方法
const { 
  handleCurrentChange,
  handleSortChange,
  initializeData,
  sortOptions
} = categoryStore;

// 点击"全部"面包屑项的处理函数
const handleAllClick = () => {
  // 重置当前分类为全部商品
  categoryStore.currentCategory = {
    id: '',
    label: '全部商品'
  };
  // 重新加载商品数据
  initializeData();
};

// 从store中解构响应式数据
const { 
  displayProducts,
  currentCategory,
  currentSort,
  pageSize,
  totalProducts
} = storeToRefs(categoryStore);

onMounted(() => {
  // 组件挂载时加载初始数据
  initializeData();
});
</script>

<style scoped>
.category-container {
  margin-top: 60px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 顶部容器样式 - 面包屑和筛选工具栏水平排列 */
.top-container {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb{
  padding: 10px 15px;
  border-radius: 4px;
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

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-left {
  display: flex;
  align-items: center;
}

.dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  padding: 10px 15px;
  border-radius: 4px;
}

.dropdown-link .el-icon {
  margin-left: 5px;
}

.category-main {
  display: flex;
  gap: 20px;
}


.nav-header {
  font-size: 18px;
  font-weight: 600;
  padding: 10px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  color: #409eff;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 0 4px;
}

.custom-tree-node .el-icon {
  margin-right: 8px;
  color: #409eff;
}

.product-list {
  flex: 1;
  background: transparent;
  border-radius: 4px;
}



.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
  
.no-products {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 0;
}

.pagination-container {
  height: 50px;
  display: flex;
  justify-content: center;
}

.pagination-container :deep(.el-pagination),
.pagination-container :deep(.btn-prev),
.pagination-container :deep(.btn-next),
.pagination-container :deep(ul li) {
  background-color: transparent !important;
}

.pagination-container :deep(.el-pagination .el-pagination__jump .el-input .el-input__wrapper) {
  background-color: transparent !important;
  color: #000000 !important;
  text-decoration: underline;
  text-underline-offset: 2px;
  box-shadow: none !important;
}

.pagination-container :deep(.el-pagination) {
  gap: 100px;
}

/* footer区域 */
.section-footer {
  height: 80vh;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .category-main {
    flex-direction: column;
  }
  

}

@media (max-width: 576px) {
  
  .filter-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>