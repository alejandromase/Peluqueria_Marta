import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/modules/main/layouts/MainLayout.vue';
import isAuthenticatedGuard from '@/modules/main/guards/is-auhenticated.guard';
import isSelectedService from '@/modules/main/guards/is-selected-service.guard';
import isSelectedDateTime from '@/modules/main/guards/is-selected-date-time.guard';
import { authRoutes } from '@/modules/auth/routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: MainLayout,
      redirect: { name: 'home' },
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/modules/main/views/HomePage.vue'),
        },
        {
          path: 'service',
          name: 'service',
          component: () => import('@/modules/main/views/ServicePage.vue'),
        },
        {
          path: 'datetime',
          name: 'datetime',
          beforeEnter: [isSelectedService],
          component: () => import('@/modules/main/views/DateTimePickerPage.vue'),
        },
        {
          path: 'reservation-details',
          name: 'reservation-details',
          beforeEnter: [isAuthenticatedGuard, isSelectedDateTime],
          component: () => import('@/modules/main/views/ReservationDetailsPage.vue'),
        },
        {
          path: 'user',
          name: 'user',
          beforeEnter: [isAuthenticatedGuard],
          component: () => import('@/modules/main/views/UserPage.vue'),
        },
      ],
    },
    
    authRoutes,
  ],
});

export default router;
