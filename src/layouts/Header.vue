<template>
  <header
    class="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
  >
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Левая часть -->
        <div class="flex items-center">
          <!-- Кнопка бургер для мобильных -->
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
          >
            <Menu v-if="!isSidebarOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>

          <!-- Хлебные крошки -->
          <nav class="ml-4 lg:ml-0 flex items-center space-x-2 text-sm">
            <RouterLink
              to="/"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Home class="w-4 h-4" />
            </RouterLink>
            
            <ChevronRight
              v-for="(crumb, index) in breadcrumbs"
              :key="index"
              class="w-4 h-4 text-gray-400"
            />
            
            <span
              v-for="(crumb, index) in breadcrumbs"
              :key="`text-${index}`"
              class="text-gray-700 dark:text-gray-200"
            >
              {{ crumb }}
            </span>
          </nav>
        </div>

        <!-- Правая часть -->
        <div class="flex items-center space-x-3">
          <!-- Поиск -->
          <div class="hidden md:block relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              class="pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              @keyup.enter="handleSearch"
            />
          </div>

          <!-- Кнопка поиска на мобильных -->
          <button
            @click="showMobileSearch = true"
            class="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-md"
          >
            <Search class="w-5 h-5" />
          </button>

          <!-- Уведомления -->
          <div class="relative">
            <button
              @click="toggleNotifications"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-md relative"
            >
              <Bell class="w-5 h-5" />
              <span
                v-if="unreadNotificationsCount > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
              />
            </button>

            <!-- Дропдаун уведомлений -->
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
                    Уведомления
                  </h3>
                  <button
                    @click="markAllAsRead"
                    class="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Прочитать все
                  </button>
                </div>
              </div>
              
              <div class="max-h-96 overflow-y-auto">
                <div
                  v-for="notification in notifications"
                  :key="notification.id"
                  class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  :class="{ 'bg-gray-50 dark:bg-gray-700': !notification.read }"
                  @click="markAsRead(notification.id)"
                >
                  <p class="text-sm text-gray-900 dark:text-white">
                    {{ notification.message }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ formatTimeAgo(notification.createdAt) }}
                  </p>
                </div>
              </div>
              
              <div class="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  @click="viewAllNotifications"
                  class="w-full text-center text-sm text-primary-600 hover:text-primary-700"
                >
                  Все уведомления
                </button>
              </div>
            </div>
          </div>

          <!-- Тема -->
          <button
            @click="toggleTheme"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 rounded-md"
            :title="theme === 'light' ? 'Включить темную тему' : 'Включить светлую тему'"
          >
            <Sun v-if="theme === 'dark'" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <!-- Профиль -->
          <div class="relative">
            <button
              @click="showProfileMenu = !showProfileMenu"
              class="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img
                :src="user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'"
                alt="Profile"
                class="w-8 h-8 rounded-full"
              />
              <span class="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ user?.name || 'Гость' }}
              </span>
              <ChevronDown class="hidden md:block w-4 h-4 text-gray-500" />
            </button>

            <!-- Дропдаун профиля -->
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <RouterLink
                to="/settings/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showProfileMenu = false"
              >
                <User class="w-4 h-4 inline mr-2" />
                Профиль
              </RouterLink>
              <RouterLink
                to="/settings"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="showProfileMenu = false"
              >
                <Settings class="w-4 h-4 inline mr-2" />
                Настройки
              </RouterLink>
              <hr class="my-1 border-gray-200 dark:border-gray-700" />
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut class="w-4 h-4 inline mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Мобильный поиск -->
    <div
      v-if="showMobileSearch"
      class="fixed inset-0 z-50 bg-white dark:bg-gray-800 p-4"
    >
      <div class="flex items-center space-x-3">
        <button
          @click="showMobileSearch = false"
          class="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
        <input
          ref="mobileSearchInput"
          type="text"
          placeholder="Поиск..."
          class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          @keyup.enter="handleMobileSearch"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import {
  Menu,
  X,
  Home,
  ChevronRight,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  ChevronDown,
  ArrowLeft,
} from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";
import { formatTimeAgo } from "@/utils/formatters";

const uiStore = useUIStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const { theme, isSidebarOpen, notifications } = storeToRefs(uiStore);
const { getUser: user } = storeToRefs(authStore);

const showProfileMenu = ref(false);
const showNotifications = ref(false);
const showMobileSearch = ref(false);
const mobileSearchInput = ref<HTMLInputElement | null>(null);

// Хлебные крошки
const breadcrumbs = computed(() => {
  const paths = route.path.split("/").filter(Boolean);
  return paths.map((path, index) => {
    // Можно добавить маппинг на русские названия
    const names: Record<string, string> = {
      products: "Товары",
      orders: "Заказы",
      customers: "Клиенты",
      analytics: "Аналитика",
      settings: "Настройки",
      profile: "Профиль",
      categories: "Категории",
      new: "Создание",
      edit: "Редактирование",
    };
    return names[path] || path.charAt(0).toUpperCase() + path.slice(1);
  });
});

// Непрочитанные уведомления
const unreadNotificationsCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Методы
const toggleSidebar = () => uiStore.toggleSidebar();
const toggleTheme = () => uiStore.toggleTheme();

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const markAsRead = (id: string) => {
  uiStore.removeNotification(id);
};

const markAllAsRead = () => {
  uiStore.clearNotifications();
  showNotifications.value = false;
};

const viewAllNotifications = () => {
  showNotifications.value = false;
  router.push("/notifications");
};

const handleSearch = (event: Event) => {
  const query = (event.target as HTMLInputElement).value;
  if (query.trim()) {
    router.push({ path: "/search", query: { q: query } });
  }
};

const handleMobileSearch = (event: Event) => {
  handleSearch(event);
  showMobileSearch.value = false;
};

const handleLogout = () => {
  showProfileMenu.value = false;
  authStore.logout();
  uiStore.addNotification("Вы успешно вышли из системы", "info");
  router.push("/login");
};

// Фокус на мобильный поиск при открытии
watch(showMobileSearch, (newVal) => {
  if (newVal) {
    nextTick(() => {
      mobileSearchInput.value?.focus();
    });
  }
});

// Закрытие дропдаунов при клике вне
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.profile-menu') && showProfileMenu.value) {
    showProfileMenu.value = false;
  }
  if (!target.closest('.notifications-menu') && showNotifications.value) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>