import { defineStore } from "pinia";
import { ElNotification, ElMessage } from "element-plus";
import router from '../router/index.ts'
import type { CartItem } from '../api/interfaces';
import { useUserStore } from './user';
import request from '@/api/request';

const userStore = useUserStore();

export const useCartStore = defineStore("cart", {
  state: () => ({
    // 购物车商品列表
    cartItems: [] as CartItem[],
    
    // 当前购物车步骤条步骤
    activeStep: 0
  }),
  
  getters: {
    /**
     * 计算已选择的商品数量
     * @returns {number} 已选择商品的数量
     */
    selectedCount: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items.filter(item => item?.selected).length;
    },
    
    /**
     * 计算选中商品的总数量（包含各商品的购买数量）
     * @returns {number} 选中商品的总数量
     */
    totalQuantity: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items
        .filter(item => item?.selected)
        .reduce((total, item) => total + (item?.quantity || 0), 0);
    },
    
    /**
     * 计算选中商品的总金额
     * @returns {number} 选中商品的总金额
     */
    totalAmount: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items
        .filter(item => item?.selected)
        .reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 0)), 0);
    },
    
    /**
     * 判断是否全选商品
     * @returns {boolean} 是否全选状态
     */
    selectAll: (state) => {
      // 确保 cartItems 是数组
      const items = Array.isArray(state.cartItems) ? state.cartItems : [];
      return items.length > 0 && items.every(item => item?.selected);
    }
  },
  
  actions: {
    /**
     * 设置购物车步骤条步骤
     * @param {number} step - 要设置的步骤编号
     */
    setActiveStep(step: number) {
      this.activeStep = step;
    },

    /**
     * 设置单个商品的选中状态
     * @param {number} Id - 商品ID
     * @description 调用后端API更新选中状态，并处理错误情况
     */
    setSelected(Id: number) {
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
    },

    /**
     * 设置全选/取消全选状态
     * @param {boolean} value - 是否全选
     * @description 调用后端API更新所有商品的选中状态
     */
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
    
    /**
     * 更新购物车商品数量
     * @param {number} Id - 商品ID
     * @param {number} quantity - 新的数量
     * @description 调用后端API更新商品数量，并处理错误情况
     */
    updateQuantity(Id: number, quantity: number) {
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
    
    /**
     * 删除单个商品
     * @param {number} Id - 商品ID
     * @description 调用后端API删除商品，并更新本地购物车数据
     */
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
    
    /**
     * 删除所有选中的商品
     * @description 调用后端API删除选中商品，并更新本地购物车数据
     */
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
    
    /**
     * 清空购物车
     * @description 调用后端API清空购物车，并更新本地购物车数据
     */
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
    
    /**
     * 添加商品到购物车
     * @param {CartItem} cartItem - 要添加的商品信息
     * @description 调用后端API保存商品，并更新本地购物车数据
     */
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

      ElMessage.success({
        message: `已添加 "${cartItem.name}" 到购物车`,
        duration: 2000
      });
    },
    
    /**
     * 跳转至商品分类页面
     */
    goShopping() {
      router.push('/category');
    },
    
    /**
     * 结算选中商品
     * @returns {Promise<void>}
     * @description 检查选中商品并跳转至结算页面
     */
    async checkout() {
      // 检查是否有选中商品
      if (this.selectedCount === 0) {
        ElMessage.error('请至少选择一件商品进行结算');
        return;
      }

      // 动态导入以避免循环依赖
      const { useOrderStore } = await import('./order');
      const orderStore = useOrderStore();
      
      // 获取选中的商品，用于传递给订单页面
      const selectedItems = this.cartItems.filter(item => item.selected);
      orderStore.selectedItemsForCheckout = selectedItems;

      // 从购物车中删除选中商品 包括前后端
      this.removeSelected();

      // 跳转到结算页面
      router.push('/checkout');
    },

    /**
     * 加载用户购物车商品
     * @param {string} username - 用户名
     * @returns {Promise<void>}
     * @description 从后端获取用户的购物车商品数据
     */
    async loadCartItems(username: string) {
      try {
        const response = await request.get('/cart/getCartItems', {}, {
          params: { username }
        });
        if (response.code === 200) {
          // 确保 cartItems 始终是数组，防止后端返回非数组数据
          this.cartItems = response.data.cartItems || [];
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
     * @param {string} username - 用户名
     * @param {CartItem} cartItem - 要保存的商品信息
     * @returns {Promise<void>}
     */
    async addCartItems(username: string, cartItem: CartItem) {
      try {
        const response = await request.post('/cart/addCartItems', cartItem, {
          params: { username: username }
        });
        if (response.code === 200) {
          // 商品添加成功
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
     * @param {string} username - 用户名
     * @param {number} Id - 商品ID
     * @returns {Promise<void>}
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
     * @param {number} userId - 用户ID
     * @returns {Promise<void>}
     */
    async deleteSelectedItems(userId: number) {
      try {
        const response = await request.del('/cart/deleteSelectedCartItems', {}, {
          params: { userId: userId }
        });
        if (response.code === 200) {
          // 选中商品删除成功
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
     * @param {string} username - 用户名
     * @returns {Promise<void>}
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
     * @param {number} userId - 用户ID
     * @param {boolean} selected - 是否选中
     * @returns {Promise<void>}
     */
    async toggleSelectAll(userId: number, selected: boolean) {
      try {
        const response = await request.put('/cart/selectedAll', {}, {
          params: { userId: userId, selected: selected }
        });
        if (response.code === 200) {
          // 全选/取消全选操作成功
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
     * @param {number} userId - 用户ID
     * @param {number} cartItemId - 购物车商品ID
     * @returns {Promise<void>}
     */
    async toggleSelectCartItem(userId: number, cartItemId: number) {
      try {
        const response = await request.put('/cart/selectedCartItem', {}, {
          params: { userId: userId, cartItemId: cartItemId }
        });
        if (response.code === 200) {
          // 设置商品选中状态操作成功
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
     * @param {number} userId - 用户ID
     * @param {number} cartItemId - 购物车商品ID
     * @param {number} quantity - 新的数量
     * @returns {Promise<void>}
     */
    async updateCartItemQuantity(userId: number, cartItemId: number, quantity: number) {
      try {
        const response = await request.put('/cart/updateCartItemQuantity', {}, {
          params: { userId: userId, cartItemId: cartItemId, quantity: quantity }
        });
        if (response.code === 200) {
          // 更新商品数量操作成功
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