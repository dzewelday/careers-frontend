import Aura from '@primeuix/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import app from '@/app.vue'
import router from '@/router'
import 'primeicons/primeicons.css'
import '@/assets/tailwind.css'

const pinia = createPinia()

createApp(app)
  .use(PrimeVue, {
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
  .use(pinia)
  .use(router)
  .mount('#app')
