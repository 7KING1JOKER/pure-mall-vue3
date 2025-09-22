import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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

export const useOrderStore = defineStore('order', () => {
  // 地址相关状态
  const addresses = ref<Address[]>([
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
  ]);

  // 订单商品相关状态
  const orderItems = ref<OrderItem[]>([
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
  ]);

  // 配送方式
  const deliveryMethod = ref('standard');
  const deliveryMethods = ref<DeliveryMethod[]>([
    { value: 'standard', label: '标准配送 (免费)', fee: 0 },
    { value: 'express', label: '快速配送 (¥15.00)', fee: 15 }
  ]);

  // 订单备注
  const orderRemark = ref('');

  // 支付相关状态
  const paymentMethod = ref('alipay');
  const paymentMethods = ref<PaymentMethod[]>([
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
  ]);

  // 订单信息
  const currentOrder = ref<Order | null>(null);

  // 信用卡表单
  const cardForm = ref({
    number: '',
    name: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  // 倒计时
  const countdown = ref('15:00');

  // 计算商品总价
  const subtotal = computed(() => {
    return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // 计算配送费用
  const deliveryFee = computed(() => {
    return deliveryMethods.value.find(m => m.value === deliveryMethod.value)?.fee || 0;
  });

  // 计算应付总额
  const totalAmount = computed(() => {
    return subtotal.value + deliveryFee.value;
  });

  // 获取当前默认地址
  const defaultAddress = computed(() => {
    return addresses.value.find(addr => addr.isDefault) || addresses.value[0];
  });

  // 选择地址
  const selectAddress = (index: number) => {
    addresses.value.forEach((address, i) => {
      address.isDefault = i === index;
    });
  };

  // 编辑地址
  const editAddress = (index: number) => {
    // 实际项目中这里会打开编辑地址的表单
    console.log('编辑地址：', addresses.value[index].name);
  };

  // 删除地址
  const deleteAddress = (index: number) => {
    addresses.value.splice(index, 1);
  };

  // 添加新地址
  const addNewAddress = () => {
    // 实际项目中这里会打开添加地址的表单
    console.log('添加新地址');
  };

  // 创建订单
  const createOrder = () => {
    const order: Order = {
      id: Date.now().toString(),
      orderNumber: 'PO' + Date.now().toString().slice(-8),
      orderTime: new Date().toLocaleString(),
      paymentTime: '',
      orderAmount: totalAmount.value,
      paymentMethod: getPaymentMethodName(paymentMethod.value),
      status: 'pending',
      deliveryInfo: {
        name: defaultAddress.value?.name || '',
        phone: defaultAddress.value?.phone || '',
        address: `${defaultAddress.value?.province} ${defaultAddress.value?.city} ${defaultAddress.value?.district} ${defaultAddress.value?.detail}`
      },
      items: [...orderItems.value],
      remark: orderRemark.value
    };
    
    currentOrder.value = order;
    return order;
  };

  // 完成支付
  const completePayment = () => {
    if (!currentOrder.value) {
      currentOrder.value = createOrder();
    }
    
    currentOrder.value.status = 'paid';
    currentOrder.value.paymentTime = new Date().toLocaleString();
    currentOrder.value.paymentMethod = getPaymentMethodName(paymentMethod.value);
    
    return currentOrder.value;
  };

  // 获取支付方式名称
  const getPaymentMethodName = (method: string) => {
    const methodMap: Record<string, string> = {
      alipay: '支付宝',
      wechat: '微信支付',
      creditcard: '信用卡'
    };
    return methodMap[method] || method;
  };

  // 启动倒计时
  const startCountdown = (callback?: () => void) => {
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

      countdown.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  };

  // 从购物车同步商品
  const syncCartItems = (items: OrderItem[]) => {
    orderItems.value = items;
  };

  // 清空订单数据
  const clearOrderData = () => {
    currentOrder.value = null;
    orderRemark.value = '';
    paymentMethod.value = 'alipay';
    deliveryMethod.value = 'standard';
    cardForm.value = {
      number: '',
      name: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    };
  };

  return {
    // 状态
    addresses,
    orderItems,
    deliveryMethod,
    deliveryMethods,
    orderRemark,
    paymentMethod,
    paymentMethods,
    currentOrder,
    cardForm,
    countdown,
    
    // 计算属性
    subtotal,
    deliveryFee,
    totalAmount,
    defaultAddress,
    
    // 方法
    selectAddress,
    editAddress,
    deleteAddress,
    addNewAddress,
    createOrder,
    completePayment,
    getPaymentMethodName,
    startCountdown,
    syncCartItems,
    clearOrderData
  };
});