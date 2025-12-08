import { get, post, put, del } from './request';
import type { ApiResponse, Address } from './interfaces';

/**
 * 获取用户地址列表
 * @returns Promise<ApiResponse<Address[]>>
 */
export const getAddressList = (): Promise<ApiResponse<Address[]>> => {
  return get('/api/address/list');
};

/**
 * 获取默认地址
 * @returns Promise<ApiResponse<Address>>
 */
export const getDefaultAddress = (): Promise<ApiResponse<Address>> => {
  return get('/api/address/default');
};

/**
 * 获取地址详情
 * @param addressId 地址ID
 * @returns Promise<ApiResponse<Address>>
 */
export const getAddressDetail = (addressId: number): Promise<ApiResponse<Address>> => {
  return get(`/api/address/${addressId}`);
};

/**
 * 添加地址
 * @param params 地址参数
 * @returns Promise<ApiResponse<Address>>
 */
export const addAddress = (params: Omit<Address, 'id'>): Promise<ApiResponse<Address>> => {
  return post('/api/address/', params);
};

/**
 * 更新地址
 * @param addressId 地址ID
 * @param params 地址参数
 * @returns Promise<ApiResponse<Address>>
 */
export const updateAddress = (addressId: number, params: Partial<Address>): Promise<ApiResponse<Address>> => {
  return put(`/api/address/${addressId}`, params);
};

/**
 * 删除地址
 * @param addressId 地址ID
 * @returns Promise<ApiResponse<any>>
 */
export const deleteAddress = (addressId: number) => {
  return del(`/api/address/${addressId}`);
};

/**
 * 设置默认地址
 * @param addressId 地址ID
 * @returns Promise<ApiResponse<any>>
 */
export const setDefaultAddress = (addressId: number) => {
  return put(`/api/address/${addressId}/default`);
};

/**
 * 获取地址数量
 * @returns Promise<ApiResponse<{ count: number }>>
 */
export const getAddressCount = (): Promise<ApiResponse<{ count: number }>> => {
  return get('/api/address/count');
};
