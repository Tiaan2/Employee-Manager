<script setup lang="ts">
import { computed } from 'vue'
import { currentUser } from '../../firebaseconfig'

const user = computed(() => currentUser.value)
const gravatarUrl = getGravatarUrl(user.value?.email ?? '')

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

import md5 from 'md5' // Ensure you have md5 installed via npm

function getGravatarUrl(email: string, size: number = 80): string {
  const normalizedEmail = email.trim().toLowerCase()
  const hash = md5(normalizedEmail)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}
</script>

<template>
  <div>
    <h1>Welcome to the Home Page</h1>
    <div v-if="user">
      <img :src="gravatarUrl" alt="Employee Avatar" class="avatar" />
      <p>Hello, {{ user.email }}!</p>
      <button @click="handleLogout">Logout</button>
    </div>
    <div v-else>
      <p>You are not logged in.</p>
    </div>
  </div>
</template>

<style scoped>
.avatar {
  border-radius: 50%;
  width: 80px;
  height: 80px;
}
</style>
