// 配置路由文件
import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from 'element-plus';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { title: 'pure商城', requiresAuth: false }
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('@/pages/Category.vue'),
    meta: { title: '分类', requiresAuth: false }
  },
  {
     path: '/product/:id',
     name: 'product-detail',
     component: () => import('@/pages/ProductDetail.vue'),
     props: true,
     meta: { requiresAuth: false }
   },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/Cart.vue'),
    meta: { title: '购物车', requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/pages/Checkout.vue'),
    meta: { title: '确认订单', requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/pages/Payment.vue'),
    meta: { title: '订单支付', requiresAuth: true }
  },
  {
    path: '/order-complete',
    name: 'OrderComplete',
    component: () => import('@/pages/OrderComplete.vue'),
    meta: { title: '订单完成', requiresAuth: true }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/pages/User.vue'),
    meta: { title: '个人', requiresAuth: true }
  },
  {
    path: '/order/:orderNumber',
    name: 'OrderDetail',
    component: () => import('@/pages/OrderDetail.vue'),
    props: true,
    meta: { title: '订单详情', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，更新页面标题并检查认证状态
router.beforeEach((to, _, next) => {
  // 根据路由名称设置页面标题
  const titleMap: Record<string, string> = {
    Home: '首页',
    Category: '分类',
    ProductDetail: '商品详情',
    Cart: '购物车',
    Checkout: '结算',
    Payment: '支付',
    OrderComplete: '订单完成',
    User: '个人中心',
    OrderDetail: '订单详情'
  }
  
  document.title = `${titleMap[to.name as string] || '页面'} - Pure Mall`
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 同时检查token和isLoggedIn状态
    const token = localStorage.getItem('token');
    const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
    
    if (!token || !isLoggedIn) {
      ElMessage.warning('请先登录');
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router