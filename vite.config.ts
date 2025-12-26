import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
  // 基础路径配置，用于GitHub Pages部署
  base: '/pure-mall-vue3/',
  // 插件配置区
  plugins: [
    vue(), // 核心 Vue 插件
    // 自动导入 ElementPlus 组件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      scss: {
        // 全局注入 scss 变量文件(所有 scss 文件自动载入)
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  // 模块解析配置
  resolve: {
    alias: {
      // 路径别名配置(将 @ 映射到 src 目录)
      '@': path.resolve(__dirname, './src'),
    }
  },
  // 构建配置
  build: {
    // 启用代码压缩
    minify: 'terser',
    // 使用类型断言简化 terser 配置
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      output: {
        comments: false
      }
    } as any,
    // 代码分割配置
    rollupOptions: {
      output: {
        // 根据模块类型进行代码分割
        manualChunks: {
          // 将 vue 相关依赖打包到一个 chunk
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // 将 element-plus 相关依赖打包到一个 chunk
          'element-plus': ['element-plus'],
          // 将 axios 相关依赖打包到一个 chunk
          'axios': ['axios'],
          // 将其他第三方依赖打包到一个 chunk
          'utils': ['@floating-ui/dom', '@floating-ui/core']
        }
      }
    },
    // 生成 source map (开发环境使用，生产环境可以禁用)
    sourcemap: false
  }
})
