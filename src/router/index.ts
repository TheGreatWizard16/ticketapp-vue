import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Landing from '../pages/Landing.vue'
import Login from '../pages/Login.vue'
import Signup from '../pages/Signup.vue'
import Dashboard from '../pages/Dashboard.vue'
import Tickets from '../pages/Tickets.vue'
import NotFound from '../pages/NotFound.vue'
import { getSession } from '../lib/session'

const routes: RouteRecordRaw[] = [
  { path: '/', component: Landing },
  { path: '/auth/login', component: Login },
  { path: '/auth/signup', component: Signup },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/tickets', component: Tickets, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const session = getSession()
    if (!session) {
      return { path: '/auth/login', query: { reason: 'Your session has expired — please log in again.', from: to.fullPath } }
    }
  }
})

export default router
