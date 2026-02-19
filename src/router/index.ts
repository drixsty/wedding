import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/rsvp',
      name: 'rsvp',
      component: () => import('@/views/RsvpPage.vue')
    },
    {
      path: '/galerie',
      name: 'gallery',
      component: () => import('@/views/GalleryPage.vue')
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/LoginPage.vue')
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: () => import('@/components/admin/AdminLayout.vue'),
      redirect: '/admin/dashboard/overview',
      children: [
        {
          path: 'overview',
          name: 'admin-overview',
          component: () => import('@/views/admin/AdminOverviewPage.vue')
        },
        {
          path: 'guests',
          name: 'admin-guests',
          component: () => import('@/views/admin/AdminGuestsPage.vue')
        },
        {
          path: 'content',
          name: 'admin-content',
          component: () => import('@/views/admin/AdminContentPage.vue')
        },
        {
          path: 'gallery',
          name: 'admin-gallery',
          component: () => import('@/views/admin/AdminGalleryPage.vue')
        }
      ],
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Guard pour les routes admin
router.beforeEach(async (to, _from, next) => {
  if (to.meta.requiresAuth) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
