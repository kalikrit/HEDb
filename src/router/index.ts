import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/views/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/Products/Detail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/Register.vue'), // Создадим позже
      meta: { guest: true },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/ForgotPassword.vue'), // Создадим позже
      meta: { guest: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

// Navigation guard для защиты маршрутов
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Проверяем авторизацию
  const isAuthenticated = authStore.isAuthenticated
  
  // Маршрут требует авторизации
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  }
  // Маршрут только для гостей (например, логин)
  else if (to.meta.guest && isAuthenticated) {
    next('/')
  }
  else {
    next()
  }
})

export default router