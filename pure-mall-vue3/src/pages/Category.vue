<template>
    <div class="category-container">
      <!-- 响应式菜单 -->
      <PcMenu />
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentCategory.id">{{ currentCategory.label }}</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 分类主体区域 -->
      <div class="category-main">
        <!-- 分类导航 -->
         <!-- 左侧分类导航 -->
        <!-- <div class="category-nav">
          <div class="nav-header">商品分类</div>
          <el-tree 
            :data="categories"
            node-key="id"
            :props="defaultProps"
            :default-expanded-keys="['1']"
            :highlight-current="true"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <el-icon v-if="data.icon"><component :is="data.icon" /></el-icon>
                <span>{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
        </div> -->
        <!-- 右侧商品列表 -->
        <div class="product-list">
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
      <section class="section-footer">
        <Footer />
      </section>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '../store/category';
import { storeToRefs } from 'pinia';
import { ArrowDown } from '@element-plus/icons-vue';
import PcMenu from '../layouts/PcMenu.vue';
import Footer from '../layouts/Footer.vue';
import ProductCard from '../components/ProductCard.vue';

// 使用路由
const router = useRouter();

// 使用category store
const categoryStore = useCategoryStore();

// 从store解构获取非响应式方法
const { 
  handleNodeClick,
  handleCurrentChange,
  handleSortChange,
  addToCart,
  addToWishlist,
  initializeData,
  sortOptions
} = categoryStore;

// 从store中解构响应式数据
const { 
  categories,
  displayProducts,
  currentCategory,
  currentSort,
  pageSize,
  totalProducts
} = storeToRefs(categoryStore);

// 配置el-tree的节点属性
const defaultProps = {
  children: 'children',
  label: 'name'
};



// 跳转到商品详情页
const goToProductDetail = (productId: number) => {
  router.push(`/product/${productId}`);
}

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

.breadcrumb{
  margin-bottom: 20px;
  padding: 10px 15px;
  border-radius: 4px;
}

/* 为面包屑的所有元素设置统一的大小和颜色 */
.breadcrumb ::v-deep .el-breadcrumb__separator,
.breadcrumb ::v-deep .el-breadcrumb__inner,
.breadcrumb ::v-deep .el-breadcrumb__item {
  font-size: 0.8rem;
  font-weight: 400;
  color: #000000;
}

.category-main {
  display: flex;
  gap: 20px;
}

.category-nav {
  width: 250px;
  background: transparent;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 15px;
  height: fit-content;
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

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
}

.dropdown-link .el-icon {
  margin-left: 5px;
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
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 页脚区域 */
.section-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
  box-sizing: border-box;
  height: 80vh;
  background-color: #000000c9;
  color: white;
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
  
  .category-nav {
    width: 100%;
    margin-bottom: 20px;
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