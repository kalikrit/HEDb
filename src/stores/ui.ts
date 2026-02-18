import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { STORAGE_KEYS } from "@/utils/constants";

export const useUIStore = defineStore("ui", () => {
  // ==================== State ====================
  const isSidebarOpen = ref(true); // Начальное значение
  const theme = ref<"light" | "dark">("light");
  const isLoading = ref(false);
  const loadingMessage = ref("");
  const notifications = ref<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([]);
  const currentView = ref("dashboard");
  
  // Флаг для блокировки изменений из роутера
  let isInitialized = false;

  // ==================== Getters ====================
  const getTheme = computed(() => theme.value);
  const getIsSidebarOpen = computed(() => isSidebarOpen.value);
  const getIsLoading = computed(() => isLoading.value);
  const getLoadingMessage = computed(() => loadingMessage.value);
  const getNotifications = computed(() => notifications.value);
  const getCurrentView = computed(() => currentView.value);

  // ==================== Actions ====================
  
  // Тема
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    applyTheme();
  };

  const setTheme = (newTheme: "light" | "dark") => {
    theme.value = newTheme;
    applyTheme();
  };

  const applyTheme = () => {
    if (theme.value === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme.value);
  };

  // 👇 ЕДИНСТВЕННОЕ МЕСТО, ГДЕ МЕНЯЕТСЯ САЙДБАР
  const toggleSidebar = () => {
    console.log('🔄 toggleSidebar called, current:', isSidebarOpen.value);
    isSidebarOpen.value = !isSidebarOpen.value;
    console.log('🔄 new value:', isSidebarOpen.value);
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(isSidebarOpen.value));
  };

  const setSidebarOpen = (open: boolean) => {
    if (isSidebarOpen.value !== open) {
      console.log('📌 setSidebarOpen:', open);
      isSidebarOpen.value = open;
      localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(open));
    }
  };

  // Загрузка
  const startLoading = (message = "Загрузка...") => {
    isLoading.value = true;
    loadingMessage.value = message;
  };

  const stopLoading = () => {
    isLoading.value = false;
    loadingMessage.value = "";
  };

  const withLoading = async <T>(callback: () => Promise<T>, message = "Загрузка..."): Promise<T> => {
    startLoading(message);
    try {
      const result = await callback();
      return result;
    } finally {
      stopLoading();
    }
  };

  // Уведомления
  const addNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString();
    notifications.value.push({ id, message, type });
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(notification => notification.id !== id);
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  // Навигация
  const setCurrentView = (view: string) => {
    currentView.value = view;
  };

  // ==================== Инициализация ====================
  const init = () => {
    console.log('📌 UI Store initializing...');
    
    // Восстанавливаем тему
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme.value = savedTheme || (prefersDark ? "dark" : "light");
    applyTheme();

    // Восстанавливаем состояние sidebar - ТОЛЬКО если нет сохраненного значения
    const savedSidebarState = localStorage.getItem(STORAGE_KEYS.SIDEBAR_STATE);
    if (savedSidebarState !== null) {
      // Убираем setSidebarOpen, присваиваем напрямую
      isSidebarOpen.value = JSON.parse(savedSidebarState);
      console.log('📌 Restored sidebar from localStorage:', isSidebarOpen.value);
    } else {
      // Если нет сохраненного значения, оставляем true (по умолчанию)
      console.log('📌 Using default sidebar value:', isSidebarOpen.value);
    }
    
    console.log('📌 UI Store initialized, sidebar:', isSidebarOpen.value);
    isInitialized = true;
  };

  // ==================== Watch для сохранения ====================
  watch(isSidebarOpen, (newVal) => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_STATE, JSON.stringify(newVal));
    console.log('💾 Sidebar state saved:', newVal);
  });

  // ==================== Экспорт ====================
  return {
    // State
    isSidebarOpen,
    theme,
    isLoading,
    loadingMessage,
    notifications,
    currentView,

    // Getters
    getTheme,
    getIsSidebarOpen,
    getIsLoading,
    getLoadingMessage,
    getNotifications,
    getCurrentView,

    toggleTheme,
    setTheme,
    toggleSidebar,
    setSidebarOpen,
    startLoading,
    stopLoading,
    withLoading,
    addNotification,
    removeNotification,
    clearNotifications,
    setCurrentView,
    init,
  };
});