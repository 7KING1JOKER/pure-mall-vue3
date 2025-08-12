declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 添加这行解决别名路径问题
declare module '@/pages/*' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/// <reference types="vite/client" />

// 解决 unplugin-auto-import 的类型问题
declare module 'unplugin-auto-import/vite' {
  import { Plugin } from 'vite'
  export default function(options: any): Plugin
}

declare module 'unplugin-vue-components/vite' {
  import { Plugin } from 'vite'
  export default function(options: any): Plugin
}

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