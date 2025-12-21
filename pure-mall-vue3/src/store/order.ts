import { defineStore } from 'pinia';
import type { CartItem, Order, DeliveryMethod, PaymentMethod } from '../api/interfaces';
import request from '@/api/request';
import { useUserStore } from './user';
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus';
import router from '../router/index';

export const useOrderStore = defineStore('order', {
  state: () => ({
    // 用于结算的选中商品列表
    selectedItemsForCheckout: [] as CartItem[],
    
    // 选中的地址ID
    selectedAddressId: 0 as number,
   
    // 订单列表
    OrderList: [] as Order[],

    // 订单商品列表
    orderItems: [] as CartItem[],

    // 当前选择的配送方式
    deliveryMethod: 'standard',
    
    // 可用的配送方式列表
    deliveryMethods: [
      { value: 'standard', label: '标准配送 (免费)', fee: 0 },
      { value: 'express', label: '快速配送 (¥15.00)', fee: 15 }
    ] as DeliveryMethod[],

    // 订单备注
    orderRemark: '',

    // 当前选择的支付方式
    paymentMethod: 'alipay',
    
    // 可用的支付方式列表
    paymentMethods: [
      { 
        value: 'alipay', 
        label: '支付宝', 
        desc: '推荐使用支付宝快捷支付'
      },
      { 
        value: 'wechat', 
        label: '微信支付', 
        desc: '使用微信扫码支付'
      },
      { 
        value: 'creditcard', 
        label: '信用卡支付', 
        desc: '支持Visa、Mastercard等'
      }
    ] as PaymentMethod[],

    // 当前订单信息
    currentOrder: null as Order | null,

    // 信用卡表单数据
    cardForm: {
      number: '',
      name: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    },

    // 支付倒计时
    countdown: '15:00',
    
    /**
     * 倒计时清理函数引用
     * @type {(() => void) | null}
     */
    countdownCleanup: null as (() => void) | null
  }),

  getters: {

    /**
     * 计算配送费用
     * @returns {number} 配送费用
     */
    deliveryFee: (state) => {
      return state.deliveryMethods.find(m => m.value === state.deliveryMethod)?.fee || 0;
    },

    /**
     * 计算商品总价
     * @returns {number} 商品总价
     */
    subtotal: (state) => {
      return state.selectedItemsForCheckout.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * 计算应付总额（商品总价 + 配送费）
     * @returns {number} 应付总额
     */
    totalAmount: (state) => {
      // 计算总价和配送费
      const subtotal = state.selectedItemsForCheckout.reduce((total, item) => total + (item.price * item.quantity), 0);
      const deliveryFee = state.deliveryMethods.find(m => m.value === state.deliveryMethod)?.fee || 0;
      return subtotal + deliveryFee;
    },
    
    /**
     * 获取用户地址列表
     * @returns {Address[]} 地址列表
     */
    addresses: () => {
      return useUserStore().addresses || [];
    },

    /**
     * 获取当前默认地址
     * @returns {Address | undefined} 默认地址
     */
    defaultAddress: () => {
      const userStore = useUserStore();
      const addresses = userStore.addresses || [];
      return addresses.find(addr => addr.isDefault) || addresses[0];
    },
    
    /**
     * 获取当前订单编号
     * @returns {string} 订单编号
     */
    orderNumber: (state) => {
      return state.currentOrder?.orderNumber || '';
    },
    
    /**
     * 获取当前订单时间
     * @returns {string} 订单时间
     */
    orderTime: (state) => {
      return state.currentOrder?.orderTime || '';
    },
    
    /**
     * 获取当前订单金额
     * @returns {number} 订单金额
     */
    orderAmount: (state) => {
      return state.currentOrder?.orderAmount || 0;
    },
    
    /**
     * 获取当前订单支付时间
     * @returns {string} 支付时间
     */
    paymentTime: (state) => {
      return state.currentOrder?.paymentTime || new Date().toISOString();
    },
    
    /**
     * 获取当前订单支付方式
     * @returns {string} 支付方式
     */
    formattedPaymentMethod: (state) => {
      return state.currentOrder?.paymentMethod || '支付宝';
    }
  },

  actions: {
    
    /**
     * 选择地址
     * @param {number} addressId - 地址ID
     */
    selectAddress(addressId: number) {
      this.selectedAddressId = addressId;
    },
    
    /**
     * 确认删除地址
     * @param {number} addressId - 地址ID
     * @returns {Promise<void>}
     */
    async confirmDeleteAddress(addressId: number) {
      try {
        await ElMessageBox.confirm(
          '确定要删除这个地址吗？',
          '删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const userStore = useUserStore();
        await userStore.deleteAddress(userStore.username, addressId);
        ElMessage.success('地址删除成功');
      } catch (error) {
        // 取消删除或删除失败
        if (error !== 'cancel') {
          ElMessage.error('地址删除失败');
        }
      }
    },
    
    /**
     * 提交订单，进入支付页面
     * @returns {Promise<boolean>} 是否提交成功
     */
    async proceedToPayment() {
      // 验证是否已选择地址
      if (!this.selectedAddressId) {
        ElMessage.error('请选择收货地址');
        return false;
      }
      
      // 创建订单
      const order = this.createOrder(this.selectedAddressId);
      
      if (order) {
        // 提交成功后跳转到支付页面
        // 利用router.push返回的Promise，确保导航成功后再执行后续操作
        router.push('/payment').then(() => {
          // 清除购物车中的已选商品 - 动态导入以避免循环依赖
          import('./cart').then(({ useCartStore }) => {
            const cartStore = useCartStore();
            cartStore.removeSelected();
            console.log('购物车数据已更新');
          });
        }).catch((error) => {
          // 导航失败时的处理
          console.error('页面跳转失败:', error);
        });

        // 加入订单列表
        this.OrderList.push(order);
        // 保存当前订单到前端状态，但不立即保存到后端
        // 等待用户确认支付后，在completePayment方法中统一保存到后端
      } else {
        ElMessageBox.alert('创建订单失败，请重试', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        });
      }
      
      return true;
    },

    /**
     * 创建订单
     * @param {number} selectedAddressId - 选中的地址ID
     * @returns {Order | null} 创建的订单或null
     */
    createOrder(selectedAddressId: number) {
      const userStore = useUserStore();
      const addresses = userStore.addresses || [];
      
      // 获取选中的地址，如果没有指定则使用默认地址
      let selectedAddr;
      if (selectedAddressId) {
        // 根据ID查找选中的地址
        selectedAddr = addresses.find(addr => addr.id == selectedAddressId);
      }

      // 如果没有找到指定地址或没有指定ID，则使用默认地址或第一个地址
      selectedAddr = selectedAddr || addresses.find(addr => addr.isDefault) || addresses[0];
      
      // 检查是否找到地址
      if (!selectedAddr) {
        console.error('无法找到收货地址，请先添加收货地址');
        return null;
      }
      
      // 获取当前登录用户ID
      const userId = userStore.userId || 0;
      
      // 构建完整地址
      const complete_receiverAddress = `${selectedAddr.province} ${selectedAddr.city} ${selectedAddr.district} ${selectedAddr.detail}`;
      
      const order: Order = {
        orderNumber: 'PO' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
        userId,
        orderTime: new Date().toISOString(),
        orderAmount: this.totalAmount,
        paymentMethod: this.getPaymentMethodName(this.paymentMethod),
        status: 'pending',
        receiverName: selectedAddr.name || '',
        receiverPhone: selectedAddr.phone || '',
        receiverAddress: complete_receiverAddress,
        remark: this.orderRemark,
        orderItems: this.selectedItemsForCheckout,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
      };
      
      this.currentOrder = order;
      return order;
    },

    /**
     * 获取支付方式中文名称
     * @param {string} method - 支付方式代码
     * @returns {string} 支付方式中文名称
     */
    getPaymentMethodName(method: string) {
      const methodMap: Record<string, string> = {
        alipay: '支付宝',
        wechat: '微信支付',
        creditcard: '信用卡'
      };
      return methodMap[method] || method;
    },

    /**
     * 启动支付倒计时
     * @param {(() => void) | undefined} callback - 倒计时结束时的回调函数
     */
    startCountdown(callback?: () => void) {
      let minutes = 15;
      let seconds = 0;
      let countdownInterval: number | null = null;

      countdownInterval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(countdownInterval as number);
            callback?.();
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }

        this.countdown = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }, 1000);

      // 保存清理函数到state
      this.countdownCleanup = () => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      };
    },

    /**
     * 根据订单号获取订单
     * @param {string} orderNumber - 订单号
     * @returns {Order | undefined} 订单对象或undefined
     */
    getOrderByNumber(orderNumber: string): Order | undefined {
      return this.OrderList.find(order => order.orderNumber === orderNumber);
    },
    
    /**
     * 根据订单号获取订单详情
     * @param {number} userId - 用户ID
     * @param {string} orderNumber - 订单号
     * @returns {Promise<void>}
     */
    async getOrderDetailByOrderNumber(userId: number, orderNumber: string) {
      try {
        // GET请求通常不需要请求体，所以只需要传递URL
        const response = await request.get(`/order/${orderNumber}`, {}, {
          params: { userId: userId, orderNumber: orderNumber }
        });
    
        // 检查响应数据是否存在
        const orderDetail = response.data.order || null;
        if (orderDetail) {
          console.log('订单详情数据:', orderDetail);
          console.log('订单商品列表:', orderDetail.orderItems);
          this.OrderList.push(orderDetail);
          this.currentOrder = orderDetail;
        }
        console.log('获取订单详情成功:', orderDetail);
      } catch (error) {
        console.error('获取订单详情失败:', error);
      }
    },

    /**
     * 根据订单编号删除订单
     * @param {string} orderNumber - 订单编号
     * @returns {Promise<void>}
     */
    async deleteOrder(orderNumber: string){
      try {
        // DELETE请求通常不需要请求体，所以只需要传递URL
        const response = await request.del(`/order/deleteOrder`, {}, {
          params: { orderNumber: orderNumber }
        });
        if (response.message === 'success') {
          ElMessage.success('订单已成功删除');
        } else {
          ElMessage.error('删除订单失败，请稍后重试');
        }
        
        // 从userStore的orders数组中移除对应的订单
        const { useUserStore } = await import('./user');
        const userStore = useUserStore();
        const orderIndex = userStore.orders.findIndex(order => order.orderNumber === orderNumber);
        if (orderIndex !== -1) {
          userStore.orders.splice(orderIndex, 1);
        }

      } catch (error) {
        console.error('删除订单失败:', error);
      }
    },

    /**
     * 添加订单
     * @param {number} userId - 用户ID
     * @param {Order} order - 订单对象
     * @returns {Promise<void>}
     */
    async addOrder(userId: number, order: Order) {
      try {
        // POST请求通常需要请求体，所以传递order对象作为请求体
        const response = await request.post('/order/addOrder', order, {
          params: { userId: userId }
        });
        console.log('添加订单成功:', response);

      } catch (error) {
        console.error('添加订单失败:', error);
        ElMessage.error('添加订单失败，请重试');
        // 重新抛出异常，以便上层调用者能够捕获
        throw error;
      }
    },
    
    /**
     * 确认支付
     * @returns {Promise<void>}
     */
    async completePayment() {
      
      // 验证信用卡信息
      if (this.paymentMethod === 'creditcard') {
        if (!this.cardForm.number || !this.cardForm.name || !this.cardForm.expiryMonth || !this.cardForm.expiryYear || !this.cardForm.cvv) {
          ElMessage.error('请填写完整的信用卡信息');
          return;
        }
      }
      
      // 模拟支付处理
      ElNotification({
        title: '支付处理中',
        message: '正在处理您的支付请求，请稍候...',
        type: 'info',
        duration: 2000
      });
      
      // 保存完整订单数据，供OrderDetail页面展示
      if (this.currentOrder) {
        // 更新订单状态为已支付
        const updatedOrder = {
          ...this.currentOrder,
          status: 'paid' as 'paid',
          paymentTime: new Date().toISOString()
        };
        
        // 更新当前订单
        this.currentOrder = updatedOrder;
        
        // 查找并更新OrderList中对应的订单
        const orderIndex = this.OrderList.findIndex(order => order.orderNumber === updatedOrder.orderNumber);
        if (orderIndex !== -1) {
          this.OrderList[orderIndex] = updatedOrder;
        } else {
          // 如果找不到，才添加到OrderList
          this.OrderList.push(updatedOrder);
        }
        
        // 保存订单到用户store
        const { useUserStore } = await import('./user');
        const userStore = useUserStore();
        
        // 查找并更新userStore.orders中对应的订单
        const userOrderIndex = userStore.orders.findIndex(order => order.orderNumber === updatedOrder.orderNumber);
        if (userOrderIndex !== -1) {
          userStore.orders[userOrderIndex] = updatedOrder;
        } else {
          // 如果找不到，才添加到userStore.orders
          userStore.orders.push(updatedOrder);
        }

        try {
          // 调用后端API保存订单
          await this.addOrder(userStore.userId || 0, updatedOrder);
        } catch (error) {
          router.push('/');
          return;
        }
        
        console.log('订单已保存:', updatedOrder.orderNumber);
        
        // 模拟支付成功，实际项目中这里会调用支付API
        setTimeout(() => {
          router.push('/order-complete');
        }, 2000);
      } else {
        ElMessage.error('保存订单失败，请重试');
      }
    }
  }
});