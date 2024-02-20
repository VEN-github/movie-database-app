import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/movies', name: 'movies', component: () => import('@/views/MediasView.vue') },
    { path: '/tv-shows', name: 'tv-shows', component: () => import('@/views/MediasView.vue') },
    {
      path: '/:type/:slug/:id',
      name: 'media-details',
      component: () => import('@/views/DetailsView.vue'),
      strict: true,
      sensitive: true,
      props: true
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ],
  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router
