import { get, post, put, del } from './request';
import type { ApiResponse, Order } from './interfaces';

/**
 * 获取用户订单列表
 * @param params 查询参数
 * @returns Promise<ApiResponse<Order[]>>
 */
export const getOrderList = (params?: {
  page?: number;
  pageSize?: number;
  status?: string;
}) => {
  return get('/api/order/list', params);
};

/**
 * 获取订单详情
 * @param orderNumber 订单编号
 * @returns Promise<ApiResponse<Order>>
 */
export const getOrderDetail = (orderNumber: string): Promise<ApiResponse<Order>> => {
  return get(`/api/order/detail/${orderNumber}`);
};

/**
 * 创建订单
 * @param params 订单创建参数
 * @returns Promise<ApiResponse<{ orderNumber: string }>>
 */
export const createOrder = (params: {
  addressId: number;
  cartItemIds: number[];
  deliveryMethod: string;
  paymentMethod: string;
  remark?: string;
}) => {
  return post('/api/order/create', params);
};

/**
 * 支付订单
 * @param orderNumber 订单编号
 * @param paymentMethod 支付方式
 * @returns Promise<ApiResponse<any>>
 */
export const payOrder = (orderNumber: string, paymentMethod: string) => {
  return post(`/api/order/pay/${orderNumber}`, { paymentMethod });
};

/**
 * 取消订单
 * @param orderNumber 订单编号
 * @returns Promise<ApiResponse<any>>
 */
export const cancelOrder = (orderNumber: string) => {
  return put(`/api/order/cancel/${orderNumber}`);
};

/**
 * 确认收货
 * @param orderNumber 订单编号
 * @returns Promise<ApiResponse<any>>
 */
export const confirmReceive = (orderNumber: string) => {
  return put(`/api/order/confirm/${orderNumber}`);
};

/**
 * 删除订单
 * @param orderNumber 订单编号
 * @returns Promise<ApiResponse<any>>
 */
export const deleteOrder = (orderNumber: string) => {
  return del(`/api/order/delete/${orderNumber}`);
};

/**
 * 评价订单
 * @param orderNumber 订单编号
 * @param params 评价参数
 * @returns Promise<ApiResponse<any>>
 */
export const reviewOrder = (orderNumber: string, params: {
  items: Array<{ itemId: number; rating: number; content: string; images?: string[] }>;
}) => {
  return post(`/api/order/review/${orderNumber}`, params);
};
