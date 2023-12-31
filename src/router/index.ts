import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {path: '/',redirect:"/login"},
  {path: '/login',name: 'Login',component: () => import( '@/views/Login/Login.vue')},
  {path: '/home',name: 'Home',component: () => import( '@/views/Home/Home.vue')}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
