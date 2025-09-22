import { defineStore } from "pinia";
import { ElNotification } from "element-plus";

// 商品规格类型定义
interface ProductSpec {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// 商品参数类型定义
interface ProductParam {
  name: string;
  value: string;
}

// 商品评价类型定义
interface ProductReview {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
  username?: string; // 用户名别名
  time?: string; // 时间别名
  images?: string[]; // 评价图片
}

// 商品类型定义
interface Product {
  id: number;
  name: string;
  brief: string;
  price: number;
  originalPrice?: number; // 原价
  sales: number;
  images: string[];
  specs: ProductSpec[];
  detail: string;
  params: ProductParam[];
  reviews: ProductReview[];
}

// 推荐商品类型定义
interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const useProductStore = defineStore("product", {
  state: () => ({
    // 当前商品详情
    product: null as Product | null,
    
    // 选中的规格
    selectedSpec: null as number | null,
    
    // 购买数量
    quantity: 1,
    
    // 相关推荐商品
    relatedProducts: [] as RelatedProduct[],
    
    // 当前图片索引
    currentImageIndex: 0,
    
    // 选项卡状态
    activeTab: 'detail',
    
    // 模拟商品数据库
    productDatabase: [
      {
        id: 1001,
        name: '无线蓝牙降噪耳机',
        brief: '智能主动降噪，持久续航，高清音质',
        price: 899,
        sales: 2356,
        images: [
          'https://splash/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop',
          'https://splash/photo-1606041011970-e412a71e980f?q=80&w=1770&auto=format&fit=crop',
          'https://splash/photo-1618478567928-a26d46e91746?q=80&w=1887&auto=format&fit=crop'
        ],
        specs: [
          { id: 1, name: '星空黑', price: 899, stock: 120 },
          { id: 2, name: '月光白', price: 899, stock: 80 },
          { id: 3, name: '海蓝色', price: 929, stock: 60 }
        ],
        detail: '<div style="padding: 20px;"><h2>产品详情</h2><p>无线蓝牙降噪耳机，采用最新主动降噪技术，有效隔绝外界噪音，让您沉浸在纯净的音乐世界。</p><h3>功能特点</h3><ul><li>智能主动降噪</li><li>40小时持久续航</li><li>IPX4防水</li><li>高清音质</li><li>快速充电</li></ul><img src="https://images.unsplash.com/photo-1546436836-07a91091f160?q=80&w=1770&auto=format&fit=crop" style="width:100%"/></div>',
        params: [
          { name: '品牌', value: 'PureSound' },
          { name: '型号', value: 'Pro X' },
          { name: '颜色', value: '星空黑/月光白/海蓝色' },
          { name: '降噪深度', value: '40dB' },
          { name: '续航时间', value: '40小时' }
        ],
        reviews: [
          {
            id: 1,
            user: '张先生',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user1',
            rating: 5,
            content: '音质非常好，降噪效果超出预期，佩戴舒适，续航能力强，值得购买！',
            date: '2023-10-15'
          },
          {
            id: 2,
            user: '李女士',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user2',
            rating: 4,
            content: '整体来说很不错，音质和降噪都很好，就是价格稍微有点高。',
            date: '2023-10-10'
          }
        ]
      },
      {
        id: 1002,
        name: '智能手表 GT3 Pro',
        brief: '全天健康监测，运动追踪，50米防水',
        price: 1999,
        sales: 1890,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1770&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1556228578-0d9a6d69fc70?q=80&w=1932&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1770&auto=format&fit=crop'
        ],
        specs: [
          { id: 4, name: '不锈钢表壳+陶瓷表背', price: 1999, stock: 90 },
          { id: 5, name: '钛金属表壳+陶瓷表背', price: 2499, stock: 40 }
        ],
        detail: '<div style="padding: 20px;"><h2>产品详情</h2><p>智能手表 GT3 Pro，搭载最新健康监测系统，支持心率、血氧、睡眠等多项健康指标监测。</p><h3>功能特点</h3><ul><li>全天候健康监测</li><li>100+运动模式</li><li>50米防水</li><li>14天超长续航</li><li>独立通话</li></ul><img src="https://images.unsplash.com/photo-1619451426727-c7a0253e4b21?q=80&w=1932&auto=format&fit=crop" style="width:100%"/></div>',
        params: [
          { name: '品牌', value: 'PureWatch' },
          { name: '型号', value: 'GT3 Pro' },
          { name: '表盘尺寸', value: '46mm' },
          { name: '材质', value: '不锈钢/钛金属' },
          { name: '续航时间', value: '14天' }
        ],
        reviews: [
          {
            id: 3,
            user: '王先生',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user3',
            rating: 5,
            content: '外观精美，功能丰富，健康监测准确，续航能力强，非常满意！',
            date: '2023-10-20'
          },
          {
            id: 4,
            user: '赵女士',
            avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user4',
            rating: 4,
            content: '功能很全面，就是价格有点高，希望后期能有更多表带选择。',
            date: '2023-10-18'
          }
        ]
      }
    ] as Product[]
  }),
  
  getters: {
    // 计算当前规格的库存
    currentSpecStock: (state) => {
      if (!state.product || state.selectedSpec === null) return 0;
      
      const spec = state.product.specs.find(s => s.id === state.selectedSpec);
      return spec ? spec.stock : 0;
    }
  },
  
  actions: {
    // 加载商品详情
    loadProductDetail(productId: number) {
      // 在实际项目中，这里应该调用API获取商品数据
      // 这里使用模拟数据
      const foundProduct = this.productDatabase.find(p => p.id === productId);
      
      if (foundProduct) {
        this.product = foundProduct;
        // 初始化选中第一个规格
        if (foundProduct.specs && foundProduct.specs.length > 0) {
          this.selectedSpec = foundProduct.specs[0].id;
        }
        
        // 加载相关推荐商品（排除当前商品）
        const currentCategoryType = Math.floor(productId / 1000);
        this.relatedProducts = this.productDatabase
          .filter(p => p.id !== productId && Math.floor(p.id / 1000) === currentCategoryType)
          .slice(0, 4)
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.images[0]
          }));
      } else {
        // 如果没有找到商品，使用默认商品
        this.product = {
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
        this.relatedProducts = [];
      }
    },
    
    // 设置选中的规格
    setSelectedSpec(specId: number) {
      this.selectedSpec = specId;
    },
    
    // 设置购买数量
    setQuantity(quantity: number) {
      this.quantity = quantity;
    },
    
    // 增加购买数量
    increaseQuantity() {
      this.quantity += 1;
    },
    
    // 减少购买数量
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    
    // 设置当前图片索引
    setCurrentImageIndex(index: number) {
      this.currentImageIndex = index;
    },
    
    // 设置选项卡状态
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
    
    // 添加到购物车
    addToCart() {
      if (this.selectedSpec === null) {
        ElNotification({
          title: '请选择规格',
          message: '请先选择商品规格',
          type: 'warning',
          duration: 2000
        });
        return false;
      }
      
      ElNotification({
        title: '已添加到购物车',
        message: this.product ? `已添加 ${this.quantity} 件 "${this.product.name}" 到购物车` : '已添加商品到购物车',
        type: 'success',
        duration: 2000
      });
      
      return true;
    },
    
    // 立即购买
    buyNow() {
      if (this.selectedSpec === null) {
        ElNotification({
          title: '请选择规格',
          message: '请先选择商品规格',
          type: 'warning',
          duration: 2000
        });
        return false;
      }
      
      return true;
    },
    
    // 添加到收藏夹
    addToWishlist() {
      ElNotification({
        title: '已添加到收藏',
        message: this.product ? `已将 "${this.product.name}" 添加到收藏夹` : '已将商品添加到收藏夹',
        type: 'info',
        duration: 2000
      });
    }
  }
});