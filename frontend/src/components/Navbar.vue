<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { computed } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import md5 from 'md5'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Badge from 'primevue/badge'

const auth = getAuth()
const router = useRouter()
const user = ref(auth.currentUser)
const isAuthenticated = ref(!!user.value)
const email = computed(() => user.value?.email || '')
const gravatarUrl = computed(() => getGravatarUrl(email.value))

auth.onAuthStateChanged((currentUser) => {
  user.value = currentUser
  isAuthenticated.value = !!currentUser
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
  return `https://gravatar.com/avatar/${hash}`
}

const menu = ref<typeof Menu | null>(null)

const isDarkMode = ref(false)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('my-app-dark', isDarkMode.value)
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  updateMenuItems()
}

const updateMenuItems = () => {
  menuItems.value[0].icon = isDarkMode.value ? 'pi pi-sun' : 'pi pi-moon'
  menuItems.value[0].label = isDarkMode.value ? 'Light Mode' : 'Dark Mode'
}

const menuItems = ref([
  {
    label: 'Dark Mode',
    icon: 'pi pi-moon',
    command: toggleDarkMode
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: handleLogout
  }
])

const toggleMenu = (event: Event) => {
  if (menu.value) {
    menu.value.toggle(event)
  }
}

const items = ref([
  {
    label: 'Home',
    icon: 'pi pi-home',
    to: '/'
  },
  {
    label: 'Hierarchy',
    icon: 'pi pi-sitemap',
    to: '/hierarchy'
  }
])

onMounted(() => {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === 'true'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('my-app-dark', isDarkMode.value)
  updateMenuItems()

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('darkMode') === null) {
      isDarkMode.value = e.matches
      document.documentElement.classList.toggle('my-app-dark', isDarkMode.value)
      updateMenuItems()
    }
  })
})
</script>

<template>
  <nav>
    <div class="nav">
      <Menubar class="menu" :model="items">
        <template #item="{ item, props, root }">
          <router-link :to="item.to">
            <a class="links px-6 py-4" v-bind="props.action">
              <span :class="item.icon" class="mr-1" />
              <span>{{ item.label }}</span>
              <Badge
                v-if="item.badge"
                :class="{ 'ml-auto': !root, 'ml-2': root }"
                :value="item.badge"
              />
              <span v-if="item.shortcut">{{ item.shortcut }}</span>
            </a>
          </router-link>
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
nav {
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #333;
}

.nav {
  justify-content: center;
  align-items: center;
  width: 100vw;
  font-size: 1.5rem;
}
</style>
