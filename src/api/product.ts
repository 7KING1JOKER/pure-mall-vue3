import { get } from './request';
import type { Product, ApiResponse } from './interfaces';

/**
 * 获取商品列表（分页）
 * @param page 页码
 * @param pageSize 每页数量
 * @param sortType 排序方式
 * @param categoryId 分类ID（可选）
 * @returns Promise<ApiResponse<any>>
 */
export const getProductList = (params: {
  page: number;
  pageSize: number;
  sortType?: string;
  categoryId?: string;
}) => {
  return get('/api/product/page', params);
};

/**
 * 根据分类获取商品列表
 * @param categoryId 分类ID
 * @param page 页码
 * @param pageSize 每页数量
 * @returns Promise<ApiResponse<any>>
 */
export const getProductsByCategory = (categoryId: string, params: {
  page?: number;
  pageSize?: number;
}) => {
  return get(`/api/product/category/${categoryId}`, params);
};

/**
 * 获取商品详情
 * @param productId 商品ID
 * @returns Promise<ApiResponse<Product>>
 */
export const getProductDetail = (productId: number): Promise<ApiResponse<Product>> => {
  return get(`/api/product/${productId}`);
};

/**
 * 获取商品图片列表
 * @param productId 商品ID
 * @returns Promise<ApiResponse<string[]>>
 */
export const getProductImages = (productId: number): Promise<ApiResponse<string[]>> => {
  return get(`/api/product/image/product/${productId}`);
};
