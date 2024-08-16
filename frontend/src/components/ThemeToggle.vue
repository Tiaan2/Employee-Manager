<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Button from 'primevue/button'

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  updateTheme()
}

const updateTheme = () => {
  document.documentElement.classList.toggle('my-app-dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value.toString())
}

const initTheme = () => {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === 'true'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateTheme()
}

onMounted(() => {
  initTheme()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = e.matches
      updateTheme()
    }
  })
})

watch(isDarkMode, updateTheme)
</script>
<template>
  <Button :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'" @click="toggleDarkMode" />
</template>
