import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from '@/app.vue'
import router from '@/router'
import { useAuthStore } from './stores/auth'
import 'primeicons/primeicons.css'
import '@/assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue',
      },
    },
  },
})

const authStore = useAuthStore()
authStore.initialize().then(() => {
  app.mount('#app')
})
