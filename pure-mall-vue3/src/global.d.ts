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
declare module '../styles/js/Xscroll-box.js' {
  export function initScrollBox(): void
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

