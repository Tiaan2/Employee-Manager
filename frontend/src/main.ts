import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import lara from '@primevue/themes/lara'
import 'primeflex/primeflex.css'
import '../firebaseconfig'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: lara
    // options: {
    //   darkModeSelector: '.my-app-dark'
    // }
  }
})

app.use(router)

app.mount('#app')
