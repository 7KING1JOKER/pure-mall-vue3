import { defineStore } from "pinia";
import { ElNotification, ElMessage } from "element-plus";
import router from '../router/index.ts'
import type { CartItem,  RecommendedProduct } from '../api/interfaces';
import { useUserStore } from './user';
import request from '@/api/request';

const userStore = useUserStore();

export const useCartStore = defineStore("cart", {
  state: () => ({
    // 购物车商品数据 - 优先从本地存储加载
    cartItems: [] as CartItem[],
    
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
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items.filter(item => item?.selected).length;
    },
    
    // 计算选中商品总数
    totalQuantity: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items
        .filter(item => item?.selected)
        .reduce((total, item) => total + (item?.quantity || 0), 0);
    },
    
    // 计算总金额
    totalAmount: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items
        .filter(item => item?.selected)
        .reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0);
    },
    
    // 是否全选
    selectAll: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items.length > 0 && items.every(item => item?.selected);
    }
  },
  
  actions: {
    // 设置购物车步骤条步骤
    setActiveStep(step: number) {
      this.activeStep = step;
    },

    // 设置单个商品选中状态
    setSelected(Id: number) {
      // console.log('设置选中状态:', Id);
      try {
        // 从后端更新购物车商品选中状态
        this.toggleSelectCartItem(userStore.userId, Id);
      } catch (error) {
        console.error('更新购物车商品选中状态失败:', error);
        ElNotification({
          title: '更新失败',
          message: '更新购物车商品选中状态失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }

      // v-model已经会更新item.selected的值，不需要手动切换
      // console.log('商品选中状态已更新');
    },

    // 设置全选状态
    setSelectAll(value: boolean) {
      try {
        // 从后端更新购物车商品选中状态
        this.toggleSelectAll(userStore.userId, value);
      } catch (error) {
        console.error('更新购物车商品选中状态失败:', error);
        ElNotification({
          title: '更新失败',
          message: '更新购物车商品选中状态失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }

      this.cartItems.forEach(item => {
        item.selected = value;
      });
    },
    
    // 更新购物车商品数量
    updateQuantity(Id: number, quantity: number) {
      // console.log('更新购物车商品数量:', Id, quantity);
      try {
        // 从后端更新购物车商品数量
        this.updateCartItemQuantity(userStore.userId, Id, quantity);
      } catch (error) {
        console.error('更新购物车商品数量失败:', error);
        ElNotification({
          title: '更新失败',
          message: '更新购物车商品数量失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }
    },
    
    // 删除单个商品
    removeCartItem(Id: number) {
      try {
        // 从后端删除购物车商品
        this.deleteCartItem(userStore.username, Id);
      } catch (error) {
        console.error('删除购物车商品失败:', error);
        ElNotification({
          title: '删除失败',
          message: '删除购物车商品失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }

      const cartItem = this.cartItems.find(item => item.id === Id);
      if (cartItem) {
        this.cartItems = this.cartItems.filter(item => item.id !== Id);
      }

    },
    
    // 删除选中的商品
    removeSelected() {
      try {
        // 从后端删除选中购物车商品
        this.deleteSelectedItems(userStore.userId);

      } catch (error) {
        console.error('删除选中购物车商品失败:', error);
        ElNotification({
          title: '删除失败',
          message: '删除选中购物车商品失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }

      this.cartItems = this.cartItems.filter(item => !item.selected);
    },
    
    // 清空购物车
    clearCart() {
      try {
        // 清空后端购物车
        this.clearCartItems(userStore.username);
      } catch (error) {
        console.error('清空购物车失败:', error);
        ElNotification({
          title: '清空失败',
          message: '清空购物车失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }

      this.cartItems = [];
      ElNotification({
        title: '清空成功',
        message: '购物车已清空',
        type: 'success',
        duration: 2000
      });
    },
    
    // 添加商品到购物车
    addToCart(cartItem: CartItem) {
      try {
        // 调用后端保存购物车商品
        this.addCartItems(userStore.username, cartItem);
      } catch (error) {
        console.error('添加购物车商品失败:', error);
        ElNotification({
          title: '添加失败',
          message: '添加购物车商品失败，请稍后重试',
          type: 'error',
          duration: 2000
        });
        return;
      }
      
      // console.log("添加商品到购物车:", cartItem);

      // 检查是否已在购物车中
      const existingItem = this.cartItems.find(item => item.productId === cartItem.productId && item.spec === cartItem.spec);
      
      if (existingItem) {
        // 已存在则增加数量
        existingItem.quantity += 1;
      } else {
        // 生成唯一ID（使用时间戳 + 随机数）
        const newId = Date.now() + Math.floor(Math.random() * 1000);
        
        // 不存在则添加新商品
        this.cartItems.push({
          id: newId,
          productId: cartItem.productId,
          userId: cartItem.userId,
          name: cartItem.name,
          description: cartItem.description,
          price: cartItem.price,
          quantity: 1,
          selected: true,
          spec: cartItem.spec,
          imageUrl: cartItem.imageUrl
        });
      }

      // console.log("传递的购物车商品:", this.cartItems);
      
      ElNotification({
        title: '已添加到购物车',
        message: `已添加 "${cartItem.name}" 到购物车`,
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
    
    // 设置用于结算的选中商品
    setSelectedItemsForCheckout(items: CartItem[]) {
      this.selectedItemsForCheckout = items;
    },

    /**
     * 加载用户购物车商品
     * @param username 用户名
     */
    async loadCartItems(username: string) {
      try {
        const response = await request.get('/cart/getCartItems', {}, {
          params: { username }
        });
        if (response.code === 200) {
          // 确保 cartItems 始终是数组，防止后端返回非数组数据
          this.cartItems = response.data.cartItems || [];
          // console.log('this.cartItems:', this.cartItems);
        }
      } catch (error) {
        console.error('加载购物车商品失败:', error);
        ElNotification({
          title: '加载购物车失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 保存购物车商品
     * @param username 用户名
     */
    async addCartItems(username: string, cartItem: CartItem) {
      try {
        
        const response = await request.post('/cart/addCartItems', cartItem, {
          params: { username: username }
        });
        if (response.code === 200) {
          // console.log('购物车商品添加成功:', response.data);
        }
      } catch (error) {
        console.error('更新购物车商品失败:', error);
        ElNotification({
          title: '更新购物车失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 删除购物车商品
     * @param username 用户名
     * @param Id 购物车商品ID
     */
    async deleteCartItem(username: string, Id: number) {
      try {
        const response = await request.del('/cart/deleteCartItem', {}, {
          params: { username: username, Id: Id }
        });
        if (response.code === 200) {
          ElNotification({
            title: '购物车更新成功',
            message: '您的购物车商品已更新',
            type: 'success',
            duration: 2000
          });
        }
      } catch (error) {
        console.error('删除购物车商品失败:', error);
        ElNotification({
          title: '删除购物车失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 删除选中购物车商品
     * @param userId 用户ID
     */
    async deleteSelectedItems(userId: number) {
      try {
        const response = await request.del('/cart/deleteSelectedCartItems', {}, {
          params: { userId: userId }
        });
        if (response.code === 200) {
          // console.log('删除选中购物车商品成功');
        }
      } catch (error) {
        console.error('删除购物车商品失败:', error);
        ElNotification({
          title: '删除购物车失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 删除所有购物车商品
     * @param username 用户名
     */
    async clearCartItems(username: string) {
      try {
        const response = await request.del('/cart/clearCartItems', {}, {
          params: { username: username }
        });
        if (response.code === 200) {
          console.log('所有购物车商品删除成功');
        }
      } catch (error) {
        console.error('删除购物车商品失败:', error);
        ElNotification({
          title: '删除购物车失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 全选/取消全选购物车商品
     * @param userId 用户ID
     * @param selected 是否选中
     */
    async toggleSelectAll(userId: number, selected: boolean) {
      try {
        const response = await request.put('/cart/selectedAll', {}, {
          params: { userId: userId, selected: selected }
        });
        if (response.code === 200) {
          // console.log('全选/取消全选购物车商品成功');
        }
      } catch (error) {
        console.error('全选/取消全选购物车商品失败:', error);
        ElNotification({
          title: '操作失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 设置单个商品选中状态
     * @param Id 购物车商品ID
     */
    async toggleSelectCartItem(userId: number, cartItemId: number) {
      try {
        const response = await request.put('/cart/selectedCartItem', {}, {
          params: { userId: userId, cartItemId: cartItemId }
        });
        if (response.code === 200) {
          // console.log('设置单个商品选中状态成功');
        }
      } catch (error) {
        console.error('设置单个商品选中状态失败:', error);
        ElNotification({
          title: '操作失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    },

    /**
     * 更新购物车商品数量
     * @param userId 用户ID
     * @param cartItemId 购物车商品ID
     * @param quantity 数量
     */
    async updateCartItemQuantity(userId: number, cartItemId: number, quantity: number) {
      try {
        const response = await request.put('/cart/updateCartItemQuantity', {}, {
          params: { userId: userId, cartItemId: cartItemId, quantity: quantity }
        });
        if (response.code === 200) {
          // console.log('更新购物车商品数量成功');
        }
      } catch (error) {
        console.error('更新购物车商品数量失败:', error);
        ElNotification({
          title: '操作失败',
          message: '请稍后重试',
          type: 'error',
          duration: 2000
        });
      }
    }
  }
});