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
     path: '/product/:id',
     name: 'product-detail',
     component: () => import('@/pages/ProductDetail.vue'),
     props: true
   },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/pages/Cart.vue'),
    meta: { title: '购物车' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/pages/Checkout.vue'),
    meta: { title: '确认订单' }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: () => import('@/pages/Payment.vue'),
    meta: { title: '订单支付' }
  },
  {
    path: '/order-complete',
    name: 'OrderComplete',
    component: () => import('@/pages/OrderComplete.vue'),
    meta: { title: '订单完成' }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/pages/User.vue'),
    meta: { title: '个人' }
  },
  {
    path: '/order/:orderNumber',
    name: 'OrderDetail',
    component: () => import('@/pages/OrderDetail.vue'),
    props: true,
    meta: { title: '订单详情' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫，更新页面标题
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
  next()
})

export default router