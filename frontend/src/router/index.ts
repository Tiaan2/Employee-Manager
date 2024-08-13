import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../../firebaseconfig'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true } // Protected route
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/signup',
    component: Signup
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser
  if (to.meta.requiresAuth && !currentUser) {
    next('/login') // Redirect to login page if not authenticated
  } else {
    next()
  }
})

export default router
