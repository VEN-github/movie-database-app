import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'

const DEFAULT_TITLE = 'Movie Database Application'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/movies',
      name: 'movies',
      component: () => import('@/views/MediasView.vue'),
      meta: {
        title: 'Movies'
      }
    },
    {
      path: '/tv-shows',
      name: 'tv-shows',
      component: () => import('@/views/MediasView.vue'),
      meta: {
        title: 'TV Shows'
      }
    },
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

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE
  next()
})

export default router
