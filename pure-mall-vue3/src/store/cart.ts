import { defineStore } from "pinia";
import { ElNotification, ElMessage } from "element-plus";
import router from '../router/index.ts'

// 购物车商品类型定义
interface CartItem {
  id: number;
  name: string;
  description: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}

// 推荐商品类型定义
interface RecommendedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    // 购物车商品数据
    cartItems: [
      {
        id: 1,
        name: '无线蓝牙降噪耳机',
        description: '智能主动降噪，持久续航',
        spec: '黑色',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        selected: true
      },
      {
        id: 2,
        name: '便携式咖啡机',
        description: '一键萃取，3分钟享受现磨咖啡',
        spec: '白色',
        price: 399,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1645356894529-8c3b231fbbbe?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        selected: true
      },
      {
        id: 3,
        name: '智能手表 GT3 Pro',
        description: '全天健康监测，50米防水',
        spec: '银色',
        price: 1299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        selected: true
      }
    ] as CartItem[],
    
    // 为您推荐商品
    recommendedProducts: [
      {
        id: 4,
        name: '无线充电器',
        description: '多设备同时充，智能快充',
        price: 149,
        image: 'https://images.unsplash.com/photo-1656185933032-923de7ef1b61?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: 5,
        name: '桌面风扇',
        description: '静音柔风，三档调节',
        price: 79,
        image: 'https://images.unsplash.com/photo-1656428005715-74cbf05fdefb?q=80&w=1603&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: 6,
        name: '折叠蓝牙键盘',
        description: '便携设计，智能连接',
        price: 189,
        image: 'https://images.unsplash.com/photo-1697022976761-67a1b0955cff?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      },
      {
        id: 7,
        name: '便携水杯',
        description: '食品级材质，防漏设计',
        price: 59,
        image: 'https://images.unsplash.com/photo-1591224823040-88dfe36bcab5?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      }
    ] as RecommendedProduct[],
    
    // 当前步骤（购物车流程）
    activeStep: 1
  }),
  
  getters: {
    // 计算已选择的商品数量
    selectedCount: (state) => {
      return state.cartItems.filter(item => item.selected).length;
    },
    
    // 计算商品总数
    totalQuantity: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    
    // 计算总金额
    totalAmount: (state) => {
      return state.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // 是否全选
    selectAll: (state) => {
      return state.cartItems.length > 0 && state.cartItems.every(item => item.selected);
    }
  },
  
  actions: {
    // 设置全选状态
    setSelectAll(value: boolean) {
      this.cartItems.forEach(item => {
        item.selected = value;
      });
    },
    
    // 更新总金额（用于触发响应式更新）
    updateTotal() {
      // 该方法只是为了触发computed重新计算
      // 无需具体逻辑，computed会自动依赖track
    },
    
    // 删除单个商品
    removeItem(index: number) {
      this.cartItems.splice(index, 1);
    },
    
    // 删除选中的商品
    removeSelected() {
      this.cartItems = this.cartItems.filter(item => !item.selected);
    },
    
    // 清空购物车
    clearCart() {
      this.cartItems = [];
    },
    
    // 添加商品到购物车
    addToCart(product: any) {
      // 检查是否已在购物车中
      const existingItem = this.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 已存在则增加数量
        existingItem.quantity += 1;
      } else {
        // 不存在则添加新商品
        this.cartItems.push({
          ...product,
          quantity: 1,
          selected: true,
          spec: '默认'
        });
      }
      
      ElNotification({
        title: '已添加到购物车',
        message: `已添加 "${product.name}" 到购物车`,
        type: 'success',
        duration: 2000
      });
    },
    
    // 添加到收藏夹
    addToWishlist(item: any) {
      ElNotification({
        title: '已添加到收藏',
        message: `已将 "${item.name}" 添加到收藏夹`,
        type: 'info',
        duration: 2000
      });
    },
    
    // 去购物
    goShopping() {
      router.push('/');
    },
    
    // 结算
    checkout() {
      // 检查是否有选中商品
      if (this.selectedCount === 0) {
        ElMessage.error('请至少选择一件商品进行结算');
        return;
      }
      
      router.push('/checkout');
    },
    
    // 从本地存储加载购物车数据
    loadCartFromStorage() {
      try {
        const cartData = localStorage.getItem('shoppingCart');
        if (cartData) {
          this.cartItems = JSON.parse(cartData);
        }
      } catch (error) {
        console.error('加载购物车数据失败:', error);
      }
    },
    
    // 保存购物车数据到本地存储
    saveCartToStorage() {
      try {
        localStorage.setItem('shoppingCart', JSON.stringify(this.cartItems));
      } catch (error) {
        console.error('保存购物车数据失败:', error);
      }
    }
  }
});