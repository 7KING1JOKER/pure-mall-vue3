import { defineStore } from 'pinia';
import type { CartItem, WishlistItem } from '../api/interfaces';
import {
  getCartList,
  addToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getSelectedCartItems,
  clearCart
} from '../api/cart';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../api/wishlist';

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: [] as CartItem[],
    selectedItemsForCheckout: [] as CartItem[],
    wishlist: [] as WishlistItem[],
    loading: false,
    error: null as string | null,
    activeStep: 0, // 当前步骤，从0开始
  }),

  getters: {
    // 计算购物车总商品数
    totalItems: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },
    // 别名：总数量
    totalQuantity: (state) => {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0);
    },

    // 计算选中商品数量
    selectedItemsCount: (state) => {
      return state.selectedItemsForCheckout.length;
    },
    // 别名：选中数量
    selectedCount: (state) => {
      return state.selectedItemsForCheckout.length;
    },

    // 计算选中商品的总金额
    totalPrice: (state) => {
      return state.selectedItemsForCheckout
        .reduce((total, item) => {
          // 使用后端CartItem中的price字段
          return total + item.price * item.quantity;
        }, 0);
    },
    // 别名：总金额
    totalAmount: (state) => {
      return state.selectedItemsForCheckout
        .reduce((total, item) => {
          return total + item.price * item.quantity;
        }, 0);
    },

    // 判断是否全选
    isAllSelected: (state) => {
      return state.cartItems.length > 0 && 
             state.cartItems.length === state.selectedItemsForCheckout.length;
    },
    // 别名：全选状态
    selectAll: (state) => {
      return state.cartItems.length > 0 && 
             state.cartItems.length === state.selectedItemsForCheckout.length;
    },

  },

  actions: {
    // 设置当前步骤
    setActiveStep(step: number) {
      this.activeStep = step;
    },

    // 从API加载购物车数据
    async loadCartData() {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await getCartList();
        
        if (response && response.code === 200 && Array.isArray(response.data)) {
          this.cartItems = response.data;
          // 初始化时不选中任何商品
          this.selectedItemsForCheckout = [];
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载购物车失败';
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载购物车失败:', err);
      } finally {
        this.loading = false;
      }
    },

    // 添加商品到购物车
    async addToCart(productId: number, specId: number, quantity: number) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await addToCart({
          productId,
          specId,
          quantity
        });
        
        if (response && response.code === 200) {
          // 添加成功后重新加载购物车
          await this.loadCartData();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '添加到购物车失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('添加到购物车失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 更新购物车商品数量
    async updateQuantity(cartItemId: number, quantity: number) {
      try {
        this.loading = true;
        const response = await updateCartItemQuantity(cartItemId, quantity);
        
        if (response && response.code === 200) {
          // 更新成功后重新加载购物车
          await this.loadCartData();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '更新数量失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('更新数量失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 删除购物车商品
    async removeFromCart(cartItemId: number) {
      try {
        this.loading = true;
        const response = await deleteCartItem(cartItemId);
        
        if (response && response.code === 200) {
          // 从选中列表中移除
          this.selectedItemsForCheckout = this.selectedItemsForCheckout.filter(
            item => item.id !== cartItemId
          );
          // 删除成功后重新加载购物车
          await this.loadCartData();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '删除商品失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('删除商品失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 清空购物车
    async clearCartData() {
      try {
        this.loading = true;
        const response = await clearCart();
        
        if (response && response.code === 200) {
          this.cartItems = [];
          this.selectedItemsForCheckout = [];
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '清空购物车失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('清空购物车失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 选择/取消选择商品
    toggleItemSelection(cartItemId: number) {
      const index = this.selectedItemsForCheckout.findIndex(item => item.id === cartItemId);
      if (index > -1) {
        this.selectedItemsForCheckout.splice(index, 1);
      } else {
        const itemToAdd = this.cartItems.find(item => item.id === cartItemId);
        if (itemToAdd) {
          this.selectedItemsForCheckout.push(itemToAdd);
        }
      }
    },

    // 设置全选/取消全选
    setSelectAll(checked: boolean) {
      if (checked) {
        // 全选：将所有商品对象添加到选中列表
        this.selectedItemsForCheckout = [...this.cartItems];
      } else {
        // 取消全选：清空选中列表
        this.selectedItemsForCheckout = [];
      }
    },

    // 根据索引删除商品
    removeItem(index: number) {
      const item = this.cartItems[index];
      if (item) {
        return this.removeFromCart(item.id);
      }
      return false;
    },

    // 删除选中的商品
    async removeSelected() {
      try {
        this.loading = true;
        // 批量删除选中的商品
        for (const item of [...this.selectedItemsForCheckout]) {
          await this.removeFromCart(item.id);
        }
        // 清空选中列表
        this.selectedItemsForCheckout = [];
        return true;
      } catch (err) {
        this.error = '删除选中商品失败';
        console.error('删除选中商品失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 清空购物车（别名）
    async clearCart() {
      return this.clearCartData();
    },

    // 原addToWishlist函数已移除，合并到下面的实现

    // 去购物
    goShopping() {
      // 这个方法可以在组件中处理路由跳转
      return true;
    },

    // 设置选中的商品用于结算
    setSelectedItemsForCheckout(items: CartItem[]) {
      this.selectedItemsForCheckout = [...items];
    },

    // 保存购物车到本地存储
    saveCartToStorage() {
      try {
        localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
        return true;
      } catch (err) {
        console.error('保存购物车到本地存储失败:', err);
        return false;
      }
    },

    // 全选/取消全选
    toggleAllSelection() {
      if (this.isAllSelected) {
        this.selectedItemsForCheckout = [];
      } else {
        this.selectedItemsForCheckout = [...this.cartItems];
      }
    },

    // 结算
    async checkout() {
      try {
        this.loading = true;
        const response = await getSelectedCartItems();
        
        if (response && response.code === 200) {
          // 结算成功，清空选中状态
          this.selectedItemsForCheckout = [];
          return response.data;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '结算失败';
          return null;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('结算失败:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 加载收藏夹数据
    async loadWishlist() {
      try {
        this.loading = true;
        const response = await getWishlist();
        
        if (response && response.code === 200 && Array.isArray(response.data)) {
          this.wishlist = response.data;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载收藏夹失败';
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载收藏夹失败:', err);
      } finally {
        this.loading = false;
      }
    },

    // 添加到收藏夹/愿望清单
    // 支持两种调用方式：1) 直接传入productId 2) 传入包含productId和可选specId的对象
    async addToWishlist(productIdOrParams: number | { productId: number; specId?: number }) {
      try {
        this.loading = true;
        
        // 根据参数类型处理，确保始终传递number类型的productId给API
        let productId: number;
        if (typeof productIdOrParams === 'number') {
          // 直接传入productId的情况
          productId = productIdOrParams;
        } else {
          // 传入对象的情况
          productId = productIdOrParams.productId;
        }
        
        const response = await addToWishlist(productId);
        
        if (response && response.code === 200) {
          await this.loadWishlist();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '添加到收藏夹失败';
        }
        return false;
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('添加到收藏夹失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 从收藏夹移除
    async removeFromWishlist(wishlistId: number) {
      try {
        this.loading = true;
        const response = await removeFromWishlist(wishlistId);
        
        if (response && response.code === 200) {
          await this.loadWishlist();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '从收藏夹移除失败';
        }
        return false;
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('从收藏夹移除失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});