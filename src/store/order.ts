import { defineStore } from 'pinia';
import type { Order, Address, CartItem } from '../api/interfaces';
import {
  getOrderList,
  getOrderDetail,
  createOrder,
  payOrder,
  cancelOrder,
  confirmReceive,
  deleteOrder
} from '../api/order';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [] as Order[],
    currentOrder: null as Order | null,
    selectedAddress: null as Address | null,
    deliveryMethods: [
      { value: 'express', label: '快递', fee: 0 },
      { value: 'standard', label: '标准配送', fee: 10 },
      { value: 'priority', label: '加急配送', fee: 20 }
    ],
    paymentMethods: [
      { value: 'alipay', label: '支付宝' },
      { value: 'wechat', label: '微信支付' },
      { value: 'card', label: '银行卡' },
      { value: 'creditcard', label: '信用卡' }
    ],

    deliveryMethod: 'standard', // 添加deliveryMethod属性
    orderRemark: '', // 添加订单备注属性
    checkoutItems: [] as CartItem[], // 添加结算商品列表
    // 添加Payment.vue需要的属性
    paymentMethod: 'alipay', // 支付方式
    cardForm: {
      number: '',
      name: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    },
    countdown: 900, // 支付倒计时（秒）
    loading: false,
    error: null as string | null,
    currentPage: 1,
    pageSize: 10,
    totalOrders: 0,
  }),

  getters: {
    // 计算配送费用
    deliveryFee(): number {
      // 使用deliveryMethod而不是selectedDeliveryMethod
      const method = this.deliveryMethods.find(m => m.value === this.deliveryMethod);
      return method?.fee || 0;
    },

    // 计算订单商品总价
    productTotal(): number {
      // 从checkoutItems计算总价
      return this.checkoutItems.reduce((total, item) => {
        return total + (item.price || 0) * (item.quantity || 0);
      }, 0);
    },

    // 计算应付总额
    totalAmount(): number {
      return this.productTotal + this.deliveryFee;
    },

    // 获取支付方式名称
    getPaymentMethodName: (_state) => {
      return (method: string): string => {
        const paymentMethods = [
          { value: 'alipay', label: '支付宝' },
          { value: 'wechat', label: '微信支付' },
          { value: 'card', label: '银行卡' },
          { value: 'creditcard', label: '信用卡' }
        ];
        const paymentMethod = paymentMethods.find(m => m.value === method);
        return paymentMethod?.label || method;
      };
    },
    
    // 根据订单编号获取订单
    getOrderByNumber: (state) => {
      return (orderNumber: string) => {
        // 首先检查当前订单是否匹配
        if (state.currentOrder && state.currentOrder.orderNumber === orderNumber) {
          return state.currentOrder;
        }
        // 在订单列表中查找
        return (state.orders || []).find(order => order.orderNumber === orderNumber) || null;
      };
    },
    
    // 获取订单状态文本
    getOrderStatusText: () => (status: string): string => {
      const statusMap: Record<string, string> = {
        'pending_payment': '待付款',
        'pending_shipment': '待发货',
        'pending_receipt': '待收货',
        'completed': '已完成',
        'cancelled': '已取消',
        'refunded': '已退款'
      };
      return statusMap[status] || status;
    },
  },

  actions: {
    // 加载订单列表
    async loadOrderList(page: number = 1, pageSize: number = 10, status?: string) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await getOrderList({ page, pageSize, status });
        
        if (response && response.code === 200 && response.data) {
          // 假设后端返回的数据结构包含list和total
          this.orders = Array.isArray(response.data) ? response.data : response.data.list || [];
          this.totalOrders = response.data.total || this.orders.length;
          this.currentPage = page;
          this.pageSize = pageSize;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载订单列表失败';
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载订单列表失败:', err);
      } finally {
        this.loading = false;
      }
    },

    // 加载订单详情
    async loadOrderDetail(orderNumber: string) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await getOrderDetail(orderNumber);
        
        if (response && response.code === 200 && response.data) {
          this.currentOrder = response.data;
          return response.data;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '加载订单详情失败';
          return null;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('加载订单详情失败:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 创建订单
    async createOrderAction(addressId: number, cartItemIds: number[], remark?: string) {
      try {
        this.loading = true;
        this.error = null;
        
        const response = await createOrder({
          addressId,
          cartItemIds,
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          remark
        });
        
        if (response && response.code === 200 && response.data) {
          // 创建成功，刷新订单列表
          await this.loadOrderList();
          return response.data.orderNumber;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '创建订单失败';
          return null;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('创建订单失败:', err);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // 支付订单
    async payOrderAction(orderNumber: string) {
      try {
        this.loading = true;
        const response = await payOrder(orderNumber, this.paymentMethod);
        
        if (response && response.code === 200) {
          // 支付成功，刷新订单详情
          await this.loadOrderDetail(orderNumber);
          await this.loadOrderList();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '支付失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('支付失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 同步购物车选中商品
    syncCartItems(items: CartItem[]) {
      this.checkoutItems = items;
    },
    
    // 创建订单（非异步版本，供Checkout.vue使用）
    createOrder(addressId: string): Order | null {
      try {
        // 准备订单数据
        const orderData: Order = {
          id: Date.now(),
          orderNumber: 'ORD' + Date.now(),
          addressId: parseInt(addressId),
          orderTime: new Date().toISOString(),
          orderAmount: this.totalAmount,
          receiverAddress: this.selectedAddress ? this.selectedAddress.detail : '',
          orderItems: this.checkoutItems.map(item => ({
            id: 0,
            orderId: 0,
            productId: item.productId,
            specId: item.specId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            imageUrl: item.image || item.imageUrl,
            image: item.image || item.imageUrl,
            spec: item.spec || '',
            selected: !!item.selected
          })),
          items: this.checkoutItems.map(item => ({
            id: 0,
            orderId: 0,
            productId: item.productId,
            specId: item.specId,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            imageUrl: item.image || item.imageUrl,
            image: item.image || item.imageUrl,
            spec: item.spec || '',
            selected: !!item.selected
          })),
          deliveryMethod: this.deliveryMethod,
          paymentMethod: this.paymentMethod,
          remark: this.orderRemark,
          totalAmount: this.totalAmount,
          status: 'pending_payment',
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString()
        };
        
        // 设置当前订单
        this.currentOrder = orderData;
        
        // 这里可以异步调用后端API，但为了避免阻塞，先返回模拟订单
        // 实际项目中应该调用this.createOrderAction
        return orderData;
      } catch (err) {
        console.error('创建订单失败:', err);
        return null;
      }
    },
    
    // 取消订单
    async cancelOrderAction(orderNumber: string) {
      try {
        this.loading = true;
        const response = await cancelOrder(orderNumber);
        
        if (response && response.code === 200) {
          // 取消成功，刷新订单列表和详情
          await this.loadOrderDetail(orderNumber);
          await this.loadOrderList();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '取消订单失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('取消订单失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 确认收货
    async confirmReceiveAction(orderNumber: string) {
      try {
        this.loading = true;
        const response = await confirmReceive(orderNumber);
        
        if (response && response.code === 200) {
          // 确认成功，刷新订单列表和详情
          await this.loadOrderDetail(orderNumber);
          await this.loadOrderList();
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '确认收货失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('确认收货失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 删除订单
    async deleteOrderAction(orderNumber: string) {
      try {
        this.loading = true;
        const response = await deleteOrder(orderNumber);
        
        if (response && response.code === 200) {
          // 删除成功，刷新订单列表
          await this.loadOrderList();
          // 如果删除的是当前订单，清空当前订单
          if (this.currentOrder && this.currentOrder.orderNumber === orderNumber) {
            this.currentOrder = null;
          }
          return true;
        } else {
          const resp = response as any;
          this.error = (resp && resp.message) || '删除订单失败';
          return false;
        }
      } catch (err) {
        this.error = '网络错误，请稍后重试';
        console.error('删除订单失败:', err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    // 选择地址
    selectAddress(address: Address) {
      this.selectedAddress = address;
    },

    // 选择配送方式
    selectDeliveryMethod(method: string) {
      this.deliveryMethod = method;
    },

    // 选择支付方式
    selectPaymentMethod(method: string) {
      this.paymentMethod = method;
    },



    // 启动支付倒计时
    startCountdown(onTimeout?: () => void): () => void {
      let timer: number | null = null;
      
      const updateCountdown = () => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          if (onTimeout) {
            onTimeout();
          }
        }
      };
      
      // 立即更新一次
      updateCountdown();
      // 设置定时器
      timer = window.setInterval(updateCountdown, 1000);
      
      // 返回清理函数
      return () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      };
    },
    
    // 完成支付
    completePayment() {
      // 模拟支付处理
      console.log('处理支付...', this.paymentMethod);
      
      // 实际项目中这里应该调用支付API
      // 这里只是简单模拟
      if (this.currentOrder) {
        this.currentOrder.status = 'pending_shipment';
        this.currentOrder.paymentTime = new Date().toISOString();
        this.currentOrder.paymentMethod = this.getPaymentMethodName(this.paymentMethod);
      }
    },
    
    // 保存完整订单
    saveCompleteOrder(paymentData: Partial<Order>): Order | null {
      if (!this.currentOrder) return null;
      
      // 更新订单数据
      Object.assign(this.currentOrder, paymentData);
      
      // 添加到订单列表
      this.orders.unshift({ ...this.currentOrder });
      
      return this.currentOrder;
    },
    
    // 重置订单相关状态
    resetOrderState() {
      this.selectedAddress = null;
      this.deliveryMethod = 'express';
      this.paymentMethod = 'alipay';
      this.cardForm = {
        number: '',
        name: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
      };
      this.countdown = 900;
      this.checkoutItems = [];
      this.error = null;
    },
    
    // 清除订单状态（用于支付完成后）
    clearOrderState() {
      this.currentOrder = null;
      this.checkoutItems = [];
      this.resetOrderState();
    },
  },
});