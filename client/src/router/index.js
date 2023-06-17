import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [
  { path: '/', component: () => import('@/views/test/index.vue') },
  { path: '/login', component: () => import('@/views/auth/Login.vue') },
  { path: '/dash', component: () => import('@/views/dashboard/index.vue') },
  // { path: '/test', component: () => import('../views/test') }
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior() {
    // vue2.0  x  y  控制
    // vue3.0  left  top 控制
    return { left: 0, top: 0 }
  }
})

// export { router, routes }
export default router
