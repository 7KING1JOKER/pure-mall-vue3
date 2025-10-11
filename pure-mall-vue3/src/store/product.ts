import { defineStore } from "pinia";
import { ElNotification } from "element-plus";
import { productData } from "../store/category";
import { productDatabase } from "@/api/productDatabase";
import type { Product, RelatedProduct } from "@/api/productDatabase";

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
    productDatabase: productDatabase
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
      let foundProduct = this.productDatabase.find((p: Product) => p.id === productId);
      
      // 如果没有找到商品，动态创建一个基于ID的商品详情
      if (!foundProduct) {
        // 从ID推断商品类型和名称（基于category.ts中的数据结构）
        // const categoryType = Math.floor(productId / 1000); // 不再使用的变量
        let productType = '服装';
        let baseImage = 'https://via.placeholder.com/800x800?text=产品图片';
        
        // 根据ID范围设置不同的商品类型
        if (productId >= 1001 && productId <= 1020) {
          productType = '上衣';
          baseImage = 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop';
        } else if (productId >= 1021 && productId <= 1032) {
          productType = '下装';
          baseImage = 'https://images.unsplash.com/photo-1601747465107-1beb1c562334?q=80&w=987&auto=format&fit=crop';
        } else if (productId >= 1033 && productId <= 1036) {
          productType = '鞋子';
          baseImage = 'https://images.unsplash.com/photo-1578314921455-34dd4626b38d?q=80&w=987&auto=format&fit=crop';
        } else if (productId >= 1037 && productId <= 1040) {
          productType = '配饰';
          baseImage = 'https://images.unsplash.com/photo-1747257490779-5bdae916478f?q=80&w=987&auto=format&fit=crop';
        } else if (productId >= 1041 && productId <= 1044) {
          productType = '内衣';
          baseImage = 'https://images.unsplash.com/photo-1640765937555-6f413ed1d936?q=80&w=987&auto=format&fit=crop';
        } else if (productId >= 1045 && productId <= 1048) {
          productType = '箱包';
          baseImage = 'https://images.unsplash.com/photo-1541267732407-8f72c182cf11?q=80&w=987&auto=format&fit=crop';
        }
        
        // 创建动态商品详情
        foundProduct = {
          id: productId,
          name: `精品${productType} #${productId}`,
          brief: `高品质${productType}，舒适透气，时尚百搭`,
          price: 99 + Math.floor(productId % 100), // 基于ID生成价格
          sales: 500 + Math.floor(productId % 500), // 基于ID生成销量
          images: [baseImage, baseImage, baseImage],
          specs: [
            { id: 1, name: '白色', price: 99 + Math.floor(productId % 100), stock: 100 },
            { id: 2, name: '黑色', price: 99 + Math.floor(productId % 100), stock: 80 },
            { id: 3, name: '灰色', price: 99 + Math.floor(productId % 100), stock: 60 }
          ],
          detail: `<div style="padding: 20px;"><h2>产品详情</h2><p>本款${productType}采用优质面料制作，舒适透气，时尚百搭，适合各种场合穿着。</p><h3>产品特点</h3><ul><li>优质面料，舒适亲肤</li><li>时尚设计，百搭款式</li><li>精致做工，耐洗耐穿</li><li>多色可选，满足不同需求</li></ul></div>`,
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
              avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user' + productId,
              rating: 5,
              content: '质量很好，穿着舒适，非常满意！',
              date: '2023-10-15'
            },
            {
              id: 2,
              user: '顾客乙',
              avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=user' + (productId + 1),
              rating: 4,
              content: '整体不错，性价比高，推荐购买。',
              date: '2023-10-10'
            }
          ]
        };
      }
      
      // 设置当前商品
      this.product = foundProduct;
      // 初始化选中第一个规格
      if (foundProduct.specs && foundProduct.specs.length > 0) {
        this.selectedSpec = foundProduct.specs[0].id;
      }
      
      // 加载相关推荐商品（排除当前商品）
        // 从productData中选择4个不同的商品作为推荐
        const shuffledProducts = [...productData].sort(() => 0.5 - Math.random());
        this.relatedProducts = shuffledProducts
          .filter(p => p.id !== productId)
          .slice(0, 4)
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image
          }));
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