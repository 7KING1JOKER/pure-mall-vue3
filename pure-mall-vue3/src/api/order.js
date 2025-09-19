import request from './request';

/**
 * 创建订单
 * @param data 订单数据
 * @returns Promise
 */
export const createOrder = (data) => {
  return request.post('/orders', data);
};

/**
 * 获取订单列表
 * @param params 查询参数
 * @returns Promise
 */
export const getOrderList = (params = {}) => {
  return request.get('/orders', params);
};

/**
 * 获取订单详情
 * @param id 订单ID
 * @returns Promise
 */
export const getOrderDetail = (id) => {
  return request.get(`/orders/${id}`);
};

/**
 * 取消订单
 * @param id 订单ID
 * @returns Promise
 */
export const cancelOrder = (id) => {
  return request.put(`/orders/${id}/cancel`);
};

/**
 * 确认收货
 * @param id 订单ID
 * @returns Promise
 */
export const confirmOrder = (id) => {
  return request.put(`/orders/${id}/confirm`);
};

/**
 * 删除订单
 * @param id 订单ID
 * @returns Promise
 */
export const deleteOrder = (id) => {
  return request.delete(`/orders/${id}`);
};

/**
 * 申请退款
 * @param id 订单ID
 * @param data 退款数据
 * @returns Promise
 */
export const applyRefund = (id, data) => {
  return request.post(`/orders/${id}/refund`, data);
};

/**
 * 获取订单状态
 * @param id 订单ID
 * @returns Promise
 */
export const getOrderStatus = (id) => {
  return request.get(`/orders/${id}/status`);
};

/**
 * 获取物流信息
 * @param id 订单ID
 * @returns Promise
 */
export const getLogisticsInfo = (id) => {
  return request.get(`/orders/${id}/logistics`);
};

/**
 * 批量获取订单列表
 * @param ids 订单ID数组
 * @returns Promise
 */
export const batchGetOrders = (ids) => {
  return request.post('/orders/batch', { ids });
};

/**
 * 获取订单统计信息
 * @returns Promise
 */
export const getOrderStats = () => {
  return request.get('/orders/stats');
};