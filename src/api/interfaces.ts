/**
 * 统一接口定义文件
 * 包含项目中所有TypeScript接口定义
 */

// 商品相关接口
export interface Product {
  id: number;
  name: string;
  brief: string;
  price: number;
  originalPrice: number;
  sales: number;
  categoryLabel: string;
  detail: string;
  status: number;
  createTime: string;
  updateTime: string;
  images: ProductImage[];
  specs: ProductSpec[];
}

export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  sort: number;
}

export interface ProductSpec {
  id: number;
  productId: number;
  name: string;
  price: number;
  stock: number;
  salesAmount: number;
  color: string;
  size: string;
  createTime: string;
}

export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  content: string;
  createTime: string;
}

export interface ProductParam {
  pageNum: number;
  pageSize: number;
  categoryId?: number;
  keyword?: string;
  sortBy?: string;
  orderBy?: string;
}

// 分类相关接口
export interface CategoryNode {
  id: number;
  name: string;
  parentId: number;
  children: CategoryNode[];
  icon?: string;
}

export interface Category {
  id: number;
  name: string;
  label: string;
  icon?: string;
  color?: string;
  children?: Category[];
}

export type SortType = 'price_asc' | 'price_desc' | 'sales_desc' | 'latest';

// 地址相关接口
export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  street: string;
  postcode: string;
  detail: string;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
}

// 购物车相关接口
export interface Cart {
  id: number;
  userId: number;
  createTime: string;
  updateTime: string;
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  specId: number;
  name: string;
  imageUrl: string;
  image?: string; // 别名，用于组件中直接访问
  description?: string; // 商品描述
  spec?: string; // 商品规格
  quantity: number;
  selected: number | boolean; // 支持数字和布尔值
  price: number;
  createTime: string;
  updateTime: string;
}

// 订单相关接口
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  specId: number;
  name: string;
  spec: string;
  imageUrl: string;
  image: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export interface Order {
  id: number | string; // 支持number和string类型
  orderNumber: string;
  userId?: number;
  orderTime: string;
  paymentTime?: string;
  deliveryTime?: string;
  receiveTime?: string;
  orderAmount: number;
  paymentMethod: string;
  status: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress: string;
  deliveryAddress?: string; // 别名，用于组件中直接访问
  remark?: string;
  createTime: string;
  updateTime: string;
  orderItems: OrderItem[];
  items?: OrderItem[]; // 别名，用于组件中直接访问
  addressId?: number; // 添加addressId属性
  deliveryMethod?: string; // 添加配送方式属性
  totalAmount?: number; // 别名，用于组件中直接访问
}

export type DeliveryMethod = 'standard' | 'express';
export type PaymentMethod = 'alipay' | 'wechat' | 'card';

// 收藏夹相关接口
export interface Wishlist {
  id: number;
  userId: number;
  createTime: string;
  wishListItems?: Product[];
}

export interface WishlistItem {
  id: number;
  wishlistId: number;
  productId: number;
  createTime: string;
}

// 通用API响应接口
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户相关接口
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  avatar: string;
  createTime: string;
  lastLogin: string;
  status: number;
}

export interface UserBasicInfo {
  id: number;
  username: string;
  avatar: string;
  phone: string;
}

export interface MemberInfo {
  point: number;
  level: number;
  couponCount: number;
  orderCount: number;
}

export interface OrderListItem {
  id: number;
  orderNumber: string;
  orderTime: string;
  orderAmount: number;
  status: string;
  orderItems: OrderItem[];
}