<script setup lang="ts">
import { computed } from 'vue'
import { currentUser } from '../../firebaseconfig'

const user = computed(() => currentUser.value)

import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const auth = getAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login') // Redirect to login page after logout
  } catch (error) {
    console.error('Logout error:', error)
  }
}
</script>

<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <div v-if="user">
      <p>Hello, {{ user.email }}!</p>
      <button @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
    </div>
  </div>
</template>
