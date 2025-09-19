import request from './request';

/**
 * 获取购物车列表
 * @returns Promise
 */
export const getCartList = () => {
  return request.get('/cart');
};

/**
 * 添加商品到购物车
 * @param data 购物车商品数据
 * @returns Promise
 */
export const addToCart = (data) => {
  return request.post('/cart', data);
};

/**
 * 更新购物车商品数量
 * @param id 购物车项ID
 * @param data 更新数据
 * @returns Promise
 */
export const updateCartItem = (id, data) => {
  return request.put(`/cart/${id}`, data);
};

/**
 * 删除购物车商品
 * @param id 购物车项ID
 * @returns Promise
 */
export const removeCartItem = (id) => {
  return request.delete(`/cart/${id}`);
};

/**
 * 批量删除购物车商品
 * @param ids 购物车项ID数组
 * @returns Promise
 */
export const batchRemoveCartItems = (ids) => {
  return request.post('/cart/batch-delete', { ids });
};

/**
 * 清空购物车
 * @returns Promise
 */
export const clearCart = () => {
  return request.delete('/cart/clear');
};

/**
 * 选择购物车商品
 * @param data 选择数据
 * @returns Promise
 */
export const selectCartItems = (data) => {
  return request.post('/cart/select', data);
};

/**
 * 获取购物车数量
 * @returns Promise
 */
export const getCartCount = () => {
  return request.get('/cart/count');
};

/**
 * 获取购物车总价
 * @returns Promise
 */
export const getCartTotal = () => {
  return request.get('/cart/total');
};

/**
 * 获取失效商品
 * @returns Promise
 */
export const getInvalidCartItems = () => {
  return request.get('/cart/invalid');
};

/**
 * 获取购物车推荐商品
 * @param params 查询参数
 * @returns Promise
 */
export const getRecommendedProducts = (params = {}) => {
  return request.get('/cart/recommended', params);
};