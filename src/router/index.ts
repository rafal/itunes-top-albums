import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Top 100 Albums - iTunes'
    }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/FavoritesView.vue'),
    meta: {
      title: 'Favorites - iTunes Top Albums'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'home' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Update document title based on route meta
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || 'iTunes Top Albums';
  next();
});

export default router;