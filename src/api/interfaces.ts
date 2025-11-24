/**
 * 统一接口定义文件
 * 包含项目中所有TypeScript接口定义
 */

// 商品相关接口定义

/**
 * 商品基本信息接口
 */
export interface Product {
  id: number;
  name: string;
  brief?: string;
  price: number;
  originalPrice?: number;
  sales: number;
  images: string[];
  specs?: ProductSpec[];
  detail?: string;
  params?: ProductParam[];
  reviews?: ProductReview[];
}

/**
 * 商品规格接口
 */
export interface ProductSpec {
  id: number;
  name: string;
  price: number;
  stock: number;
}

/**
 * 商品参数接口
 */
export interface ProductParam {
  name: string;
  value: string;
}

/**
 * 商品评论接口
 */
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

/**
 * 相关推荐商品接口
 */
export interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

// 分类相关接口定义

/**
 * 分类节点接口
 */
export interface CategoryNode {
  id: string;
  label: string;
  icon: string;
  children?: CategoryNode[];
}

/**
 * 排序选项类型
 */
export type SortType = 'default' | 'priceAsc' | 'priceDesc' | 'salesDesc' | 'newest';

// 地址相关接口定义

/**
 * 地址接口
 */
export interface Address {
  id?: string | number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail?: string;
  street?: string;
  zip?: string;
  isDefault: boolean;
}

// 购物车相关接口定义

/**
 * 购物车项接口
 */
export interface CartItem {
  id: number;
  productId?: number;
  name: string;
  description?: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}

// 订单相关接口定义

/**
 * 订单项接口
 */
export interface OrderItem {
  id: number;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean;
}

/**
 * 订单接口
 */
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
  deliveryAddress?: string;
}

/**
 * 配送方式接口
 */
export interface DeliveryMethod {
  value: string;
  label: string;
  fee: number;
}

/**
 * 支付方式接口
 */
export interface PaymentMethod {
  value: string;
  label: string;
  desc: string;
}

// 收藏夹相关接口定义

/**
 * 收藏夹项接口
 */
export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  selected: boolean;
}

// API响应接口

/**
 * 通用API响应接口
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 用户相关接口

/**
 * 用户基本信息接口
 */
export interface UserBasicInfo {
  label: string;
  value: string;
}

/**
 * 会员信息接口
 */
export interface MemberInfo {
  label: string;
  value: string;
}

/**
 * 订单列表项接口
 */
export interface OrderListItem {
  id: string;
  date: string;
  product: string;
  amount: string;
  status: string;
}