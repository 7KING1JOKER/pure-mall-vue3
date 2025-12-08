import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 检查是否为后端定义的Response格式
    if (typeof res === 'object' && res !== null) {
      // 根据后端Response.java中的定义，检查code字段
      if (res.code !== undefined) {
        if (res.code !== 200) {
          ElMessage.error(res.message || '请求失败');
          return Promise.reject(new Error(res.message || '请求失败'));
        }
        // 成功时可以选择直接返回data字段，简化前端使用
        // 但为了兼容现有代码，这里仍然返回完整的响应对象
        return res;
      }
    }
    // 如果不是标准Response格式，可能是直接返回的数据，将其包装为标准格式
    return { code: 200, message: 'success', data: res };
  },
  error => {
    if (error.response) {
      // 尝试从error.response.data中获取后端返回的错误信息
      const errorData = error.response.data;
      let errorMessage = '请求失败';
      
      // 根据后端Response格式处理错误消息
      if (typeof errorData === 'object' && errorData !== null && errorData.message) {
        errorMessage = errorData.message;
      }
      
      switch (error.response.status) {
        case 401:
          // 未登录或登录失效
          const userStore = useUserStore();
          userStore.logout();
          router.push('/login');
          errorMessage = '请先登录';
          break;
        case 403:
          errorMessage = errorData.message || '没有权限';
          break;
        case 404:
          errorMessage = errorData.message || '请求的资源不存在';
          break;
        case 500:
          errorMessage = errorData.message || '服务器内部错误';
          break;
        default:
          // 如果有响应数据但不是标准格式，尝试获取message
          if (error.response.data && typeof error.response.data === 'object') {
            errorMessage = error.response.data.message || errorMessage;
          }
      }
      ElMessage.error(errorMessage);
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接');
    } else {
      ElMessage.error(error.message || '请求失败');
    }
    return Promise.reject(error);
  }
);

// 导出常用请求方法
export function get(url, params = {}, config = {}) {
  return service.get(url, { params, ...config });
}

export function post(url, data = {}, config = {}) {
  return service.post(url, data, config);
}

export function put(url, data = {}, config = {}) {
  return service.put(url, data, config);
}

export function del(url, params = {}, config = {}) {
  return service.delete(url, { params, ...config });
}

// 同时保留默认导出以兼容可能的导入方式
export default {
  get,
  post,
  put,
  delete: del
};