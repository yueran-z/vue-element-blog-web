import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
import Avatar from '@/views/Avatar'
import Article from "@/views/article/Article"
import Config from "@/views/Config"
import Reg from '@/views/Reg'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: Welcome },
      { path: '/user', component: User },
      { path: '/avatar', component: Avatar },
      { path: '/article', component: Article },
      { path: '/article/addoredit', component: () => import('../views/article/addOrEditArticle.vue') },
      { path: '/article/detail', component: () => import('../views/article/articleDetail.vue') },
      { path: '/config', component: Config },
      { path: '/category', component: () => import('../views/category/Category.vue') },
      { path: '/userinfo', component: () => import("../views/UserInfo") },
      { path: '/category/addoredit', component: () => import('../views/category/addOrEditCategory.vue') },
      { path: '/menu', component: () => import('../views/menu/Menu.vue') },
      { path: '/menu/addoredit', component: () => import('../views/menu/addOrEditMenu.vue') },
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (to.path === '/reg') return next()
  let tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})


export default router
