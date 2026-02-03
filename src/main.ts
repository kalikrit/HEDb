import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализируем тему после создания приложения
import { useUIStore } from '@/stores/ui'
app.mount('#app')

// Инициализация темы
const uiStore = useUIStore()
uiStore.initTheme()