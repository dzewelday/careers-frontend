import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomeView.vue'),
  },
  {
    path: '/jobs/results',
    name: 'JobResults',
    component: () => import('@/pages/JobResultsView.vue'),
  },
  {
    path: '/claims',
    name: 'Claims',
    component: () => import('@/pages/ClaimsView.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/SearchClaims.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },

]
