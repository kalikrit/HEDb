<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Показываем layout только если не на странице логина -->
    <template v-if="!isAuthPage">
      <Sidebar />
      <div class="lg:pl-64 min-h-screen flex flex-col">
        <Header />
        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <!-- Анимация загрузки -->
          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          
          <!-- Контент страницы -->
          <router-view v-else />
        </main>
      </div>
    </template>

    <!-- Для страницы логина показываем только контент -->
    <template v-else>
      <router-view />
    </template>

    <!-- Глобальные уведомления -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2">
      <TransitionGroup
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="w-80 p-4 rounded-lg shadow-lg"
          :class="[
            notification.type === 'success' ? 'bg-green-50 dark:bg-green-900 border-l-4 border-green-500' : '',
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900 border-l-4 border-red-500' : '',
            notification.type === 'info' ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : '',
          ]"
        >
          <div class="flex items-start">
            <div class="flex-1">
              <p class="text-sm font-medium" :class="[
                notification.type === 'success' ? 'text-green-800 dark:text-green-200' : '',
                notification.type === 'error' ? 'text-red-800 dark:text-red-200' : '',
                notification.type === 'info' ? 'text-blue-800 dark:text-blue-200' : '',
              ]">
                {{ notification.message }}
              </p>
            </div>
            <button
              @click="removeNotification(notification.id)"
              class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { X } from "lucide-vue-next";
import Sidebar from "../src/layouts/Sidebar.vue";
import Header from "../src/layouts/Header.vue";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

// Сторы
const uiStore = useUIStore();
const authStore = useAuthStore();
const route = useRoute();

// Состояние
const { isLoading, notifications } = storeToRefs(uiStore);

// Определяем, является ли текущая страница страницей авторизации
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register' || route.path === '/forgot-password';
});

// Удаление уведомления
const removeNotification = (id: string) => {
  uiStore.removeNotification(id);
};

// Инициализация при монтировании
onMounted(() => {
  // Проверяем авторизацию
  authStore.init();
  
  // Добавляем тестовое уведомление (для демо, потом убрать)
  if (import.meta.env.DEV) {
    setTimeout(() => {
      uiStore.addNotification('Добро пожаловать в HEDb!', 'success');
    }, 1000);
  }
});
</script>

<style>
/* Глобальные стили для анимаций */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Стили для скроллбара */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.dark ::-webkit-scrollbar-track {
  background: #1f2937;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>