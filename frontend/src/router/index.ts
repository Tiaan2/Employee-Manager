import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../../firebaseconfig'
import { onAuthStateChanged } from 'firebase/auth'
import Login from '../views/Login.vue'
import Signup from '../views/Signup.vue'
import Home from '../views/Home.vue'

// Create a promise that resolves with the current user or null
const getCurrentUser = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe() // Unsubscribe to avoid memory leaks
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
    path: '/login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/signup',
    component: Signup,
    meta: { guestOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  try {
    const currentUser = await getCurrentUser()

    if (to.meta.requiresAuth && !currentUser) {
      next('/login')
    } else if (to.meta.guestOnly && currentUser) {
      next('/')
    } else {
      next()
    }
  } catch (error) {
    console.error('Error in navigation guard:', error)
    next('/login') // Redirect to login or handle the error as needed
  }
})

export default router
