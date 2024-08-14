<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import { useRouter } from 'vue-router'
import { updateProfile, deleteUser } from 'firebase/auth'
import { auth } from '../../firebaseconfig'

const settings = ref({
  username: '',
  email: '',
  password: '',
  notifications: false
})

updateProfile(auth.currentUser!, {
  displayName: settings.value.username,
  photoURL: 'https://example.com/jane-q-user/profile.jpg'
})
  .then(() => {
    // Profile updated!
    // ...
  })
  .catch((error) => {
    // An error occurred
    // ...
  })

const saveSettings = () => {
  // Handle settings save logic here
  console.log('Settings saved:', settings.value)
}
</script>

<template>
  <div class="settings-container">
    <h1>Account Settings</h1>
    <Divider></Divider>
    <div class="flex flex-column row-gap-5">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="email" v-model="email" />
          <label for="email">Email</label>
        </FloatLabel>
      </InputGroup>
    </div>
    <small v-show="emailError" class="red">{{ emailError }}</small>
    <div class="flex flex-column row-gap-5">
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>
        <FloatLabel>
          <Password v-model="password" toggleMask :feedback="false"></Password>
          <label for="username">Password</label>
        </FloatLabel>
      </InputGroup>
    </div>
    <small v-show="passwordError" class="red">{{ passwordError }}</small>
    <div class="flex flex-column row-gap-4">
      <Button v-slot="slotProps" asChild>
        <button
          @click="handleSignin"
          v-bind="slotProps.a11yAttrs"
          class="rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 active:from-primary-700 active:to-primary-900 text-white border-none px-6 py-3 font-bold hover:ring-2 cursor-pointer ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 ring-primary transition-all"
        >
          Log In
        </button>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  justify-content: center;
  align-items: center;
  border: 1px solid #333;
  border-radius: 5%;
  padding: 2rem;
}

.p-field {
  margin-bottom: 1rem;
}
</style>
