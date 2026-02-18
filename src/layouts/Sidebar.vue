<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!-- Логотип и название -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <ShoppingBag class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-semibold text-gray-800 dark:text-white">HEDb</span>
      </div>
      
      <!-- Кнопка закрытия на мобильных -->
      <button
        @click="toggleSidebar"
        class="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Навигация -->
    <nav class="p-4 space-y-1">
      <div
        v-for="item in menuItems"
        :key="item.path"
        class="relative"
      >
        <!-- Ссылка меню -->
        <RouterLink
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
          :class="[
            isActive(item.path)
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
          ]"
          @click="onNavigate"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.title }}</span>
          
          <!-- Бейдж уведомлений (пример) -->
          <span
            v-if="item.badge"
            class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            {{ item.badge }}
          </span>
        </RouterLink>

        <!-- Подменю (если есть) -->
        <div v-if="item.children" class="ml-11 mt-1 space-y-1">
          <RouterLink
            v-for="child in item.children"
            :key="child.path"
            :to="child.path"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive(child.path)
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
            ]"
          >
            {{ child.title }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Футер сайдбара (юзер) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <img
          :src="user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'"
          alt="Avatar"
          class="w-8 h-8 rounded-full"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
            {{ user?.name || 'Гость' }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
            {{ user?.role || 'Не авторизован' }}
          </p>
        </div>
        <button
          @click="logout"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="Выйти"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Оверлей для мобильных -->
  <div
    v-if="isOpen && isMobile"
    class="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 lg:hidden"
    @click="toggleSidebar"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Users,
  Tag,
  Truck,
  X,
  LogOut,
} from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

// Типы для пунктов меню
interface MenuItem {
  title: string;
  path: string;
  icon: any;
  badge?: number;
  children?: { title: string; path: string }[];
}

// Стор
const uiStore = useUIStore();
const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Состояние
const { isSidebarOpen: isOpen } = storeToRefs(uiStore);
const { getUser: user } = storeToRefs(authStore);

// Определяем мобильное устройство
const isMobile = computed(() => window.innerWidth < 1024);

// Пункты меню
const menuItems: MenuItem[] = [
  {
    title: "Дашборд",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Товары",
    path: "/products",
    icon: Package,
    badge: 3, // Пример: количество товаров с низким запасом
    children: [
      { title: "Все товары", path: "/products" },
      { title: "Категории", path: "/products/categories" },
      { title: "Добавить товар", path: "/products/new" },
    ],
  },
  {
    title: "Заказы",
    path: "/orders",
    icon: ShoppingCart,
    badge: 5, // Пример: новые заказы
    children: [
      { title: "Все заказы", path: "/orders" },
      { title: "Возвраты", path: "/orders/refunds" },
      { title: "Доставка", path: "/orders/shipping" },
    ],
  },
  {
    title: "Клиенты",
    path: "/customers",
    icon: Users,
  },
  {
    title: "Аналитика",
    path: "/analytics",
    icon: BarChart3,
    children: [
      { title: "Продажи", path: "/analytics/sales" },
      { title: "Товары", path: "/analytics/products" },
      { title: "Отчеты", path: "/analytics/reports" },
    ],
  },
  {
    title: "Маркетинг",
    path: "/marketing",
    icon: Tag,
    children: [
      { title: "Акции", path: "/marketing/promotions" },
      { title: "Купоны", path: "/marketing/coupons" },
    ],
  },
  {
    title: "Настройки",
    path: "/settings",
    icon: Settings,
    children: [
      { title: "Профиль", path: "/settings/profile" },
      { title: "Магазин", path: "/settings/store" },
      { title: "Пользователи", path: "/settings/users" },
    ],
  },
];

// Проверка активного маршрута
const isActive = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

// Закрыть сайдбар при навигации на мобильных
const onNavigate = () => {
  if (isMobile.value) {
    uiStore.toggleSidebar();
  }
};

// Выход
const logout = async () => {
  authStore.logout();
  uiStore.addNotification("Вы успешно вышли из системы", "info");
  router.push("/login");
};

// Переключение сайдбара
const toggleSidebar = () => {
  uiStore.toggleSidebar();
};
</script>