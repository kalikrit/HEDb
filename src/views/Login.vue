<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="flex justify-center">
          <div class="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag class="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          HEDb Dashboard
        </h2>
      </div>

      <Card>
        <form @submit.prevent="handleLogin" class="space-y-6">
          <Input
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="admin@example.com"
            :error="errors.email"
            left-icon="Mail"
            required
          />

          <Input
            v-model="form.password"
            label="Пароль"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            left-icon="Lock"
            required
          />

          <Button
            type="submit"
            variant="primary"
            block
            :loading="authStore.isLoading"
          >
            Войти
          </Button>

          <p v-if="errors.form" class="text-sm text-red-600 text-center">
            {{ errors.form }}
          </p>

          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
              Демо-доступ:
            </p>
            <div class="space-y-1 text-xs text-blue-700 dark:text-blue-300">
              <p><span class="font-mono">admin@example.com</span> / password</p>
              <p><span class="font-mono">manager@example.com</span> / password</p>
            </div>
          </div>
        </form>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingBag, Mail, Lock } from 'lucide-vue-next'
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
  password: ''
})

const errors = ref<Record<string, string>>({})

const handleLogin = async () => {
  console.log('Login started')
  
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
  
  if (hasErrors) {
    return
  }
  
  console.log('Validation passed, calling authStore.login')
  
  // Вызываем login из store
  const result = await authStore.login(form.email, form.password)
  
  console.log('Login result:', result)
  
  if (result.success) {
    uiStore.addNotification('Успешный вход в систему!', 'success')
    router.push('/')
  } else {
    errors.value.form = result.error || 'Ошибка входа'
  }
}
</script>