<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out',
      isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'lg:translate-x-0',
    ]"
  >
    <!-- Логотип -->
    <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <ShoppingBag class="w-5 h-5 text-white" />
        </div>
        <span class="text-lg font-semibold text-gray-800 dark:text-white">HEDb</span>
      </div>
    </div>

    <!-- Навигация -->
    <nav class="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <!-- Дашборд -->
      <RouterLink
        to="/"
        class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          isActive('/') 
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        ]"
      >
        <LayoutDashboard class="w-5 h-5" />
        <span>Дашборд</span>
      </RouterLink>

      <!-- Товары -->
      <div>
        <button
          @click="toggleMenu('products')"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <div class="flex items-center space-x-3">
            <Package class="w-5 h-5" />
            <span>Товары</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openMenus.products }"
          />
        </button>
        
        <!-- Подменю товаров -->
        <div v-if="openMenus.products" class="ml-11 mt-1 space-y-1">
          <RouterLink
            to="/products"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/products') && !isActive('/products/categories') && !isActive('/products/new')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Все товары
          </RouterLink>
          <RouterLink
            to="/products/categories"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/products/categories')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Категории
          </RouterLink>
          <RouterLink
            to="/products/new"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/products/new')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Добавить товар
          </RouterLink>
        </div>
      </div>

      <!-- Заказы -->
      <div>
        <button
          @click="toggleMenu('orders')"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <div class="flex items-center space-x-3">
            <ShoppingCart class="w-5 h-5" />
            <span>Заказы</span>
            <span class="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openMenus.orders }"
          />
        </button>
        
        <!-- Подменю заказов -->
        <div v-if="openMenus.orders" class="ml-11 mt-1 space-y-1">
          <RouterLink
            to="/orders"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/orders') && !isActive('/orders/refunds') && !isActive('/orders/shipping')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Все заказы
          </RouterLink>
          <RouterLink
            to="/orders/refunds"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/orders/refunds')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Возвраты
          </RouterLink>
          <RouterLink
            to="/orders/shipping"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/orders/shipping')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Доставка
          </RouterLink>
        </div>
      </div>

      <!-- Клиенты -->
      <RouterLink
        to="/customers"
        class="flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200"
        :class="[
          isActive('/customers') 
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200' 
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        ]"
      >
        <Users class="w-5 h-5" />
        <span>Клиенты</span>
      </RouterLink>

      <!-- Аналитика -->
      <div>
        <button
          @click="toggleMenu('analytics')"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <div class="flex items-center space-x-3">
            <BarChart3 class="w-5 h-5" />
            <span>Аналитика</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openMenus.analytics }"
          />
        </button>
        
        <!-- Подменю аналитики -->
        <div v-if="openMenus.analytics" class="ml-11 mt-1 space-y-1">
          <RouterLink
            to="/analytics/sales"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/analytics/sales')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Продажи
          </RouterLink>
          <RouterLink
            to="/analytics/products"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/analytics/products')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Товары
          </RouterLink>
          <RouterLink
            to="/analytics/reports"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/analytics/reports')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Отчеты
          </RouterLink>
        </div>
      </div>

      <!-- Маркетинг -->
      <div>
        <button
          @click="toggleMenu('marketing')"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <div class="flex items-center space-x-3">
            <Tag class="w-5 h-5" />
            <span>Маркетинг</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openMenus.marketing }"
          />
        </button>
        
        <!-- Подменю маркетинга -->
        <div v-if="openMenus.marketing" class="ml-11 mt-1 space-y-1">
          <RouterLink
            to="/marketing/promotions"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/marketing/promotions')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Акции
          </RouterLink>
          <RouterLink
            to="/marketing/coupons"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/marketing/coupons')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Купоны
          </RouterLink>
        </div>
      </div>

      <!-- Настройки -->
      <div>
        <button
          @click="toggleMenu('settings')"
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <div class="flex items-center space-x-3">
            <Settings class="w-5 h-5" />
            <span>Настройки</span>
          </div>
          <ChevronDown 
            class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': openMenus.settings }"
          />
        </button>
        
        <!-- Подменю настроек -->
        <div v-if="openMenus.settings" class="ml-11 mt-1 space-y-1">
          <RouterLink
            to="/settings/profile"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/settings/profile')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Профиль
          </RouterLink>
          <RouterLink
            to="/settings/store"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/settings/store')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Магазин
          </RouterLink>
          <RouterLink
            to="/settings/users"
            class="block px-4 py-2 text-sm rounded-lg transition-colors duration-200"
            :class="[
              isActive('/settings/users')
                ? 'text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            ]"
          >
            Пользователи
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Футер с пользователем -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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
    v-if="isMobile && isOpen"
    class="fixed inset-0 z-30 bg-gray-600 bg-opacity-75 transition-opacity"
    @click="closeSidebar"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { 
  ShoppingBag, LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Tag, Settings, LogOut, ChevronDown 
} from "lucide-vue-next";
import { useUIStore } from "@/stores/ui";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const uiStore = useUIStore();
const authStore = useAuthStore();

const { isSidebarOpen } = storeToRefs(uiStore);
const { getUser: user } = storeToRefs(authStore);

// Состояние открытых меню
const openMenus = ref({
  products: false,
  orders: false,
  analytics: false,
  marketing: false,
  settings: false
});

// Мобильность
const isMobile = ref(window.innerWidth < 1024);

const updateMobile = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 1024;
  
  if (!wasMobile && isMobile.value) {
    uiStore.setSidebarOpen(false);
  }
  
  if (wasMobile && !isMobile.value) {
    uiStore.setSidebarOpen(true);
  }
};

onMounted(() => {
  window.addEventListener('resize', updateMobile);
  updateMobile();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateMobile);
});

const isOpen = computed(() => isSidebarOpen.value);

const toggleMenu = (menu: string) => {
  openMenus.value[menu] = !openMenus.value[menu];
};

const isActive = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(path);
};

const closeSidebar = () => {
  uiStore.setSidebarOpen(false);
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
</script>