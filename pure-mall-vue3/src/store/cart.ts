import { defineStore } from "pinia";
import { ElNotification, ElMessage } from "element-plus";
import router from '../router/index.ts'
import type { CartItem,  RecommendedProduct } from '../api/interfaces';
import { useUserStore } from './user';

// 从本地存储加载购物车数据的辅助函数
function loadCartFromStorage(): CartItem[] {
  try {
    const cartData = localStorage.getItem('shoppingCart');
    if (cartData) {
      return JSON.parse(cartData);
    }
    // 如果没有本地存储数据，返回默认商品
    return [
      {
        id: 1001,
        name: '纯棉宽松短袖T恤',
        description: '舒适透气的纯棉面料，宽松版型',
        spec: '白色',
        price: 99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        selected: true
      },
      {
        id: 1002,
        name: '男士印花短袖T恤',
        description: '时尚印花设计，休闲百搭',
        spec: '黑色',
        price: 89,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1688990982651-a5d751773eff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHNob3J0JTIwc2xlZXZlJTIwdCUyMHNoaXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D',
        selected: true
      },
      {
        id: 1003,
        name: '女士修身短袖T恤',
        description: '修身版型，展现优雅曲线',
        spec: '红色',
        price: 109,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1688404970273-4d83251d3686?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fFdvbWVuJ3MlMjBULXNoaXJ0JTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600',
        selected: true
      }
    ];
  } catch (error) {
    console.error('加载购物车数据失败:', error);
    return [];
  }
}


export const useCartStore = defineStore("cart", {
  state: () => ({
    // 购物车商品数据 - 优先从本地存储加载
    cartItems: loadCartFromStorage(),
    
    // 用于结算的选中商品
    selectedItemsForCheckout: [] as CartItem[],
    
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
    activeStep: 0
  }),
  
  getters: {
    // 计算已选择的商品数量
    selectedCount: (state) => {
      return state.cartItems.filter(item => item.selected).length;
    },
    
    // 计算选中商品总数
    totalQuantity: (state) => {
      return state.cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.quantity, 0);
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
    // 设置购物车步骤条步骤
    setActiveStep(step: number) {
      this.activeStep = step;
    },

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
      const userStore = useUserStore();
      
      // 检查登录状态
      if (!userStore.isLoggedIn) {
        ElNotification({
          title: '请先登录',
          message: '您需要登录后才能添加商品到购物车',
          type: 'warning',
          duration: 2000
        });
        return;
      }
      
      console.log("添加商品到购物车:", product);

      // 检查是否已在购物车中
      const existingItem = this.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // 已存在则增加数量
        existingItem.quantity += 1;
      } else {
        // 不存在则添加新商品
        this.cartItems.push({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: 1,
          selected: true,
          spec: '默认',
          image: product.images[0]
        });
      }

      console.log(this.cartItems);
      
      ElNotification({
        title: '已添加到购物车',
        message: `已添加 "${product.name}" 到购物车`,
        type: 'success',
        duration: 2000
      });
    },
    
    
    // 去购物
    goShopping() {
      router.push('/category');
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
    },
    
    // 设置用于结算的选中商品
    setSelectedItemsForCheckout(items: CartItem[]) {
      this.selectedItemsForCheckout = items;
    }
  }
});