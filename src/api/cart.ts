import request from './request';
import type { ApiResponse, CartItem } from './interfaces';

/**
 * 获取购物车列表
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const getCartList = (): Promise<ApiResponse<CartItem[]>> => {
  return request.get('/api/cart/');
};

/**
 * 添加商品到购物车
 * @param params 购物车项参数
 * @returns Promise<ApiResponse<any>>
 */
export const addToCart = (params: {
  productId: number;
  quantity: number;
  specId?: number;
}) => {
  return request.post('/api/cart/', params);
};

/**
 * 修改购物车项数量
 * @param cartItemId 购物车项ID
 * @param quantity 新数量
 * @returns Promise<ApiResponse<any>>
 */
export const updateCartItemQuantity = (cartItemId: number, quantity: number) => {
  return request.put(`/api/cart/item/${cartItemId}/quantity`, { quantity });
};

/**
 * 切换购物车项选中状态
 * @param cartItemId 购物车项ID
 * @param selected 是否选中
 * @returns Promise<ApiResponse<any>>
 */
export const toggleCartItemSelected = (cartItemId: number, selected: boolean) => {
  return request.put(`/api/cart/item/${cartItemId}/selected`, { selected });
};

/**
 * 切换所有购物车项选中状态
 * @param selected 是否选中
 * @returns Promise<ApiResponse<any>>
 */
export const toggleAllCartItemsSelected = (selected: boolean) => {
  return request.put('/api/cart/selected', { selected });
};

/**
 * 删除购物车项
 * @param cartItemId 购物车项ID
 * @returns Promise<ApiResponse<any>>
 */
export const deleteCartItem = (cartItemId: number) => {
  return request.del(`/api/cart/item/${cartItemId}`);
};

/**
 * 删除选中的购物车商品
 * @returns Promise<ApiResponse<any>>
 */
export const deleteSelectedCartItems = () => {
  return request.del('/api/cart/selected');
};

/**
 * 清空购物车
 * @returns Promise<ApiResponse<any>>
 */
export const clearCart = () => {
  return request.del('/api/cart/');
};

/**
 * 批量更新购物车商品
 * @param items 购物车项数组
 * @returns Promise<ApiResponse<any>>
 */
export const batchUpdateCart = (items: Array<{ id: number; quantity: number; selected?: boolean }>) => {
  return request.put('/api/cart/batch', { items });
};

/**
 * 获取购物车统计信息
 * @returns Promise<ApiResponse<any>>
 */
export const getCartStatistics = () => {
  return request.get('/api/cart/statistics');
};

/**
 * 获取购物车商品总数
 * @returns Promise<ApiResponse<{ count: number }>>
 */
export const getCartCount = (): Promise<ApiResponse<{ count: number }>> => {
  return request.get('/api/cart/count');
};

/**
 * 获取选中的购物车商品
 * @returns Promise<ApiResponse<CartItem[]>>
 */
export const getSelectedCartItems = (): Promise<ApiResponse<CartItem[]>> => {
  return request.get('/api/cart/selected');
};
