import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useTheme } from '@/composables/useTheme'
import { useTenant } from '@/composables/useTenant'
import { useSiteContent } from '@/composables/useSiteContent'

const app = createApp(App)
const { initializeTenant } = useTenant()
const { loadTheme } = useTheme()
const { loadSiteContent } = useSiteContent()

initializeTenant()
loadTheme()
loadSiteContent()

app.use(router)

app.mount('#app')
