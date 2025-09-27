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
  // 商品规格类型定义
  export interface ProductSpec {
    id: number;
    name: string;
    price: number;
    stock: number;
  }

  // 商品参数类型定义
  export interface ProductParam {
    name: string;
    value: string;
  }

  // 商品评价类型定义
  export interface ProductReview {
    id: number;
    user: string;
    avatar: string;
    rating: number;
    content: string;
    date: string;
    username?: string;
    time?: string;
    images?: string[];
  }

  // 推荐商品类型定义
  export interface RelatedProduct {
    id: number;
    name: string;
    price: number;
    image: string;
  }

  // 商品类型定义
  export interface Product {
    id: number;
    name: string;
    brief: string;
    price: number;
    originalPrice?: number;
    sales: number;
    images: string[];
    specs: ProductSpec[];
    detail: string;
    params: ProductParam[];
    reviews: ProductReview[];
  }

  // 商品数据库导出
  export const productDatabase: Product[];

  // 获取商品的辅助函数
  export function getProductById(id: number): Product | undefined;
  export function getAllProducts(): Product[];
  export function getProductsByCategory(categoryType: number): Product[];
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