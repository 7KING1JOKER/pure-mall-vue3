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
            <div 
              v-for="product in displayProducts" 
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
                <!-- 重新添加销量显示 -->
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
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';
import PcMenu from '../layouts/PcMenu.vue';

// 使用路由
const router = useRouter();

// 分页参数
const pageSize = ref(12);
const currentPage = ref(1);
const totalProducts = ref(48);

// 用于页面显示的商品数据
const displayProducts = ref<typeof products.value>([]);

// 排序参数
const currentSort = ref('default');
const sortOptions = {
  default: '综合排序',
  priceAsc: '价格从低到高',
  priceDesc: '价格从高到低',
  salesDesc: '销量优先',
  newest: '最新上架'
};

// 当前选中的分类
const currentCategory = ref({
  id: '',
  label: '全部商品'
});

// 分类数据结构 - 服装部位分类
const categories = ref([
  {
    id: '1',
    label: '上衣',
    icon: 'Tshirt',
    children: [
      { id: '11', label: 'T恤', icon: 'Tshirt' },
      { id: '12', label: '衬衫', icon: 'Document' },
      { id: '13', label: '卫衣', icon: 'Shirt' },
      { id: '14', label: '毛衣', icon: 'Cloud' },
      { id: '15', label: '夹克', icon: 'FolderOpened' },
      { id: '16', label: '外套', icon: 'Umbrella' },
    ]
  },
  {
    id: '2',
    label: '下装',
    icon: 'Briefcase',
    children: [
      { id: '21', label: '牛仔裤', icon: 'Star' },
      { id: '22', label: '休闲裤', icon: 'Goods' },
      { id: '23', label: '运动裤', icon: 'TrendCharts' },
      { id: '24', label: '短裤', icon: 'Gold' },
      { id: '25', label: '裙子', icon: 'Bell' },
      { id: '26', label: '打底裤', icon: 'Suitcase' },
    ]
  },
  {
    id: '3',
    label: '鞋子',
    icon: 'Soccer',
    children: [
      { id: '31', label: '运动鞋', icon: 'Cpu' },
      { id: '32', label: '休闲鞋', icon: 'Camera' },
      { id: '33', label: '靴子', icon: 'Navigation' },
      { id: '34', label: '拖鞋', icon: 'Monitor' },
      { id: '35', label: '凉鞋', icon: 'Sunny' },
      { id: '36', label: '皮鞋', icon: 'Coins' },
    ]
  },
  {
    id: '4',
    label: '配饰',
    icon: 'Glasses',
    children: [
      { id: '41', label: '帽子', icon: 'Iphone' },
      { id: '42', label: '围巾', icon: 'Link' },
      { id: '43', label: '手套', icon: 'Operation' },
      { id: '44', label: '腰带', icon: 'Key' },
      { id: '45', label: '墨镜', icon: 'Eye' },
      { id: '46', label: '首饰', icon: 'Diamond' },
    ]
  },
  {
    id: '5',
    label: '内衣',
    icon: 'User',
    children: [
      { id: '51', label: '文胸', icon: 'Heart' },
      { id: '52', label: '内裤', icon: 'CirclePlus' },
      { id: '53', label: '睡衣', icon: 'Moon' },
      { id: '54', label: '保暖内衣', icon: 'Snowflake' },
      { id: '55', label: '袜子', icon: 'Plus' },
      { id: '56', label: '家居服', icon: 'HomeFilled' },
    ]
  },
  {
    id: '6',
    label: '箱包',
    icon: 'ShoppingBag',
    children: [
      { id: '61', label: '背包', icon: 'Package' },
      { id: '62', label: '手提包', icon: 'Wallet' },
      { id: '63', label: '斜挎包', icon: 'Flag' },
      { id: '64', label: '钱包', icon: 'CreditCard' },
      { id: '65', label: '旅行包', icon: 'Map' },
      { id: '66', label: '电脑包', icon: 'Notebook' },
    ]
  },
]);

// 商品列表 - 服装相关商品
const products = ref([
  // 上衣类 - T恤
  { id: 1001, name: '纯棉宽松短袖T恤', price: 99, sales: 1250, image: 'https://images.unsplash.com/photo-1588117305388-101002628274?w=400' },
  { id: 1002, name: '男士印花短袖T恤', price: 89, sales: 2100, image: 'https://images.unsplash.com/photo-1611933721120-e39134373187?w=400' },
  { id: 1003, name: '女士修身短袖T恤', price: 109, sales: 1850, image: 'https://images.unsplash.com/photo-1592790836086-852524055103?w=400' },
  { id: 1004, name: '情侣装短袖T恤', price: 119, sales: 980, image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400' },
  
  // 上衣类 - 衬衫
  { id: 1005, name: '商务休闲长袖衬衫', price: 199, sales: 890, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400' },
  { id: 1006, name: '男士牛津纺长袖衬衫', price: 219, sales: 1250, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 1007, name: '女士真丝长袖衬衫', price: 299, sales: 750, image: 'https://images.unsplash.com/photo-1551836022-b06b6e464108?w=400' },
  { id: 1008, name: '薄款防晒长袖衬衫', price: 159, sales: 1980, image: 'https://images.unsplash.com/photo-1557418280-c5121c8d1f54?w=400' },
  
  // 上衣类 - 卫衣
  { id: 1009, name: '加绒连帽卫衣', price: 259, sales: 1870, image: 'https://images.unsplash.com/photo-1584308651578-c3a691e1e7b5?w=400' },
  { id: 1010, name: '宽松圆领卫衣', price: 199, sales: 2350, image: 'https://images.unsplash.com/photo-1602983885036-031af52852d2?w=400' },
  { id: 1011, name: '情侣款连帽卫衣', price: 229, sales: 1450, image: 'https://images.unsplash.com/photo-1606057521015-7f9fcf423740?w=400' },
  { id: 1012, name: 'oversize卫衣', price: 249, sales: 1780, image: 'https://images.unsplash.com/photo-1593488839916-378a6974c550?w=400' },
  
  // 上衣类 - 毛衣
  { id: 1013, name: '高领针织毛衣', price: 299, sales: 670, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400' },
  { id: 1014, name: '圆领宽松毛衣', price: 279, sales: 1120, image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400' },
  { id: 1015, name: 'V领针织开衫', price: 329, sales: 890, image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400' },
  { id: 1016, name: '麻花编织毛衣', price: 359, sales: 580, image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400' },
  
  // 上衣类 - 夹克/外套
  { id: 1017, name: '修身牛仔夹克', price: 359, sales: 4320, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
  { id: 1018, name: '时尚西装外套', price: 499, sales: 3250, image: 'https://images.unsplash.com/photo-1603404503937-48c76a54d308?w=400' },
  { id: 1019, name: '休闲工装夹克', price: 329, sales: 2180, image: 'https://images.unsplash.com/photo-1508804185838-0692486c8691?w=400' },
  { id: 1020, name: '轻薄羽绒外套', price: 599, sales: 1590, image: 'https://images.unsplash.com/photo-1579089133149-786957249fcc?w=400' },
  
  // 下装类 - 牛仔裤
  { id: 1021, name: '经典直筒牛仔裤', price: 249, sales: 1560, image: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?w=400' },
  { id: 1022, name: '修身小脚牛仔裤', price: 269, sales: 2350, image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=400' },
  { id: 1023, name: '高腰阔腿牛仔裤', price: 289, sales: 1890, image: 'https://images.unsplash.com/photo-1600096828191-47940763464e?w=400' },
  { id: 1024, name: '破洞牛仔裤', price: 299, sales: 1650, image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400' },
  
  // 下装类 - 休闲裤
  { id: 1025, name: '休闲束脚运动裤', price: 179, sales: 4320, image: 'https://images.unsplash.com/photo-1588119073484-817a8cdb8362?w=400' },
  { id: 1026, name: '潮流工装短裤', price: 159, sales: 780, image: 'https://images.unsplash.com/photo-1576385611259-7447201304c0?w=400' },
  { id: 1027, name: '男士商务休闲裤', price: 219, sales: 1980, image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400' },
  { id: 1028, name: '女士阔腿休闲裤', price: 229, sales: 1750, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400' },
  
  // 下装类 - 裙子
  { id: 1029, name: '优雅碎花连衣裙', price: 329, sales: 2980, image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=400' },
  { id: 1030, name: '高腰A字半身裙', price: 199, sales: 2150, image: 'https://images.unsplash.com/photo-1614384887897-d17509f18827?w=400' },
  { id: 1031, name: '针织包臀裙', price: 259, sales: 1320, image: 'https://images.unsplash.com/photo-1586905475044-e728e0853931?w=400' },
  { id: 1032, name: '波西米亚长裙', price: 359, sales: 890, image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400' },
  
  // 鞋子类
  { id: 1033, name: '透气网面运动鞋', price: 399, sales: 2150, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: 1034, name: '经典小白鞋', price: 359, sales: 3250, image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400' },
  { id: 1035, name: '马丁靴', price: 459, sales: 1850, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400' },
  { id: 1036, name: '夏季凉鞋', price: 259, sales: 2750, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' },
  
  // 配饰类
  { id: 1037, name: '时尚棒球帽', price: 89, sales: 980, image: 'https://images.unsplash.com/photo-1608169047032-1b764b468a6e?w=400' },
  { id: 1038, name: '羊毛针织围巾', price: 159, sales: 1320, image: 'https://images.unsplash.com/photo-1503342217376-e6e99c3679fe?w=400' },
  { id: 1039, name: '潮流墨镜', price: 299, sales: 1750, image: 'https://images.unsplash.com/photo-1606495481980-f4ff328025c0?w=400' },
  { id: 1040, name: '时尚手表', price: 599, sales: 890, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400' },
  
  // 内衣类
  { id: 1041, name: '舒适棉质文胸', price: 129, sales: 3520, image: 'https://images.unsplash.com/photo-1503342217376-e6e99c3679fe?w=400' },
  { id: 1042, name: '莫代尔睡衣套装', price: 199, sales: 2450, image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400' },
  { id: 1043, name: '保暖内衣套装', price: 259, sales: 1890, image: 'https://images.unsplash.com/photo-1613945681399-3f2d2676c273?w=400' },
  { id: 1044, name: '纯棉袜子（10双装）', price: 69, sales: 4780, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400' },
  
  // 箱包类
  { id: 1045, name: '双肩背包', price: 299, sales: 2150, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
  { id: 1046, name: '时尚手提包', price: 399, sales: 1780, image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400' },
  { id: 1047, name: '斜挎包', price: 259, sales: 2350, image: 'https://images.unsplash.com/photo-1594465915408-698286158842?w=400' },
  { id: 1048, name: '旅行拉杆箱', price: 499, sales: 1580, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400' }
]);

// 存储所有商品的原始数据
const allProducts = ref([...products.value]);

// 树形控件配置
const defaultProps = {
  children: 'children',
  label: 'label'
}

// 分类点击事件
const handleNodeClick = (data: any) => {
  console.log('选中分类:', data.label);
  currentCategory.value = data;
  // 重置分页和排序
  currentPage.value = 1;
  currentSort.value = 'default';
  // 加载该分类下的商品
  loadProducts();
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 重置到第一页
  loadProducts();
}

// 当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  loadProducts();
}

// 排序方式变化
const handleSortChange = (command: string) => {
  currentSort.value = command;
  loadProducts();
}

// 模拟加载商品数据
const loadProducts = () => {
  // 实际项目中这里会调用API，根据分类、分页参数和排序方式获取商品
  console.log(`加载第${currentPage.value}页，每页${pageSize.value}条数据，分类：${currentCategory.value.label}，排序方式：${sortOptions[currentSort.value as keyof typeof sortOptions]}`);
  
  // 从原始数据中获取所有商品
  let sortedProducts = [...allProducts.value];
  
  // 根据当前选中的分类筛选商品
  if (currentCategory.value.id && currentCategory.value.id !== '1' && currentCategory.value.id !== '2' && 
      currentCategory.value.id !== '3' && currentCategory.value.id !== '4' && 
      currentCategory.value.id !== '5' && currentCategory.value.id !== '6') {
    // 假设id格式为：大类(1-6)+子类(1-6)，如11代表T恤
    const categoryId = currentCategory.value.id;
    const categoryType = categoryId.charAt(0);
    const subCategoryId = categoryId.charAt(1);
    
    // 根据分类ID筛选商品
    if (categoryType === '1') {
      // 上衣类
      if (subCategoryId === '1') sortedProducts = sortedProducts.filter(p => p.id >= 1001 && p.id <= 1004); // T恤
      else if (subCategoryId === '2') sortedProducts = sortedProducts.filter(p => p.id >= 1005 && p.id <= 1008); // 衬衫
      else if (subCategoryId === '3') sortedProducts = sortedProducts.filter(p => p.id >= 1009 && p.id <= 1012); // 卫衣
      else if (subCategoryId === '4') sortedProducts = sortedProducts.filter(p => p.id >= 1013 && p.id <= 1016); // 毛衣
      else if (subCategoryId === '5') sortedProducts = sortedProducts.filter(p => p.id >= 1017 && p.id <= 1018); // 夹克
      else if (subCategoryId === '6') sortedProducts = sortedProducts.filter(p => p.id >= 1019 && p.id <= 1020); // 外套
    } else if (categoryType === '2') {
      // 下装类
      if (subCategoryId === '1') sortedProducts = sortedProducts.filter(p => p.id >= 1021 && p.id <= 1024); // 牛仔裤
      else if (subCategoryId === '2') sortedProducts = sortedProducts.filter(p => p.id >= 1025 && p.id <= 1028); // 休闲裤
      else if (subCategoryId === '5') sortedProducts = sortedProducts.filter(p => p.id >= 1029 && p.id <= 1032); // 裙子
    } else if (categoryType === '3') {
      // 鞋子类
      sortedProducts = sortedProducts.filter(p => p.id >= 1033 && p.id <= 1036);
    } else if (categoryType === '4') {
      // 配饰类
      sortedProducts = sortedProducts.filter(p => p.id >= 1037 && p.id <= 1040);
    } else if (categoryType === '5') {
      // 内衣类
      sortedProducts = sortedProducts.filter(p => p.id >= 1041 && p.id <= 1044);
    } else if (categoryType === '6') {
      // 箱包类
      sortedProducts = sortedProducts.filter(p => p.id >= 1045 && p.id <= 1048);
    }
  }
  
  // 根据排序方式对商品进行排序
  switch(currentSort.value) {
    case 'priceAsc':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'salesDesc':
      sortedProducts.sort((a, b) => b.sales - a.sales);
      break;
    case 'newest':
      // 假设id越大表示越新
      sortedProducts.sort((a, b) => b.id - a.id);
      break;
    default:
      // 综合排序，不做特殊处理
      break;
  }
  
  // 更新总商品数量
  totalProducts.value = sortedProducts.length;
  
  // 实现分页逻辑
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  displayProducts.value = sortedProducts.slice(startIndex, endIndex);
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
const goToProductDetail = (productId: number) => {
  router.push(`/product/${productId}`);
}

onMounted(() => {
  // 组件挂载时加载初始数据
  loadProducts();
});

// 确保products数组和allProducts数组同步
watch(products, (newProducts) => {
  allProducts.value = [...newProducts];
  loadProducts();
}, { deep: true });
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
  background-color: var(--light-card-bg);
  border-radius: 4px;
}

.category-main {
  display: flex;
  gap: 20px;
}

.category-nav {
  width: 250px;
  background: var(--light-card-bg);
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
  background: var(--light-card-bg);
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
  background: var(--light-card-bg);
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

.product-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .product-sales {
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
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