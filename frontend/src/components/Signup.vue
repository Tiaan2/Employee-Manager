<script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import Card from 'primevue/card'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { auth } from '../../firebaseconfig'
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const goToSignup = () => {
  router.push('/')
}

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

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
    if (!confirmPassword.value) confirmPasswordError.value = 'Confirm Password must not be empty'
    return
  }

  if (!isEmailValid(email.value)) {
    emailError.value = 'Invalid email address. Please enter a valid email.'
    return
  }

  if (!isPasswordValid(password.value)) {
    passwordError.value = 'Invalid Password.'
    return
  }

  if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Passwords do not match.'
    passwordError.value = 'Passwords do not match.'
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
          passwordError.value = ''
          break
        case 'auth/invalid-email':
          emailError.value = 'Invalid email address. Please enter a valid email.'
          passwordError.value = ''
          break
        case 'auth/weak-password':
          passwordError.value = 'Password is too weak. Please enter a stronger password.'
          emailError.value = ''
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
      <div class="title"><h1 class="h1">Sign Up</h1></div>
      <!-- <img src="../assets/STAFF.png" alt="logo" class="img" /> -->
      <Divider></Divider>
      <div class="flex flex-column row-gap-3">
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
      <small v-if="emailError" class="red">{{ emailError }}</small>
      <div class="flex flex-column row-gap-5">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <FloatLabel>
            <Password v-model="password" toggleMask>
              <template #header>
                <div class="font-semibold text-xm mb-4">Pick a password</div>
              </template>
              <template #footer>
                <Divider />
                <ul class="pl-2 ml-2 my-0 leading-normal">
                  <li>At least one lowercase letter</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one number</li>
                  <li>Minimum 8 of characters</li>
                </ul>
              </template>
            </Password>
            <label for="username">Password</label>
          </FloatLabel>
        </InputGroup>
      </div>
      <small v-if="passwordError" class="red">{{ passwordError }}</small>
      <div class="flex flex-column row-gap-3">
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-lock"></i>
          </InputGroupAddon>
          <FloatLabel>
            <Password v-model="confirmPassword" :feedback="false" toggleMask>
              <template #header>
                <div class="font-semibold text-xm mb-4">Confirm your password</div>
              </template>
            </Password>
            <label for="username">Confirm Password</label>
          </FloatLabel>
        </InputGroup>
      </div>
      <small v-if="confirmPasswordError" class="red">{{ confirmPasswordError }}</small>
      <div class="flex flex-column row-gap-3">
        <Button label="Sign Up" severity="primary" rounded @click="handleSignup" />
        <Divider> OR </Divider>
        <Button label="Google Sign In" severity="success" @click="signInGoogle" />
        <a class="cursor-pointer" @click="goToSignup"> Already have an account? Log In </a>
      </div>
    </div>
  </div>
</template>

<style>
html,
body {
  height: 100%;
  margin: 0;
  overflow: hidden;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 20%;
  border-radius: 100%;
}

.temp {
  display: flex;
  justify-content: center;
  align-items: center;
}

.outer {
  display: flex;
  flex-direction: column;
  gap: -1rem;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}

.inner {
  width: 50%;
  max-width: 450px;
  padding: 2rem;
  border-radius: 6%;
  box-shadow: 0 7px 10px rgb(0, 0, 0);
  justify-content: center;
  align-items: center;
}

.red {
  color: #ef4444;
}

.h1 {
  font-weight: bolder;
  font-size: 3rem;
}

.title {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -1rem;
}

.flex {
  display: flex;
  margin-top: 1.5rem;
}

.cursor-pointer {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.cursor-pointer:hover {
  text-decoration: underline;
}
</style>
