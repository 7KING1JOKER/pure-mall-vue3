import request from './request';

/**
 * 创建支付
 * @param orderId 订单ID
 * @param data 支付数据
 * @returns Promise
 */
export const createPayment = (orderId, data) => {
  return request.post(`/payments/${orderId}`, data);
};

/**
 * 获取支付详情
 * @param id 支付ID
 * @returns Promise
 */
export const getPaymentDetail = (id) => {
  return request.get(`/payments/${id}`);
};

/**
 * 查询支付状态
 * @param orderId 订单ID
 * @returns Promise
 */
export const queryPaymentStatus = (orderId) => {
  return request.get(`/payments/query/${orderId}`);
};

/**
 * 支付宝支付
 * @param orderId 订单ID
 * @param data 支付数据
 * @returns Promise
 */
export const alipay = (orderId, data) => {
  return request.post(`/payments/alipay/${orderId}`, data);
};

/**
 * 微信支付
 * @param orderId 订单ID
 * @param data 支付数据
 * @returns Promise
 */
export const wechatPay = (orderId, data) => {
  return request.post(`/payments/wechat/${orderId}`, data);
};

/**
 * 信用卡支付
 * @param orderId 订单ID
 * @param data 支付数据
 * @returns Promise
 */
export const creditCardPay = (orderId, data) => {
  return request.post(`/payments/credit-card/${orderId}`, data);
};

/**
 * 支付回调处理
 * @param paymentType 支付类型
 * @param data 回调数据
 * @returns Promise
 */
export const paymentCallback = (paymentType, data) => {
  return request.post(`/payments/callback/${paymentType}`, data);
};

/**
 * 取消支付
 * @param id 支付ID
 * @returns Promise
 */
export const cancelPayment = (id) => {
  return request.put(`/payments/${id}/cancel`);
};

/**
 * 获取支付方式列表
 * @returns Promise
 */
export const getPaymentMethods = () => {
  return request.get('/payments/methods');
};

/**
 * 申请退款
 * @param paymentId 支付ID
 * @param data 退款数据
 * @returns Promise
 */
export const refundPayment = (paymentId, data) => {
  return request.post(`/payments/${paymentId}/refund`, data);
};

/**
 * 查询退款状态
 * @param refundId 退款ID
 * @returns Promise
 */
export const queryRefundStatus = (refundId) => {
  return request.get(`/payments/refund/${refundId}`);
};