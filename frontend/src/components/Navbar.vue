<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { computed } from 'vue'
import { currentUser } from '../../firebaseconfig'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import md5 from 'md5'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Badge from 'primevue/badge'
import { useDark, useToggle } from '@vueuse/core'

const auth = getAuth()
const user = computed(() => currentUser.value)
const email = user.value?.email ?? ''
const gravatarUrl = getGravatarUrl(email)
const router = useRouter()
const isAuthenticated = ref(auth.currentUser !== null)

auth.onAuthStateChanged((user) => {
  isAuthenticated.value = !!user
})

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

function getGravatarUrl(email: string, size: number = 80): string {
  const normalizedEmail = email.trim().toLowerCase()
  const hash = md5(normalizedEmail)
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

const menu = ref<typeof Menu | null>(null)

const isDark = useDark({
  selector: 'app-container',
  attribute: 'color-scheme',
  valueDark: 'dark',
  valueLight: 'light'
})

const toggleDark = useToggle(isDark)
const isDarkMode = ref(false)
const menuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user'
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog'
  },
  {
    label: 'Theme',
    icon: isDarkMode.value ? 'pi pi-sun' : 'pi pi-moon',
    command: () => toggleDark()
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: () => handleLogout()
  }
])

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('my-app-dark', isDarkMode.value)
  if (isDarkMode.value) {
    localStorage.setItem('theme', 'dark')
  } else {
    localStorage.removeItem('theme')
  }
}

// Watch for changes in isDarkMode to update menuItems
watch(isDarkMode, (newVal) => {
  menuItems.value[2].icon = newVal ? 'pi pi-sun' : 'pi pi-moon'
})

const toggleMenu = () => {
  try{
    if (menu.value){
      menu.value.toggle(event)
    }
  }
  catch (error) {
    console.error('Error toggling menu:', error)
}

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home'
  },
  {
    label: 'Features',
    icon: 'pi pi-star'
  }
])
</script>

<template>
  <nav>
    <div class="nav">
      <Menubar :model="items">
        <template #item="{ item, props, hasSubmenu, root }">
          <a class="px-6 py-4 hover:bg-blue-700 rounded" v-bind="props.action">
            <span :class="item.icon" class="mr-2" />
            <span>{{ item.label }}</span>
            <Badge
              v-if="item.badge"
              :class="{ 'ml-auto': !root, 'ml-2': root }"
              :value="item.badge"
            />
            <span
              v-if="item.shortcut"
              class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1"
              >{{ item.shortcut }}</span
            >
            <i
              v-if="hasSubmenu"
              :class="[
                'pi pi-angle-down',
                { 'pi-angle-down ml-2': root, 'pi-angle-right ml-auto': !root }
              ]"
            ></i>
          </a>
        </template>
        <template #end>
          <div class="px-6">
            <Button
              type="button"
              icon="pi pi-user"
              @click="toggleMenu"
              aria-haspopup="true"
              aria-controls="avatar_menu"
              class="p-button-rounded p-button-text mr-4"
            >
              <Avatar :image="gravatarUrl" size="large" shape="circle" />
            </Button>
            <Menu ref="menu" id="avatar_menu" :model="menuItems" :popup="true" />
          </div>
        </template>
      </Menubar>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar styling */
nav {
  justify-content: center;
  align-items: center;
}

.nav {
  justify-content: center;
  align-items: center;
  width: 100vw;
  background-color: #333;
  color: white;
  font-size: 1.5rem;
}
/* Avatar styling */
.avatar {
  border-radius: 50%;
  width: 40px; /* Adjust size as needed */
  height: 40px; /* Adjust size as needed */
}
</style>
