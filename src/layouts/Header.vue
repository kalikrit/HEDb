<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu class="w-6 h-6" />
          </button>
          <span class="ml-2 text-gray-700 dark:text-gray-200">{{ pageTitle }}</span>
        </div>

        <div class="flex items-center space-x-3">
          <button
            @click="toggleTheme"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          >
            <Sun v-if="theme === 'dark'" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { Menu, Sun, Moon } from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";

const uiStore = useUIStore();
const route = useRoute();

const { theme } = storeToRefs(uiStore);

// Прямая функция переключения
const toggleSidebar = () => {
  console.log('📱 Кнопка нажата');
  uiStore.toggleSidebar();
};

const toggleTheme = () => {
  uiStore.toggleTheme();
};

const pageTitle = computed(() => {
  if (route.path === '/') return 'Дашборд';
  if (route.path.includes('/products')) return 'Товары';
  return 'HEDb';
});
</script>