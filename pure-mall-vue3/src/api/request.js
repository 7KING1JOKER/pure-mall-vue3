import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
 service.interceptors.request.use( 
   config => { 
    //  console.log('请求URL:', config.url);
    //  console.log('请求参数:', config.data);
    //  console.log('请求头:', config.headers);
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
    // 检查响应是否包含code字段，如果不包含则认为是直接返回的数据（如User对象）
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code !== 200) {
        return Promise.reject(new Error(res.message || '请求失败'));
      }
    }
    return res;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未登录或登录失效
          const userStore = useUserStore();
          userStore.logout();
          router.push('/login');
          ElMessage.error('请先登录');
          break;
        case 403:
          ElMessage.error('没有权限');
          break;
        case 404:
          ElMessage.error('请求的资源不存在');
          break;
        case 500:
          // 不在这里显示错误消息，让具体的请求方法处理
          break;
        default:
          // 不在这里显示错误消息，让具体的请求方法处理
          break;
      }
    } else if (error.request) {
      ElMessage.error('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  }
);

// 导出常用请求方法
export default {
  get(url, params = {}, config = {}) {
    return service.get(url, { params, ...config });
  },
  post(url, data = {}, config = {}) {
    return service.post(url, data, config);
  },
  put(url, data = {}, config = {}) {
    return service.put(url, data, config);
  },
  del(url, params = {}, config = {}) {
    return service.delete(url, { params, ...config });
  }
};