import request from './request';

/**
 * 获取商品列表
 * @param params 查询参数
 * @returns Promise
 */
export const getProductList = (params = {}) => {
  return request.get('/products', params);
};

/**
 * 获取商品详情
 * @param id 商品ID
 * @returns Promise
 */
export const getProductDetail = (id) => {
  return request.get(`/products/${id}`);
};

/**
 * 搜索商品
 * @param params 搜索参数
 * @returns Promise
 */
export const searchProducts = (params = {}) => {
  return request.get('/products/search', params);
};

/**
 * 获取分类商品
 * @param categoryId 分类ID
 * @param params 其他参数
 * @returns Promise
 */
export const getCategoryProducts = (categoryId, params = {}) => {
  return request.get(`/categories/${categoryId}/products`, params);
};

/**
 * 获取商品规格
 * @param id 商品ID
 * @returns Promise
 */
export const getProductSpecs = (id) => {
  return request.get(`/products/${id}/specs`);
};

/**
 * 获取商品SKU
 * @param id 商品ID
 * @param params 规格参数
 * @returns Promise
 */
export const getProductSku = (id, params = {}) => {
  return request.get(`/products/${id}/sku`, params);
};

/**
 * 获取商品评论
 * @param id 商品ID
 * @param params 查询参数
 * @returns Promise
 */
export const getProductReviews = (id, params = {}) => {
  return request.get(`/products/${id}/reviews`, params);
};

/**
 * 添加商品评论
 * @param id 商品ID
 * @param data 评论数据
 * @returns Promise
 */
export const addProductReview = (id, data) => {
  return request.post(`/products/${id}/reviews`, data);
};

/**
 * 获取相关商品推荐
 * @param id 商品ID
 * @param params 查询参数
 * @returns Promise
 */
export const getRelatedProducts = (id, params = {}) => {
  return request.get(`/products/${id}/related`, params);
};

/**
 * 获取热门商品
 * @param params 查询参数
 * @returns Promise
 */
export const getHotProducts = (params = {}) => {
  return request.get('/products/hot', params);
};

/**
 * 获取新品上市
 * @param params 查询参数
 * @returns Promise
 */
export const getNewProducts = (params = {}) => {
  return request.get('/products/new', params);
};