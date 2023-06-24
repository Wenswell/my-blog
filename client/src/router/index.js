import { createRouter, createWebHashHistory } from 'vue-router'

// 路由规则
const routes = [

  // { path: '/', redirect: '/home' },
  {
    path: '/',
    redirect: '/home',
    component: () => import('@/views/Index.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('@/views/home/index.vue'), },
      { path: 'category', redirect: 'category/0', },
      { path: 'category/:type', name: 'category', component: () => import('@/views/category/index.vue'), },
      { path: 'tags', name: 'tags', component: () => import('@/views/tags/index.vue'), },
      // { path: 'archive', component: () => import('@/views/archive/index.vue'), },
      { path: 'about', name: 'about', component: () => import('@/views/about/index.vue'), },
      { path: 'detail/:id', name: 'detail', component: () => import('@/views/detail/Index.vue') },
      // { path: 'detail', component: () => import('@/views/detail/Index.vue') },
    ]
  },
  {
  },
  { path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
  {
    path: '/dash', name: 'dash', component: () => import('@/views/dashboard/Index.vue'),
    redirect: '/dash/article',
    children: [
      { path: 'category', name: 'dash-category', component: () => import('@/views/dashboard/category/index.vue') },
      { path: 'article', name: 'dash-article', component: () => import('@/views/dashboard/article/Index.vue') },
    ]
  },
  { path: '/test', component: () => import('@/views/test/index.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/test' },
  // { path: '*', component: () => import('@/views/test/index.vue') },
]

// vue2.0 new VueRouter({}) 创建路由实例
// vue3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 每次切换路由的时候滚动到页面顶部
    // vue2.0  x  y  控制
    // vue3.0  left  top 控制
    scrollBehavior(to, from, savedPosition) {
      // 如果有savedPosition，说明是通过浏览器的前进/后退按钮触发的导航，直接返回savedPosition
      // console.log("savedPosition", savedPosition)
      // if (savedPosition) {
      //   return savedPosition
      // } else {
      //   // 否则，返回顶部
      //   return { top: 0 }
      // }
    }
  })
  router.beforeEach((to, from, next) => {
    window.history.scrollRestoration = 'auto'
    next()
  })

// export { router, routes }
export default router
