// 配置路由文件
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: 'pure商城' }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/pages/Category.vue'),
    meta: { title: '分类' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/Cart.vue'),
    meta: { title: '购物车' }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/pages/User.vue'),
    meta: { title: '个人' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router