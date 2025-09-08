<template>
    <div class="category-container">
      <!-- 响应式菜单 -->
      <PcMenu />
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 分类主体区域 -->
      <div class="category-main">
        <!-- 左侧分类导航 -->
        <div class="category-nav">
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
        </div>

        <!-- 右侧商品列表 -->
        <div class="product-list">
          <!-- 筛选工具栏 -->
          <div class="filter-toolbar">
            <div class="filter-left">
              <el-dropdown>
                <span class="dropdown-link">
                  综合排序<el-icon><ArrowDown /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>综合排序</el-dropdown-item>
                    <el-dropdown-item>价格从低到高</el-dropdown-item>
                    <el-dropdown-item>价格从高到低</el-dropdown-item>
                    <el-dropdown-item>销量优先</el-dropdown-item>
                    <el-dropdown-item>最新上架</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            
            <div class="filter-right">
              <el-pagination
                small
                :page-size="pageSize"
                :total="totalProducts"
                :page-sizes="[20, 40, 60]"
                layout="prev, pager, next, sizes"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>

          <!-- 商品网格 -->
          <div class="product-grid">
            <div 
              v-for="product in products" 
              :key="product.id" 
              class="product-card"
              @click="goToProductDetail(product.id)"
            >
              <el-image 
                :src="product.image" 
                fit="cover" 
                class="product-image"
              />
              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <div class="product-price">¥{{ product.price.toFixed(2) }}</div>
                <div class="product-sales">已售 {{ product.sales }} 件</div>
                <div class="product-actions">
                  <el-button type="primary" size="small" @click.stop="addToCart(product)">
                    加入购物车
                  </el-button>
                  <el-button icon="Star" circle size="small" @click.stop="addToWishlist(product)" />
                </div>
              </div>
            </div>
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
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import PcMenu from '../layouts/PcMenu.vue';

// 使用路由
const router = useRouter();

// 分页参数
const pageSize = ref(12);
const currentPage = ref(1);
const totalProducts = ref(86);

// 分类数据结构
const categories = ref([
  {
    id: '1',
    label: '家用电器',
    icon: 'Odometer',
    children: [
      { id: '11', label: '电视', icon: 'VideoCamera' },
      { id: '12', label: '空调', icon: 'WindPower' },
      { id: '13', label: '洗衣机', icon: 'Service' },
      { id: '14', label: '冰箱', icon: 'Box' },
      { id: '15', label: '厨卫大电', icon: 'KnifeFork' },
      { id: '16', label: '厨房小电', icon: 'Microwave' },
    ]
  },
  {
    id: '2',
    label: '手机数码',
    icon: 'Iphone',
    children: [
      { id: '21', label: '手机', icon: 'Cellphone' },
      { id: '22', label: '平板', icon: 'Ipad' },
      { id: '23', label: '电脑', icon: 'Monitor' },
      { id: '24', label: '相机', icon: 'Camera' },
      { id: '25', label: '耳机', icon: 'Headset' },
      { id: '26', label: '智能设备', icon: 'Watch' },
    ]
  },
  {
    id: '3',
    label: '电脑办公',
    icon: 'Monitor',
    children: [
      { id: '31', label: '笔记本', icon: 'Notebook' },
      { id: '32', label: '台式机', icon: 'Cpu' },
      { id: '33', label: '打印机', icon: 'Printer' },
      { id: '34', label: '办公设备', icon: 'DocumentCopy' },
      { id: '35', label: '外设产品', icon: 'Mouse' },
      { id: '36', label: '网络产品', icon: 'Connection' },
    ]
  },
  {
    id: '4',
    label: '服装服饰',
    icon: 'Tshirt',
    children: [
      { id: '41', label: '男装', icon: 'Male' },
      { id: '42', label: '女装', icon: 'Female' },
      { id: '43', label: '内衣', icon: 'Briefcase' },
      { id: '44', label: '配饰', icon: 'Glasses' },
      { id: '45', label: '鞋靴', icon: 'Soccer' },
      { id: '46', label: '箱包', icon: 'ShoppingBag' },
    ]
  },
  {
    id: '5',
    label: '食品生鲜',
    icon: 'Apple',
    children: [
      { id: '51', label: '水果', icon: 'Cherry' },
      { id: '52', label: '蔬菜', icon: 'Vegetable' },
      { id: '53', label: '海鲜', icon: 'Food' },
      { id: '54', label: '肉类', icon: 'Chicken' },
      { id: '55', label: '乳品冷饮', icon: 'IceCream' },
      { id: '56', label: '休闲零食', icon: 'Sugar' },
    ]
  },
  {
    id: '6',
    label: '家居家装',
    icon: 'HomeFilled',
    children: [
      { id: '61', label: '家具', icon: 'Sofa' },
      { id: '62', label: '家纺', icon: 'QuartzWatch' },
      { id: '63', label: '灯具', icon: 'Lightning' },
      { id: '64', label: '厨具', icon: 'KnifeFork' },
      { id: '65', label: '家装建材', icon: 'House' },
      { id: '66', label: '生活日用', icon: 'ToiletPaper' },
    ]
  },
]);

// 商品列表
const products = ref([
  { id: 1001, name: '智能变频空调 1.5匹', price: 2899, sales: 1250, image: 'https://images.unsplash.com/photo-1611606063065-ee7946f0789a?w=400' },
  { id: 1002, name: '4K超高清智能电视', price: 3999, sales: 890, image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400' },
  { id: 1003, name: '全自动滚筒洗衣机', price: 2199, sales: 1870, image: 'https://images.unsplash.com/photo-1566669495955-1c3d4e7c0f2b?w=400' },
  { id: 1004, name: '双开门节能冰箱', price: 3599, sales: 670, image: 'https://images.unsplash.com/photo-1587035279634-4b4f7c0a0f56?w=400' },
  { id: 1005, name: '多功能电饭煲', price: 299, sales: 4320, image: 'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=400' },
  { id: 1006, name: '高端智能手机', price: 5999, sales: 3250, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400' },
  { id: 1007, name: '轻薄笔记本电脑', price: 6999, sales: 1560, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { id: 1008, name: '无线降噪耳机', price: 899, sales: 4320, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 1009, name: '全画幅专业相机', price: 12999, sales: 780, image: 'https://images.unsplash.com/photo-1512790182412-b19e6d62a39d?w=400' },
  { id: 1010, name: '智能手表', price: 1599, sales: 2980, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400' },
  { id: 1011, name: '游戏主机', price: 3899, sales: 2150, image: 'https://images.unsplash.com/photo-1605901309574-0ae6c9e8e0d1?w=400' },
  { id: 1012, name: '4K显示器', price: 2299, sales: 980, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400' },
]);

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 分类点击事件
const handleNodeClick = (data: any) => {
  console.log('选中分类:', data.label);
  // 实际项目中这里会调用API获取该分类下的商品
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  loadProducts();
}

// 当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadProducts();
}

// 模拟加载商品数据
const loadProducts = () => {
  // 实际项目中这里会调用API，根据分类、分页参数获取商品
  console.log(`加载第${currentPage.value}页，每页${pageSize.value}条数据`);
}

// 添加到购物车
const addToCart = (product: any) => {
  ElNotification({
    title: '已添加到购物车',
    message: `已添加 "${product.name}" 到购物车`,
    type: 'success',
    duration: 2000
  })
}

// 添加到收藏夹
const addToWishlist = (product: any) => {
  ElNotification({
    title: '已添加到收藏',
    message: `已将 "${product.name}" 添加到收藏夹`,
    type: 'info',
    duration: 2000
  })
}

// 跳转到商品详情页
const goToProductDetail = (id: number) => {
  router.push(`/product/${id}`);
}

onMounted(() => {
  // 组件挂载时加载初始数据
  loadProducts();
});
</script>

<style scoped>
.category-container {
  margin-top: 60px;
  padding: 20px;
  width: 100%;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.category-main {
  display: flex;
  gap: 20px;
}

.category-nav {
  width: 250px;
  background: #fff;
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
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
  padding: 20px;
}

.filter-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
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

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fff;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.product-image {
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
}

.product-info {
  padding: 15px;
}

.product-name {
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

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 5px;
}

.product-sales {
  font-size: 12px;
  color: #999;
  margin-bottom: 10px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
}

.pagination-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
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
  
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>