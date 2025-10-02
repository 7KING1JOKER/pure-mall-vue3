import { defineStore } from 'pinia';
// 地址接口定义
export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

// 订单项接口定义
export interface OrderItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean;
}

// 订单接口定义
export interface Order {
  id: string;
  orderNumber: string;
  orderTime: string;
  paymentTime: string;
  orderAmount: number;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  remark?: string;
}

// 配送方式接口定义
export interface DeliveryMethod {
  value: string;
  label: string;
  fee: number;
}

// 支付方式接口定义
export interface PaymentMethod {
  value: string;
  label: string;
  desc: string;
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    // 地址相关状态
    addresses: [
      {
        id: 1,
        name: '张三',
        phone: '13800138000',
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        detail: '科技园南路XX号XX大厦XX室',
        isDefault: true
      },
      {
        id: 2,
        name: '李四',
        phone: '13900139000',
        province: '广东省',
        city: '广州市',
        district: '天河区',
        detail: '天河路XX号XX公寓XX室',
        isDefault: false
      }
    ] as Address[],

    // 订单商品相关状态
    orderItems: [
      {
        id: 1,
        name: '无线蓝牙降噪耳机',
        spec: '黑色',
        price: 299,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1606220588914-08f6c7f2a8d2?w=400'
      },
      {
        id: 2,
        name: '便携式咖啡机',
        spec: '白色',
        price: 399,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1556911220-f7d27ca5528e?w=400'
      }
    ] as OrderItem[],

    // 配送方式
    deliveryMethod: 'standard',
    deliveryMethods: [
      { value: 'standard', label: '标准配送 (免费)', fee: 0 },
      { value: 'express', label: '快速配送 (¥15.00)', fee: 15 }
    ] as DeliveryMethod[],

    // 订单备注
    orderRemark: '',

    // 支付相关状态
    paymentMethod: 'alipay',
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

    // 订单信息
    currentOrder: null as Order | null,

    // 信用卡表单
    cardForm: {
      number: '',
      name: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    },

    // 倒计时
    countdown: '15:00'
  }),

  getters: {
    // 计算商品总价
    subtotal: (state) => {
      return state.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // 计算配送费用
    deliveryFee: (state) => {
      return state.deliveryMethods.find(m => m.value === state.deliveryMethod)?.fee || 0;
    },

    // 计算应付总额
    totalAmount: (state) => {
      // 重新计算总价和配送费
      const subtotal = state.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const deliveryFee = state.deliveryMethods.find(m => m.value === state.deliveryMethod)?.fee || 0;
      return subtotal + deliveryFee;
    },

    // 获取当前默认地址
    defaultAddress: (state) => {
      return state.addresses.find(addr => addr.isDefault) || state.addresses[0];
    }
  },

  actions: {
    // 选择地址
    selectAddress(index: number) {
      this.addresses.forEach((address, i) => {
        address.isDefault = i === index;
      });
    },

    // 编辑地址
    editAddress(index: number) {
      // 实际项目中这里会打开编辑地址的表单
      console.log('编辑地址：', this.addresses[index].name);
    },

    // 删除地址
    deleteAddress(index: number) {
      this.addresses.splice(index, 1);
    },

    // 添加新地址
    addNewAddress() {
      // 实际项目中这里会打开添加地址的表单
      console.log('添加新地址');
    },

    // 创建订单
    createOrder() {
      // 重新计算总价和获取默认地址
      const defaultAddr = this.addresses.find(addr => addr.isDefault) || this.addresses[0];
      const subtotal = this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
      const deliveryFee = this.deliveryMethods.find(m => m.value === this.deliveryMethod)?.fee || 0;
      const totalAmount = subtotal + deliveryFee;
      
      const order: Order = {
        id: Date.now().toString(),
        orderNumber: 'PO' + Date.now().toString().slice(-8),
        orderTime: new Date().toLocaleString(),
        paymentTime: '',
        orderAmount: totalAmount,
        paymentMethod: this.getPaymentMethodName(this.paymentMethod),
        status: 'pending',
        deliveryInfo: {
          name: defaultAddr?.name || '',
          phone: defaultAddr?.phone || '',
          address: defaultAddr ? `${defaultAddr.province} ${defaultAddr.city} ${defaultAddr.district} ${defaultAddr.detail}` : ''
        },
        items: [...this.orderItems],
        remark: this.orderRemark
      };
      
      this.currentOrder = order;
      return order;
    },

    // 完成支付
    completePayment() {
      if (!this.currentOrder) {
        this.currentOrder = this.createOrder();
      }
      
      if (this.currentOrder) {
        this.currentOrder.status = 'paid';
        this.currentOrder.paymentTime = new Date().toLocaleString();
        this.currentOrder.paymentMethod = this.getPaymentMethodName(this.paymentMethod);
      }
      
      return this.currentOrder;
    },

    // 获取支付方式名称
    getPaymentMethodName(method: string) {
      const methodMap: Record<string, string> = {
        alipay: '支付宝',
        wechat: '微信支付',
        creditcard: '信用卡'
      };
      return methodMap[method] || method;
    },

    // 启动倒计时
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

      return () => {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
      };
    },

    // 从购物车同步商品
    syncCartItems(items: OrderItem[]) {
      this.orderItems = items;
    },

    // 清空订单数据
    clearOrderData() {
      this.currentOrder = null;
      this.orderRemark = '';
      this.paymentMethod = 'alipay';
      this.deliveryMethod = 'standard';
      this.cardForm = {
        number: '',
        name: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
      };
    }
  }
});