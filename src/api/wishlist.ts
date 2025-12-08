import { get, post, del } from './request';
import type { ApiResponse } from './interfaces';

/**
 * 获取收藏夹
 * @returns Promise<ApiResponse<any>>
 */
export const getWishlist = (): Promise<ApiResponse<any>> => {
  return get('/api/wishlist/');
};

/**
 * 添加商品到收藏夹
 * @param productId 商品ID
 * @returns Promise<ApiResponse<any>>
 */
export const addToWishlist = (productId: number): Promise<ApiResponse<any>> => {
  return post('/api/wishlist/', { productId });
};

/**
 * 从收藏夹删除商品
 * @param productId 商品ID
 * @returns Promise<ApiResponse<any>>
 */
export const removeFromWishlist = (productId: number): Promise<ApiResponse<any>> => {
  return del('/api/wishlist/item', { productId });
};

/**
 * 检查商品是否在收藏夹中
 * @param productId 商品ID
 * @returns Promise<ApiResponse<any>>
 */
export const isInWishlist = (productId: number): Promise<ApiResponse<any>> => {
  return get('/api/wishlist/check', { productId });
};
