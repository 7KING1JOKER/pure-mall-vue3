// 定义ApiResponse接口
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 导出HTTP请求方法
export function get<T = any>(url: string, params?: any): Promise<ApiResponse<T>>;
export function post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
export function put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
export function del<T = any>(url: string, params?: any, config?: any): Promise<ApiResponse<T>>;