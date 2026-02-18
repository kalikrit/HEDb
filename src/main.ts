import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Создаем pinia instance
const pinia = createPinia()

// СОЗДАЕМ store ДО app.use(pinia)
import { useUIStore } from './stores/ui'
import { useAuthStore } from './stores/auth'

// Создаем временный контекст для инициализации
const tempApp = createApp({})
tempApp.use(pinia)

// Инициализируем store ДО создания основного приложения
const uiStore = useUIStore()
const authStore = useAuthStore()

console.log('🟡 Pre-initializing stores...')
uiStore.init()  // Инициализируем UI store
authStore.init() // Инициализируем Auth store

console.log('✅ Stores initialized, sidebar:', uiStore.isSidebarOpen)

// Создаем основное приложение
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')

// Делаем store доступными глобально
window.__PINIA_STORES__ = {
  uiStore: useUIStore(),
  authStore: useAuthStore()
}