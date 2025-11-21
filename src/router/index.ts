import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      requiresAuth: false,
      redirectIfAuth: true, // Redirect to dashboard if already logged in
    },
  },
  {
    path: '/claim/new',
    name: 'NewClaim',
    component: () => import('@/pages/ClaimForm.vue'),
    meta: {
      requiresAuth: false, // Allows unauthenticated users
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: {
      requiresAuth: false,
      redirectIfAuth: true,
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      requiresAuth: true, // Only authenticated users
    },
  },
  {
    path: '/claim/:id',
    name: 'ClaimDetails',
    component: () => import('@/pages/ClaimDetails.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/claim/:id/edit',
    name: 'EditClaim',
    component: () => import('@/pages/ClaimForm.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Save intended destination
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }

  // Redirect authenticated users away from login/landing
  if (to.meta.redirectIfAuth && isAuthenticated) {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
