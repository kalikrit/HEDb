<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
  >
    <div class="w-full max-w-md">
      <!-- Логотип и заголовок -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
          <ShoppingBag class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          HEDb Dashboard
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Войдите в панель управления
        </p>
      </div>

      <!-- Карточка с формой -->
      <Card class="w-full shadow-xl">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <Input
              v-model="form.email"
              type="email"
              placeholder="admin@example.com"
              :error="errors.email"
              left-icon="Mail"
              required
            />
          </div>

          <!-- Пароль -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Пароль
            </label>
            <Input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :error="errors.password"
              left-icon="Lock"
              required
            />
          </div>

          <!-- Запомнить меня и забыли пароль -->
          <div class="flex items-center justify-between">
            <label class="flex items-center cursor-pointer">
              <input
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Запомнить меня
              </span>
            </label>

            <router-link
              to="/forgot-password"
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
            >
              Забыли пароль?
            </router-link>
          </div>

          <!-- Кнопка входа -->
          <Button
            type="submit"
            variant="primary"
            block
            :loading="authStore.isLoading"
            size="lg"
          >
            Войти
          </Button>

          <!-- Ошибка формы -->
          <div v-if="errors.form" class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400 text-center">
              {{ errors.form }}
            </p>
          </div>
        </form>
      </Card>

      <!-- Демо-данные -->
      <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p class="text-sm font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
          <Info class="w-4 h-4 mr-1" />
          Демо-доступ:
        </p>
        <div class="space-y-2">
          <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-900">
            <div class="flex items-center space-x-2 text-sm">
              <span class="font-mono text-blue-700 dark:text-blue-300">admin@example.com</span>
              <span class="text-gray-400">/</span>
              <span class="font-mono text-blue-700 dark:text-blue-300">password</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              @click="fillDemoCredentials('admin')"
              class="text-xs"
            >
              Заполнить
            </Button>
          </div>
          <div class="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-900">
            <div class="flex items-center space-x-2 text-sm">
              <span class="font-mono text-blue-700 dark:text-blue-300">manager@example.com</span>
              <span class="text-gray-400">/</span>
              <span class="font-mono text-blue-700 dark:text-blue-300">password</span>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              @click="fillDemoCredentials('manager')"
              class="text-xs"
            >
              Заполнить
            </Button>
          </div>
        </div>
      </div>

      <!-- Ссылка на регистрацию -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Нет аккаунта?
        <router-link
          to="/register"
          class="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
        >
          Зарегистрироваться
        </router-link>
      </p>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Mail, Lock, Info } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import Card from '../components/ui/Card.vue'
import Input from '../components/ui/Input.vue'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = ref<Record<string, string>>({})

const handleLogin = async () => {
  // Очищаем ошибки
  errors.value = {}
  
  // Валидация
  let hasErrors = false
  
  if (!form.email) {
    errors.value.email = 'Email обязателен'
    hasErrors = true
  } else if (!form.email.includes('@')) {
    errors.value.email = 'Некорректный email'
    hasErrors = true
  }
  
  if (!form.password) {
    errors.value.password = 'Пароль обязателен'
    hasErrors = true
  } else if (form.password.length < 3) {
    errors.value.password = 'Пароль слишком короткий'
    hasErrors = true
  }
  
  if (hasErrors) return
  
  const result = await authStore.login(form.email, form.password)
  
  if (result.success) {
    uiStore.addNotification('Успешный вход в систему!', 'success')
    router.push('/')
  } else {
    errors.value.form = result.error || 'Ошибка входа'
  }
}

const fillDemoCredentials = (role: 'admin' | 'manager') => {
  if (role === 'admin') {
    form.email = 'admin@example.com'
    form.password = 'password'
  } else {
    form.email = 'manager@example.com'
    form.password = 'password'
  }
}
</script>