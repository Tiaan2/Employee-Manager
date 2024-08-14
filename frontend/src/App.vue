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
    <Nav class="navbar" v-if="route.path !== '/login' && route.path !== '/signup'" />
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

.navbar {
  margin-bottom: auto;
  width: 100%;
}

main {
  flex: 1;
  width: 100%;
  padding: 2rem;
}

.footer {
  margin-top: auto;
  border-top: 1px solid #333;
  width: 100%;
}
</style>
