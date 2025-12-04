import { defineStore } from "pinia";
import { productDatabase } from "@/api/productDatabase";
import type { Product, RelatedProduct } from "../api/interfaces";
import request from "@/api/request";

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
    
    // 从api/productDatabase导入的完整商品数据库
    productDatabase: productDatabase,

    // 商品详情对话框可见性
    productDetailsDialogVisible: false,
    
    // 商品规格对话框可见性
    productSizeDialogVisible: false,
    
    // 控制尺码说明展开/收起状态
    isGuiderExpanded: false,

    // 商品尺码列表
    productSizeList: [
      { id: 1, size: 'S', detail: '175/92A' },
      { id: 2, size: 'M', detail: '178/95A' },
      { id: 3, size: 'L', detail: '181/98A' },
      { id: 4, size: 'XL', detail: '184/101A' },
    ] ,

    // 默认商品详情
    defaultProduct: {
      id: 0,
      name: '精品',
      brief: '高品质，舒适透气，时尚百搭',
      price: 99, // 基于ID生成价格
      sales: 500, // 基于ID生成销量
      images: [
        'https://via.placeholder.com/300x300?text=图片1',
        'https://via.placeholder.com/300x300?text=图片2',
        'https://via.placeholder.com/300x300?text=图片3',
      ],
      image: 'https://via.placeholder.com/300x300?text=暂无图片',
      specs: [
        { id: 1, name: '白色', price: 99, stock: 100 },
        { id: 2, name: '黑色', price: 99, stock: 80 },
        { id: 3, name: '灰色', price: 99, stock: 60 }
      ],
      detail: `<div style="padding: 20px;"><h2>产品详情</h2><p>本款采用优质面料制作，舒适透气，时尚百搭，适合各种场合穿着。</p><h3>产品特点</h3><ul><li>优质面料，舒适亲肤</li><li>时尚设计，百搭款式</li><li>精致做工，耐洗耐穿</li><li>多色可选，满足不同需求</li></ul></div>`,
      params: [
        { name: '材质', value: '优质面料' },
        { name: '版型', value: '时尚版型' },
        { name: '颜色', value: '白色/黑色/灰色' },
        { name: '尺码', value: 'S/M/L/XL/XXL' },
        { name: '适用季节', value: '四季通用' }
      ],
      reviews: [
        {
          id: 1,
          user: '顾客甲',
          avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user',
          rating: 5,
          content: '质量很好，穿着舒适，非常满意！',
          date: '2023-10-15'
        },
        {
          id: 2,
          user: '顾客乙',
          avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user',
          rating: 4,
          content: '整体不错，性价比高，推荐购买。',
          date: '2023-10-10'
        }
      ]
    }
  }),
  
  getters: {
    // 计算当前规格的库存
    currentSpecStock: (state) => {
      if (!state.product || state.selectedSpec === null) return 0;
      
      const spec = state.product?.specs?.find(s => s.id === state.selectedSpec);
      return spec ? spec.stock : 0;
    }
  },
  
  actions: {
    // 加载商品详情
    async loadProductDetail(productId: number) {
      // 在实际项目中，这里应该调用API获取商品数据
      try {
        const response = await request.get(`/product/${productId}`);
        // 检查后端响应格式
        if (response && typeof response === 'object') {
          console.log('后端响应格式:', response);
          // 根据后端Response<T>类的格式，检查code字段
          if (response.code === 200) {
            console.log(response.data);
            // 请求成功，使用response.data作为商品数据
            this.product = response.data;
          } else {
            console.error('请求失败，状态码:', response.code);
            // 这里可以添加错误处理逻辑，例如显示错误提示
            // 失败显示默认商品详情
            this.product = this.defaultProduct;
          }
        } else {
          console.error('后端响应格式错误:', response);
          // 这里可以添加错误处理逻辑，例如显示错误提示
        }
        
      } catch (error) {
        console.error('加载商品详情失败:', error);
        // 这里可以添加错误处理逻辑，例如显示错误提示
      }
      console.log("this.product:", this.product);
      // 初始化未统一信息
      if (this.product?.specs && this.product.specs.length > 0) {
        this.selectedSpec = this.product.specs[0].id;
      }
      
      // 确保商品有images属性，若没有则创建包含3个当前图片的数组
      if (this.product && this.product.image && (!this.product.images || this.product.images.length === 0)) {
        this.product.images = [this.product.image, this.product.image, this.product.image];
      }

      if(this.product && !this.product.specs) {
        this.product.specs = [
          { id: 1, name: '白色', price: 99, stock: 100 },
          { id: 2, name: '黑色', price: 99, stock: 80 },
          { id: 3, name: '灰色', price: 99, stock: 60 }
        ];
        this.selectedSpec = this.product.specs[0].id;
      }
      
      if(this.product && !this.product?.detail) {
        this.product.detail = `100% 棉 / 中温熨烫,不可干洗,需要时只可用非氯性漂白剂,平放晾干,温和机洗（最高温度30℃） 款号: 1263697001`; 
      }

      if(this.product) {
        this.product.brief = `PURE致力于革新衣橱中的经典单品，而这款${this.product.name}便是品牌设计思路的体现。这款${this.product.name}在宽松的剪裁比例中，延续休闲的圆领设计，并注入细腻的针织肌理，构筑不凡的简约质感。\n\n- 休闲版型\n- 圆领设计\n- 短袖款式\n- 罗纹收边\n\n100%棉。不含配饰/可机洗\n\n尺码M码的后衣长为64厘米`;
      }
    },
    
    // 切换展开 or 收起状态
    toggleGuider(){
      this.isGuiderExpanded = !(this.isGuiderExpanded);
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

    // 根据颜色名称获取实际颜色值
    getColorValue(colorName: string) {
      const colorMap: Record<string, string> = {
        '黑色': '#000000',
        '白色': '#FFFFFF',
        '灰色': '#808080',
        '红色': '#FF0000',
        '蓝色': '#0000FF',
        '绿色': '#00FF00',
        '黄色': '#FFFF00',
        '紫色': '#800080'
      };
      
      // 如果找不到匹配的颜色，返回默认灰色
      return colorMap[colorName] || '#808080';
    },

  }
});