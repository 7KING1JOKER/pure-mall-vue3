import { get, post, put } from './request';
import type { ApiResponse } from './interfaces';

/**
 * 用户登录
 * @param params 登录参数
 * @returns Promise<ApiResponse<{ token: string; user: any }>>
 */
export const login = (params: {
  username: string;
  password: string;
}): Promise<ApiResponse<{ token: string; user: any }>> => {
  return post('/api/user/login', params);
};

/**
 * 用户注册
 * @param params 注册参数
 * @returns Promise<ApiResponse<any>>
 */
export const register = (params: {
  username: string;
  password: string;
  email: string;
  phone: string;
}) => {
  return post('/api/user/register', params);
};

/**
 * 获取用户信息
 * @returns Promise<ApiResponse<any>>
 */
export const getUserInfo = (): Promise<ApiResponse<any>> => {
  return get('/api/user/info');
};

/**
 * 更新用户信息
 * @param params 用户信息参数
 * @returns Promise<ApiResponse<any>>
 */
export const updateUserInfo = (params: {
  username?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}) => {
  return put('/api/user/info', params);
};

/**
 * 修改密码
 * @param params 密码修改参数
 * @returns Promise<ApiResponse<any>>
 */
export const changePassword = (params: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return put('/api/user/password', params);
};

/**
 * 上传头像
 * @param formData 包含头像文件的FormData
 * @returns Promise<ApiResponse<{ avatarUrl: string }>>
 */
export const uploadAvatar = (formData: FormData): Promise<ApiResponse<{ avatarUrl: string }>> => {
  return post('/api/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 登出
 * @returns Promise<ApiResponse<any>>
 */
export const logout = (): Promise<ApiResponse<any>> => {
  return post('/api/user/logout');
};

/**
 * 检查用户名是否可用
 * @param username 用户名
 * @returns Promise<ApiResponse<{ available: boolean }>>
 */
export const checkUsername = (username: string): Promise<ApiResponse<{ available: boolean }>> => {
  return get('/api/user/check-username', { username });
};

/**
 * 检查邮箱是否可用
 * @param email 邮箱
 * @returns Promise<ApiResponse<{ available: boolean }>>
 */
export const checkEmail = (email: string): Promise<ApiResponse<{ available: boolean }>> => {
  return get('/api/user/check-email', { email });
};

/**
 * 检查手机号是否可用
 * @param phone 手机号
 * @returns Promise<ApiResponse<{ available: boolean }>>
 */
export const checkPhone = (phone: string): Promise<ApiResponse<{ available: boolean }>> => {
  return get('/api/user/check-phone', { phone });
};
