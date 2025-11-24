import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

export default defineConfig({
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
  }
})
