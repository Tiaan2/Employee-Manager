import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { ref } from 'vue'

const firebaseConfig = {
  apiKey: 'AIzaSyDUlADOwYoO5DM3raOwyFVmdqpGgNnBiUA',
  authDomain: 'epi-use-project.firebaseapp.com',
  projectId: 'epi-use-project',
  storageBucket: 'epi-use-project.appspot.com',
  messagingSenderId: '294731759929',
  appId: '1:294731759929:web:1b2a3441a92cfc297ae8e8',
  measurementId: 'G-LHH3QH2HWT'
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export const currentUser = ref<User | null>(null)
onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})
