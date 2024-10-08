import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../../firebaseconfig'
import { onAuthStateChanged } from 'firebase/auth'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Home from '../views/Home.vue'
import Hierarchy from '../views/Hierarchy.vue'

const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })

const routes = [
  {
    path: '/',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/hierarchy',
    component: Hierarchy,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    component: Signup,
    meta: { guestOnly: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const currentUser = await getCurrentUser()
    if (to.matched.some((record) => record.meta.requiresAuth) && !currentUser) {
      next('/login')
    } else if (to.matched.some((record) => record.meta.guestOnly) && currentUser) {
      next('/')
    } else if (to.matched.length === 0) {
      if (currentUser) {
        next('/')
      } else {
        next('/login')
      }
    } else {
      next()
    }
  } catch (error) {
    console.error('Error in navigation guard:', error)
    next('/login')
  }
})

export default router
