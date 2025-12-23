/*
 * @Description: 前端所有对象接口定义文件
 *
 */

/*
 * @Description: 购物车商品类型定义
 * @Location: @/store/cart.ts
 */

// 购物车商品类型定义
export interface CartItem {
  id?: number;
  productId: number;
  userId: number;
  name: string;
  description: string;
  spec: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selected: boolean;
}

// 推荐商品类型定义
export interface RecommendedProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

/*
 * @Description: 商品类型定义
 * @Location: @/store/category.ts
 */


// 定义分类节点接口
export interface CategoryNode {
  id: string;
  label: string;
  icon: string;
  children?: CategoryNode[];
}


/*
 * @Description: 地址类型定义
 * @Location: @/store/order.ts
 */


// 订单接口定义
export interface Order {
  id?: number;
  orderNumber: string;
  userId: number;
  orderTime: string;
  paymentTime?: string;
  deliveryTime?: string;
  receiveTime?: string;
  orderAmount: number;
  paymentMethod: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
  
  // 订单商品列表
  orderItems: OrderItem[];
}

export interface OrderItem {
  orderNumber?: string;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  imageUrl: string;
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

/*
 * @Description: 商品类型定义
 * @Location: @/store/product.ts
 */

  // 商品规格类型定义
  export interface ProductSpec {
    id: number;
    name: string;
    price: number;
    stock: number;
  }

  // 商品参数类型定义
  export interface ProductParam {
    name: string;
    value: string;
  }

  // 商品评价类型定义
  export interface ProductReview {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    content: string;
    date: string;
    username?: string;
    time?: string;
    images?: string[];
  }

  // 推荐商品类型定义
  export interface RelatedProduct {
    id: number;
    name: string;
    price: number;
    image: string;
  }

  // 商品类型定义
  export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    sales: number;
    image: string;
    brief?: string;
    images?: string[];
    specs?: ProductSpec[];
    detail?: string;
    params?: ProductParam[];
    reviews?: ProductReview[];
  }

/*
 * @Description: 地址类型定义
 * @Location: @/store/user.ts
 */

// 地址类型定义
export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postcode: string;
  detail: string;
  isDefault: boolean;
}