<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRouter } from 'vue-router'
import Message from 'primevue/message'
import { ref } from 'vue'
import { auth } from '../../firebaseconfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { isEmailValid, isPasswordValid } from './validators'

const router = useRouter()
const goToSignup = () => {
  router.push('/')
}

const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const isPasswordValid = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  return regex.test(password)
}

const isEmailValid = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const handleSignup = async () => {
  emailError.value = ''
  passwordError.value = ''

  if (!email.value || !password.value) {
    if (!email.value) emailError.value = 'Email must not be empty'
    if (!password.value) passwordError.value = 'Password must not be empty'
    return
  }

  if (!isEmailValid(email.value)) {
    emailError.value = 'Invalid email address. Please enter a valid email.'
    return
  }

  if (!isPasswordValid(password.value)) {
    passwordError.value =
      'Password must be at least 8 characters long and contain at least one uppercase letter and one lowercase letter.'
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    console.log('User signed up:', user)
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = (error as any).code
      const errorMessage = (error as any).message

      switch (errorCode) {
        case 'auth/email-already-in-use':
          emailError.value = 'Email is already in use. Please use a different email.'
          break
        case 'auth/invalid-email':
          emailError.value = 'Invalid email address. Please enter a valid email.'
          break
        case 'auth/weak-password':
          passwordError.value = 'Password is too weak. Please enter a stronger password.'
          break
        default:
          console.error('Signup error:', errorMessage)
          break
      }
    }
  }
}
</script>

<template>
  <div class="container flex flex-column row-gap-4">
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText id="email" v-model="email" />
          <label for="email">Email</label>
        </FloatLabel>
        <small v-if="emailError" class="text-red-500">{{ emailError }}</small>
      </InputGroup>
    </div>
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>
        <FloatLabel>
          <InputText type="password" id="password" v-model="password" />
          <label for="username">Password</label>
        </FloatLabel>
        <small v-if="passwordError" class="text-red-500">{{ passwordError }}</small>
      </InputGroup>
    </div>
    <Button v-slot="slotProps" asChild>
      <button
        @click="handleSignup"
        v-bind="slotProps.a11yAttrs"
        class="rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 active:from-primary-700 active:to-primary-900 text-white border-none px-6 py-3 font-bold hover:ring-2 cursor-pointer ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 ring-primary transition-all"
      >
        Sign Up
      </button>
    </Button>
    <div class="flex justify-between items-center mt-4">
      <Button class="text-blue-500" @click="goToSignup"> Already have an account? Log In </Button>
    </div>
  </div>
</template>

<style>
body {
  height: 100%;
  margin: 0;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150%;
  width: 150%;
  padding: 2rem;
  margin: 2rem;
  border: 1px solid red;
}
</style>
