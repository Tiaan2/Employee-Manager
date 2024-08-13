<!-- <script setup lang="ts">
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import FloatLabel from 'primevue/floatlabel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import Panel from 'primevue/panel'
import { ref } from 'vue'

const username = ref('')
const password = ref('')
</script>

<template>
  <div class="flex flex-column row-gap-5">
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-user"></i>
      </InputGroupAddon>
      <FloatLabel>
        <InputText id="username" v-model="username" />
        <label for="username">Username</label>
      </FloatLabel>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>
        <i class="pi pi-lock"></i>
      </InputGroupAddon>
      <FloatLabel>
        <InputText type="password" id="password" v-model="password" />
        <label for="username">Password</label>
      </FloatLabel>
    </InputGroup>
    <Button v-slot="slotProps" asChild>
      <button
        v-bind="slotProps.a11yAttrs"
        class="rounded-lg bg-gradient-to-br from-primary-400 to-primary-700 active:from-primary-700 active:to-primary-900 text-white border-none px-6 py-3 font-bold hover:ring-2 cursor-pointer ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 ring-primary transition-all"
      >
        SIGN UP
      </button>
    </Button>
    <div class="flex justify-between items-center mt-4">
      <Button class="text-blue-500" @click="goToSignup"> Don't have an account? Sign Up </Button>
    </div>
  </div>
</template> -->

<script setup lang>
import Card from 'primevue/card'
import Password from 'primevue/password'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const userEmail = ref('')
const password = ref(null)
const errorMsg = ref(null)
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center p-4 overflow-auto dark:">
    <div class="w-full max-w-[450px] px-4 overflow-auto">
      <!-- <div class="flex flex-col gap-5 items-center w-[400px] max-w-md"> -->
      <Card class="w-full border border-surface-border bg-primary-inverse dark:bg-surface-800">
        <template #header>
          <div class="flex justify-center items-center p-4">
            <img src="" alt="Logo" class="w-[100px] h-[100px] self-center" />
          </div>
        </template>
        <template #title>
          <h1 class="font-medium">Log in</h1>
        </template>
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-2 items-start">
              <h3 class="font-semibold">Email Address</h3>
              <InputText
                id="email"
                type="email"
                class="w-full"
                v-model="userEmail"
                placeholder="email@example.com"
              />
            </div>
            <div class="flex flex-col gap-2 items-start">
              <h3 class="font-semibold">Password</h3>
              <div class="flex justify-center w-full">
                <Password v-model="password" toggleMask class="w-full" :feedback="false">
                  <template #header>
                    <h6 class="font-medium m-0 mb-2 text-base">Enter your password</h6>
                  </template>
                </Password>
              </div>
            </div>
            <small v-if="errorMsg" class="text-red-500">{{ errorMsg }}</small>
            <Button class="w-full" label="Login" @click="signIn" />
            <Divider align="center">
              <b class="bg-none">or</b>
            </Divider>
            <Button icon="pi pi-google" class="w-full" @click="signInWithOauth" />
            <small class="text-center"
              >Don't have an account?
              <NuxtLink to="/signup" class="underline">Sign up</NuxtLink>
            </small>
          </div>
        </template>
      </Card>
    </div>
  </div>
  <!-- </div> -->
</template>
