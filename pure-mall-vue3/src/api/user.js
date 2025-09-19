import request from './request';

/**
 * 用户登录
 * @param data 登录参数
 * @returns Promise
 */
export const login = (data) => {
  return request.post('/user/login', data);
};

/**
 * 用户注册
 * @param data 注册参数
 * @returns Promise
 */
export const register = (data) => {
  return request.post('/user/register', data);
};

/**
 * 忘记密码
 * @param data 忘记密码参数
 * @returns Promise
 */
export const forgotPassword = (data) => {
  return request.post('/user/forgot-password', data);
};

/**
 * 重置密码
 * @param data 重置密码参数
 * @returns Promise
 */
export const resetPassword = (data) => {
  return request.post('/user/reset-password', data);
};

/**
 * 获取用户信息
 * @returns Promise
 */
export const getUserInfo = () => {
  return request.get('/user/info');
};

/**
 * 更新用户信息
 * @param data 用户信息
 * @returns Promise
 */
export const updateUserInfo = (data) => {
  return request.put('/user/info', data);
};

/**
 * 获取收货地址列表
 * @returns Promise
 */
export const getAddresses = () => {
  return request.get('/user/addresses');
};

/**
 * 添加收货地址
 * @param data 地址信息
 * @returns Promise
 */
export const addAddress = (data) => {
  return request.post('/user/addresses', data);
};

/**
 * 更新收货地址
 * @param id 地址ID
 * @param data 地址信息
 * @returns Promise
 */
export const updateAddress = (id, data) => {
  return request.put(`/user/addresses/${id}`, data);
};

/**
 * 删除收货地址
 * @param id 地址ID
 * @returns Promise
 */
export const deleteAddress = (id) => {
  return request.delete(`/user/addresses/${id}`);
};

/**
 * 设置默认地址
 * @param id 地址ID
 * @returns Promise
 */
export const setDefaultAddress = (id) => {
  return request.post(`/user/addresses/${id}/default`);
};

/**
 * 获取我的收藏
 * @param params 查询参数
 * @returns Promise
 */
export const getMyFavorites = (params = {}) => {
  return request.get('/user/favorites', params);
};

/**
 * 添加收藏
 * @param productId 商品ID
 * @returns Promise
 */
export const addFavorite = (productId) => {
  return request.post('/user/favorites', { productId });
};

/**
 * 取消收藏
 * @param productId 商品ID
 * @returns Promise
 */
export const removeFavorite = (productId) => {
  return request.delete(`/user/favorites/${productId}`);
};