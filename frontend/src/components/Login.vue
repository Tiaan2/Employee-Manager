<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRouter } from 'vue-router'
import Divider from 'primevue/divider'
import Password from 'primevue/password'

import { ref } from 'vue'
import { auth } from '../../firebaseconfig'
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const goToSignup = () => {
  router.push('/signup')
}
const email = ref('')
const password = ref('')
const emailError = ref('')
const passwordError = ref('')

const handleSignin = async () => {
  try {
    if (!email.value || !password.value) {
      if (!email.value) emailError.value = 'Email must not be empty'
      if (!password.value) passwordError.value = 'Password must not be empty'
      return
    }
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = (error as any).code
      const errorMessage = (error as any).message

      switch (errorCode) {
        case 'auth/invalid-email':
          emailError.value = 'Invalid email address. Please enter a valid email.'
          passwordError.value = ''
          break
        case 'auth/missing-password':
          passwordError.value = 'Please enter your password.'
          emailError.value = ''
          break
        case 'auth/invalid-credential':
          emailError.value = 'Incorrect Login Credentials.'
          passwordError.value = 'Incorrect Login Credentials'
          break
        default:
          console.error('Signup error:', errorMessage)
          break
      }
    }
  }
}

const signInGoogle = async () => {
  const provider = new GoogleAuthProvider()
  signInWithPopup(auth, provider)
    .then((result) => {
      router.push('/')
    })
    .catch((error) => {
      console.log('Google Sign In error:', error)
    })
}
</script>

<template>
  <div class="outer">
    <div class="inner">
      <div class="title"><h1 class="h1">Log In</h1></div>
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
        <Button label="Login" severity="primary" rounded @click="handleSignin" />

        <Divider>OR</Divider>
        <Button label="Google Sign In" severity="success" @click="signInGoogle" />
        <a class="cursor-pointer" @click="goToSignup"> Don't have an account? Sign Up </a>
      </div>
    </div>
  </div>
</template>
