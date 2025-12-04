// src/types/global.d.ts
declare module '*.css' {
  const style: any
  export default style
}

declare module '*.scss' {
  const style: any
  export default style
}

declare module '*.sass' {
  const style: any
  export default style
}

// 特别声明 Element Plus CSS 文件
declare module 'element-plus/dist/index.css' {
  const style: any
  export default style
}

// 自定义js模块声明

// 商品数据库模块声明
declare module '@/api/productDatabase' {

  // 商品数据库导出
  export const productDatabase: Product[];

  // 获取商品的辅助函数
  export function getProductById(id: number): Product | undefined;
  export function getAllProducts(): Product[];
  export function getProductsByCategory(categoryType: number): Product[];
}

// request 模块声明
declare module '@/api/request' {
  export function get(url: string, params = {}, config = {}): Promise<any>;
  export function post(url: string, data = {}, config = {}): Promise<any>;
  export function put(url: string, data = {}, config = {}): Promise<any>;
  export function del(url, params = {}, config = {}): Promise<any>;
}

// 解决 unplugin-auto-import 的类型问题
declare module 'unplugin-auto-import/vite' {
  import { Plugin } from 'vite'
  export default function(options: any): Plugin
}

declare module 'unplugin-vue-components/vite' {
  import { Plugin } from 'vite'
  export default function(options: any): Plugin
}

declare module 'sortablejs'