<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { useRouter } from 'vue-router'
import Checkbox from 'primevue/checkbox'
import Panel from 'primevue/panel'
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
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    console.log('User signed up:', user)
    router.push('/')
  } catch (error) {
    if (error instanceof Error) {
      const errorCode = (error as any).code
      const errorMessage = (error as any).message

      switch (errorCode) {
        case 'auth/invalid-email':
          emailError.value = 'Invalid email address. Please enter a valid email.'
          break
        case 'auth/missing-password':
          passwordError.value = 'Please enter your password.'
          break
        case 'auth/invalid-credential':
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
      // const credential = GoogleAuthProvider.credentialFromResult(result)
      // const token = credential.accessToken
      // const user = result.user
      router.push('/')
    })
    .catch((error) => {
      console.log('Google Sign In error:', error)
    })
}
</script>

<template>
  <div class="container flex flex-column row-gap-4">
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
    <Button v-slot="slotProps" asChild>
      <button
        @click="handleSignin"
        v-bind="slotProps.a11yAttrs"
        class="rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 active:from-primary-700 active:to-primary-900 text-white border-none px-6 py-3 font-bold hover:ring-2 cursor-pointer ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 ring-primary transition-all"
      >
        Log In
      </button>
    </Button>
    <div class="flex justify-between items-center mt-4">
      <Button class="text-blue-500" @click="signInGoogle">Google Sign In</Button>
    </div>

    <a class="cursor-pointer" @click="goToSignup"> Don't have an account? Sign Up </a>
  </div>
</template>
