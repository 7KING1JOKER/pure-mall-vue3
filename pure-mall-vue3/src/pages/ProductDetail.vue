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
            @click="currentImageIndex = index"
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
            <el-radio-group v-model="selectedSpec">
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
            @click="addToWishlist"
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
                <el-avatar :size="40" :src="review.avatar">{{ review.username.charAt(0) }}</el-avatar>
                <div class="review-user">
                  <div class="review-username">{{ review.username }}</div>
                  <div class="review-time">{{ review.time }}</div>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import PcMenu from '../layouts/PcMenu.vue';
import { Check, ShoppingCart, Star } from '@element-plus/icons-vue';

// 路由相关
const route = useRoute();
const router = useRouter();
const productId = computed(() => Number(route.params.id));

// 商品详情选项卡
const activeTab = ref('detail');

// 当前选中的图片索引
const currentImageIndex = ref(0);

// 选中的规格和数量
const selectedSpec = ref('');
const quantity = ref(1);

// 商品数据模型接口
interface ProductSpec {
  id: string;
  name: string;
  stock: number;
}

interface ProductParam {
  name: string;
  value: string;
}

interface ProductReview {
  id: number;
  username: string;
  avatar: string;
  rating: number;
  time: string;
  content: string;
  images: string[];
}

interface Product {
  id: number;
  name: string;
  brief: string;
  price: number;
  originalPrice?: number;
  sales: number;
  images: string[];
  specs: ProductSpec[];
  detail: string;
  params: ProductParam[];
  reviews: ProductReview[];
}

// 商品详情数据
const product = ref<Product | null>(null);

// 相关推荐商品
const relatedProducts = ref<Array<{id: number, name: string, price: number, image: string}>>([]);

// 模拟商品数据库
const productDatabase: Product[] = [
  // 上衣类 - T恤
  {
    id: 1001,
    name: '纯棉宽松短袖T恤',
    brief: '100%纯棉面料，柔软舒适，宽松版型，透气吸汗，简约设计，百搭时尚',
    price: 99,
    originalPrice: 159,
    sales: 1250,
    images: [
      'https://images.unsplash.com/photo-1588117305388-101002628274?w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      'https://images.unsplash.com/photo-1584308651578-c3a691e1e7b5?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    specs: [
      { id: 'spec1', name: '白色-S', stock: 100 },
      { id: 'spec2', name: '白色-M', stock: 150 },
      { id: 'spec3', name: '白色-L', stock: 120 },
      { id: 'spec4', name: '黑色-S', stock: 90 },
      { id: 'spec5', name: '黑色-M', stock: 130 },
      { id: 'spec6', name: '黑色-L', stock: 80 }
    ],
    detail: `
      <div style="padding: 20px;">
        <h2>产品介绍</h2>
        <p>这款纯棉宽松短袖T恤采用优质新疆长绒棉，经过精梳工艺处理，触感柔软细腻。宽松版型设计，穿着舒适无束缚感，适合各种体型。</p>
        <img src="https://images.unsplash.com/photo-1588117305388-101002628274?w=800" style="width: 100%; margin: 20px 0;">
        <h3>产品特点</h3>
        <ul>
          <li>优质纯棉：100%新疆长绒棉，柔软亲肤，透气吸汗</li>
          <li>宽松版型：舒适无束缚，适合多种体型</li>
          <li>简约设计：经典圆领，百搭时尚，适合各种场合</li>
          <li>环保印染：活性印染工艺，色彩鲜艳不易褪色</li>
          <li>精细做工：无线头，锁边牢固，经久耐穿</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800" style="width: 100%; margin: 20px 0;">
      </div>
    `,
    params: [
      { name: '品牌', value: '舒适坊' },
      { name: '材质', value: '100%纯棉' },
      { name: '版型', value: '宽松' },
      { name: '领型', value: '圆领' },
      { name: '袖长', value: '短袖' },
      { name: '厚度', value: '薄款' },
      { name: '适用季节', value: '夏季' },
      { name: '洗涤说明', value: '建议手洗或机洗轻柔模式' },
      { name: '产地', value: '中国' },
      { name: '安全类别', value: 'B类（可直接接触皮肤）' }
    ],
    reviews: [
      {
        id: 1,
        username: '李小姐',
        avatar: '',
        rating: 5,
        time: '2023-10-15',
        content: '面料很舒服，纯棉的，穿上很透气，夏天穿正合适。颜色也很正，没有色差。',
        images: [
          'https://images.unsplash.com/photo-1588117305388-101002628274?w=200',
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200'
        ]
      },
      {
        id: 2,
        username: '王先生',
        avatar: '',
        rating: 5,
        time: '2023-10-10',
        content: '版型宽松，穿着很自在，质量不错，洗了几次也没有变形，性价比很高。',
        images: []
      },
      {
        id: 3,
        username: '张女士',
        avatar: '',
        rating: 4,
        time: '2023-10-05',
        content: '做工细致，没有多余的线头，颜色很百搭，值得购买。',
        images: [
          'https://images.unsplash.com/photo-1584308651578-c3a691e1e7b5?w=200'
        ]
      }
    ]
  },
  {
    id: 1002,
    name: '男士印花短袖T恤',
    brief: '纯棉面料，透气吸汗，时尚印花设计，修身版型，多种颜色可选',
    price: 89,
    originalPrice: 139,
    sales: 2100,
    images: [
      'https://images.unsplash.com/photo-1611933721120-e39134373187?w=800',
      'https://images.unsplash.com/photo-1588117305388-101002628274?w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    specs: [
      { id: 'spec1', name: '蓝色-S', stock: 120 },
      { id: 'spec2', name: '蓝色-M', stock: 180 },
      { id: 'spec3', name: '蓝色-L', stock: 150 },
      { id: 'spec4', name: '灰色-S', stock: 100 },
      { id: 'spec5', name: '灰色-M', stock: 140 },
      { id: 'spec6', name: '灰色-L', stock: 90 }
    ],
    detail: `
      <div style="padding: 20px;">
        <h2>产品介绍</h2>
        <p>这款男士印花短袖T恤采用优质纯棉面料，结合时尚印花设计，既舒适又潮流。修身版型剪裁，展现男性魅力，适合日常休闲穿着。</p>
        <img src="https://images.unsplash.com/photo-1611933721120-e39134373187?w=800" style="width: 100%; margin: 20px 0;">
        <h3>产品特点</h3>
        <ul>
          <li>优质纯棉：柔软亲肤，透气吸汗，穿着舒适</li>
          <li>时尚印花：独特印花设计，彰显个性</li>
          <li>修身版型：精致剪裁，展现男性魅力</li>
          <li>多种颜色：丰富配色选择，满足不同搭配需求</li>
          <li>精细做工：高品质缝制工艺，经久耐穿</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1588117305388-101002628274?w=800" style="width: 100%; margin: 20px 0;">
      </div>
    `,
    params: [
      { name: '品牌', value: '潮流前线' },
      { name: '材质', value: '100%纯棉' },
      { name: '版型', value: '修身' },
      { name: '领型', value: '圆领' },
      { name: '袖长', value: '短袖' },
      { name: '厚度', value: '薄款' },
      { name: '适用季节', value: '夏季' },
      { name: '洗涤说明', value: '建议手洗或机洗轻柔模式' },
      { name: '产地', value: '中国' },
      { name: '安全类别', value: 'B类（可直接接触皮肤）' }
    ],
    reviews: [
      {
        id: 1,
        username: '刘先生',
        avatar: '',
        rating: 5,
        time: '2023-10-18',
        content: '印花很时尚，面料也很舒服，尺码标准，穿着很合身。',
        images: [
          'https://images.unsplash.com/photo-1611933721120-e39134373187?w=200'
        ]
      },
      {
        id: 2,
        username: '张先生',
        avatar: '',
        rating: 4,
        time: '2023-10-12',
        content: '性价比很高，颜色和图片一样，没有色差，值得购买。',
        images: []
      }
    ]
  },
  {
    id: 1003,
    name: '女士修身短袖T恤',
    brief: '弹力棉质面料，修身版型，简约设计，多种颜色可选，适合日常穿搭',
    price: 109,
    originalPrice: 169,
    sales: 1850,
    images: [
      'https://images.unsplash.com/photo-1592790836086-852524055103?w=800',
      'https://images.unsplash.com/photo-1588117305388-101002628274?w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    specs: [
      { id: 'spec1', name: '粉色-S', stock: 150 },
      { id: 'spec2', name: '粉色-M', stock: 200 },
      { id: 'spec3', name: '粉色-L', stock: 130 },
      { id: 'spec4', name: '白色-S', stock: 180 },
      { id: 'spec5', name: '白色-M', stock: 160 },
      { id: 'spec6', name: '白色-L', stock: 110 }
    ],
    detail: `
      <div style="padding: 20px;">
        <h2>产品介绍</h2>
        <p>这款女士修身短袖T恤采用弹力棉质面料，柔软舒适，富有弹性。修身版型设计，展现女性优美曲线，简约风格适合各种场合穿着。</p>
        <img src="https://images.unsplash.com/photo-1592790836086-852524055103?w=800" style="width: 100%; margin: 20px 0;">
        <h3>产品特点</h3>
        <ul>
          <li>弹力棉质：柔软舒适，富有弹性，穿着贴身</li>
          <li>修身版型：精致剪裁，展现女性曲线</li>
          <li>简约设计：百搭风格，适合各种场合</li>
          <li>多种颜色：丰富配色，满足不同喜好</li>
          <li>精细做工：高品质缝制，耐洗耐穿</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1588117305388-101002628274?w=800" style="width: 100%; margin: 20px 0;">
      </div>
    `,
    params: [
      { name: '品牌', value: '优雅女人' },
      { name: '材质', value: '95%棉 5%氨纶' },
      { name: '版型', value: '修身' },
      { name: '领型', value: '圆领' },
      { name: '袖长', value: '短袖' },
      { name: '厚度', value: '薄款' },
      { name: '适用季节', value: '夏季' },
      { name: '洗涤说明', value: '建议手洗或机洗轻柔模式' },
      { name: '产地', value: '中国' },
      { name: '安全类别', value: 'B类（可直接接触皮肤）' }
    ],
    reviews: [
      {
        id: 1,
        username: '陈小姐',
        avatar: '',
        rating: 5,
        time: '2023-10-20',
        content: '面料超级舒服，弹力很好，修身效果也很棒，很显身材。',
        images: [
          'https://images.unsplash.com/photo-1592790836086-852524055103?w=200'
        ]
      },
      {
        id: 2,
        username: '林女士',
        avatar: '',
        rating: 5,
        time: '2023-10-15',
        content: '颜色很正，质量也很好，已经买了两件了，推荐给朋友了。',
        images: []
      }
    ]
  },
  {
    id: 1004,
    name: '情侣装短袖T恤',
    brief: '纯棉面料，透气吸汗，情侣款设计，多种颜色可选，适合情侣日常穿搭',
    price: 119,
    originalPrice: 199,
    sales: 980,
    images: [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800',
      'https://images.unsplash.com/photo-1588117305388-101002628274?w=800',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    specs: [
      { id: 'spec1', name: '黑色-男S', stock: 80 },
      { id: 'spec2', name: '黑色-男M', stock: 120 },
      { id: 'spec3', name: '黑色-男L', stock: 100 },
      { id: 'spec4', name: '黑色-女S', stock: 90 },
      { id: 'spec5', name: '黑色-女M', stock: 110 },
      { id: 'spec6', name: '黑色-女L', stock: 80 },
      { id: 'spec7', name: '白色-男S', stock: 70 },
      { id: 'spec8', name: '白色-男M', stock: 100 },
      { id: 'spec9', name: '白色-男L', stock: 90 },
      { id: 'spec10', name: '白色-女S', stock: 95 },
      { id: 'spec11', name: '白色-女M', stock: 105 },
      { id: 'spec12', name: '白色-女L', stock: 75 }
    ],
    detail: `
      <div style="padding: 20px;">
        <h2>产品介绍</h2>
        <p>这款情侣装短袖T恤采用优质纯棉面料，柔软舒适，透气吸汗。独特的情侣款设计，展现甜蜜爱情，是情侣日常穿搭的绝佳选择。</p>
        <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800" style="width: 100%; margin: 20px 0;">
        <h3>产品特点</h3>
        <ul>
          <li>优质纯棉：柔软亲肤，透气吸汗，穿着舒适</li>
          <li>情侣款设计：独特图案设计，展现甜蜜爱情</li>
          <li>多种颜色：丰富配色选择，满足不同喜好</li>
          <li>男女款区分：根据男女体型设计，更加合身</li>
          <li>精细做工：高品质缝制工艺，经久耐穿</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1588117305388-101002628274?w=800" style="width: 100%; margin: 20px 0;">
      </div>
    `,
    params: [
      { name: '品牌', value: '爱情密码' },
      { name: '材质', value: '100%纯棉' },
      { name: '版型', value: '宽松' },
      { name: '领型', value: '圆领' },
      { name: '袖长', value: '短袖' },
      { name: '厚度', value: '薄款' },
      { name: '适用季节', value: '夏季' },
      { name: '洗涤说明', value: '建议手洗或机洗轻柔模式' },
      { name: '产地', value: '中国' },
      { name: '安全类别', value: 'B类（可直接接触皮肤）' }
    ],
    reviews: [
      {
        id: 1,
        username: '王先生和李女士',
        avatar: '',
        rating: 5,
        time: '2023-10-25',
        content: '和男朋友一起买的，衣服质量很好，图案也很可爱，穿着很舒服，很喜欢。',
        images: [
          'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200'
        ]
      },
      {
        id: 2,
        username: '张先生和赵女士',
        avatar: '',
        rating: 5,
        time: '2023-10-20',
        content: '衣服质量很好，情侣款设计很独特，两个人穿着很般配，值得购买。',
        images: []
      }
    ]
  },
  {
    id: 1005,
    name: '商务休闲长袖衬衫',
    brief: '优质面料，商务休闲风格，多种颜色可选，适合职场和日常穿着',
    price: 199,
    originalPrice: 299,
    sales: 890,
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      'https://images.unsplash.com/photo-1584308651578-c3a691e1e7b5?w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    specs: [
      { id: 'spec1', name: '白色-S', stock: 100 },
      { id: 'spec2', name: '白色-M', stock: 150 },
      { id: 'spec3', name: '白色-L', stock: 120 },
      { id: 'spec4', name: '蓝色-S', stock: 90 },
      { id: 'spec5', name: '蓝色-M', stock: 130 },
      { id: 'spec6', name: '蓝色-L', stock: 110 }
    ],
    detail: `
      <div style="padding: 20px;">
        <h2>产品介绍</h2>
        <p>这款商务休闲长袖衬衫采用优质面料，手感柔软，穿着舒适。经典的商务休闲风格设计，既适合职场穿着，也适合日常休闲场合，是男士衣橱的必备单品。</p>
        <img src="https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800" style="width: 100%; margin: 20px 0;">
        <h3>产品特点</h3>
        <ul>
          <li>优质面料：柔软舒适，透气吸汗</li>
          <li>商务休闲风格：经典设计，适合多种场合</li>
          <li>精致剪裁：修身版型，展现男士魅力</li>
          <li>多种颜色：丰富配色选择，满足不同需求</li>
          <li>精细做工：高品质缝制工艺，经久耐穿</li>
        </ul>
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800" style="width: 100%; margin: 20px 0;">
      </div>
    `,
    params: [
      { name: '品牌', value: '职场精英' },
      { name: '材质', value: '65%棉 35%聚酯纤维' },
      { name: '版型', value: '修身' },
      { name: '领型', value: '方领' },
      { name: '袖长', value: '长袖' },
      { name: '厚度', value: '适中' },
      { name: '适用季节', value: '春秋' },
      { name: '洗涤说明', value: '建议手洗或机洗轻柔模式' },
      { name: '产地', value: '中国' },
      { name: '安全类别', value: 'B类（可直接接触皮肤）' }
    ],
    reviews: [
      {
        id: 1,
        username: '赵先生',
        avatar: '',
        rating: 5,
        time: '2023-10-15',
        content: '衣服质量很好，面料也很舒服，穿着很合身，商务场合穿着很得体。',
        images: [
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200'
        ]
      },
      {
        id: 2,
        username: '孙先生',
        avatar: '',
        rating: 4,
        time: '2023-10-10',
        content: '衬衫质量不错，版型也很好，就是颜色比图片稍微深一点，不过不影响穿着。',
        images: []
      }
    ]
  }
];

// 加载商品详情
const loadProductDetail = () => {
  // 根据productId查找对应的商品
  const foundProduct = productDatabase.find(p => p.id === productId.value);
  
  if (foundProduct) {
    product.value = { ...foundProduct };
    // 初始化选中第一个规格
    if (product.value.specs && product.value.specs.length > 0) {
      selectedSpec.value = product.value.specs[0].id;
    }
    
    // 加载相关推荐商品（排除当前商品）
    const currentCategoryType = Math.floor(productId.value / 1000);
    relatedProducts.value = productDatabase
      .filter(p => p.id !== productId.value && Math.floor(p.id / 1000) === currentCategoryType)
      .slice(0, 4)
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images[0]
      }));
  } else {
    // 如果没有找到商品，使用默认商品
    product.value = {
      id: 0,
      name: '商品不存在',
      brief: '抱歉，您查看的商品不存在或已下架',
      price: 0,
      sales: 0,
      images: ['https://via.placeholder.com/800x800?text=商品不存在'],
      specs: [],
      detail: '<div style="text-align: center; padding: 50px;"><h2>抱歉，您查看的商品不存在或已下架</h2></div>',
      params: [],
      reviews: []
    };
    relatedProducts.value = [];
  }
};

// 初始化选中第一个规格
onMounted(() => {
  loadProductDetail();
});

// 监听路由参数变化，重新加载商品详情
watch(productId, () => {
  loadProductDetail();
});

// 计算当前规格的库存
const currentSpecStock = computed(() => {
  if (!product.value || !selectedSpec.value) return 0;
  
  const spec = product.value.specs.find(s => s.id === selectedSpec.value);
  return spec ? spec.stock : 0;
});

// 添加到购物车
const addToCart = () => {
  if (!selectedSpec.value) {
    ElNotification({
      title: '请选择规格',
      message: '请先选择商品规格',
      type: 'warning',
      duration: 2000
    });
    return;
  }
  
  ElNotification({
    title: '已添加到购物车',
    message: product.value ? `已添加 ${quantity.value} 件 "${product.value.name}" 到购物车` : '已添加商品到购物车',
    type: 'success',
    duration: 2000
  });
};

// 立即购买
const buyNow = () => {
  if (!selectedSpec.value) {
    ElNotification({
      title: '请选择规格',
      message: '请先选择商品规格',
      type: 'warning',
      duration: 2000
    });
    return;
  }
  
  // 实际项目中这里会先将商品添加到购物车，然后跳转到结算页面
  router.push('/checkout');
};

// 添加到收藏夹
const addToWishlist = () => {
  ElNotification({
    title: '已添加到收藏',
    message: product.value ? `已将 "${product.value.name}" 添加到收藏夹` : '已将商品添加到收藏夹',
    type: 'info',
    duration: 2000
  });
};

// 跳转到其他商品详情
const goToProductDetail = (id: number) => {
  router.push(`/product/${id}`);
};
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