<template>
  <div>
    <Button
      type="button"
      icon="pi pi-user"
      @click="toggleMenu"
      aria-haspopup="true"
      aria-controls="avatar_menu"
      class="p-button-rounded p-button-text"
    />
    <Menu
      ref="menu"
      id="avatar_menu"
      :model="menuItems"
      :popup="true"
      v-show="menuVisible"
      @hide="menuVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Menu from 'primevue/menu'

const menuVisible = ref(false)
const menuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      /* Navigate to profile */
    }
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      /* Navigate to settings */
    }
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => {
      /* Handle logout */
    }
  }
])

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}
</script>

<style scoped>
/* Style your button and menu as needed */
.p-button-rounded {
  border-radius: 50%;
}
</style>
