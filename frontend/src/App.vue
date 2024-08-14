<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import Footer from './components/Footer.vue'
import Nav from './components/Navbar.vue'

const route = useRoute()

localStorage.setItem('theme', 'dark')
</script>

<template>
  <div class="app-container">
    <Nav v-if="route.path !== '/login' && route.path !== '/signup'" />
    <main>
      <RouterView />
    </main>
    <Footer class="footer" v-if="route.path !== '/login' && route.path !== '/signup'" />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
}

main {
  flex: 1; /* Takes up remaining space */
}

.footer {
  margin-top: auto;
  border-top: 1px solid #333;
}
</style>
